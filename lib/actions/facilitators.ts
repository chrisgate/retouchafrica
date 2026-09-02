"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import type { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { saveUpload, deleteUpload } from "@/lib/uploads";
import { facilitatorSchema, socialLinkSchema, formatZodError } from "@/lib/validation/schemas";

export type FacilitatorFormState = { error?: string } | undefined;

function revalidateFacilitatorPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/facilitators");
  if (slug) revalidatePath(`/facilitators/${slug}`);
}

function parseSocialLinks(
  formData: FormData,
): { links: Array<z.infer<typeof socialLinkSchema>> } | { error: string } {
  const platforms = formData.getAll("socialPlatform").map(String);
  const urls = formData.getAll("socialUrl").map(String);

  const rows = platforms
    .map((platform, i) => ({ platform, url: urls[i], order: i }))
    .filter((link) => link.url.trim().length > 0);

  const links: Array<z.infer<typeof socialLinkSchema>> = [];
  for (const row of rows) {
    const parsed = socialLinkSchema.safeParse(row);
    if (!parsed.success) return { error: formatZodError(parsed.error) };
    links.push(parsed.data);
  }
  return { links };
}

function isUniqueSlugError(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

export async function createFacilitatorAction(
  _prevState: FacilitatorFormState,
  formData: FormData,
): Promise<FacilitatorFormState> {
  await requireAdmin();

  const parsed = facilitatorSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: formatZodError(parsed.error) };

  const socialLinks = parseSocialLinks(formData);
  if ("error" in socialLinks) return { error: socialLinks.error };

  const photoFile = formData.get("photo");
  let photoUrl: string | undefined;
  if (photoFile instanceof File && photoFile.size > 0) {
    try {
      photoUrl = await saveUpload(photoFile, "facilitators");
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Failed to upload photo." };
    }
  }

  try {
    await prisma.facilitator.create({
      data: {
        ...parsed.data,
        photoUrl,
        socialLinks: { create: socialLinks.links },
      },
    });
  } catch (error) {
    if (isUniqueSlugError(error)) return { error: "A facilitator with this slug already exists." };
    throw error;
  }

  revalidateFacilitatorPaths(parsed.data.slug);
  redirect("/admin/facilitators");
}

export async function updateFacilitatorAction(
  id: string,
  _prevState: FacilitatorFormState,
  formData: FormData,
): Promise<FacilitatorFormState> {
  await requireAdmin();

  const parsed = facilitatorSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: formatZodError(parsed.error) };

  const socialLinks = parseSocialLinks(formData);
  if ("error" in socialLinks) return { error: socialLinks.error };

  const photoFile = formData.get("photo");
  let photoUrl: string | undefined;
  if (photoFile instanceof File && photoFile.size > 0) {
    try {
      photoUrl = await saveUpload(photoFile, "facilitators");
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Failed to upload photo." };
    }
  }

  try {
    await prisma.$transaction([
      prisma.socialLink.deleteMany({ where: { facilitatorId: id } }),
      prisma.facilitator.update({
        where: { id },
        data: {
          ...parsed.data,
          ...(photoUrl ? { photoUrl } : {}),
          socialLinks: { create: socialLinks.links },
        },
      }),
    ]);
  } catch (error) {
    if (isUniqueSlugError(error)) return { error: "A facilitator with this slug already exists." };
    throw error;
  }

  revalidateFacilitatorPaths(parsed.data.slug);
  redirect("/admin/facilitators");
}

export async function deleteFacilitatorAction(id: string) {
  await requireAdmin();

  const facilitator = await prisma.facilitator.delete({ where: { id } });
  await deleteUpload(facilitator.photoUrl);

  revalidateFacilitatorPaths(facilitator.slug);
}
