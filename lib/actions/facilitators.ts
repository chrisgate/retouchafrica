"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { saveUpload, deleteUpload } from "@/lib/uploads";
import { facilitatorSchema, socialLinkSchema } from "@/lib/validation/schemas";

function revalidateFacilitatorPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/facilitators");
  if (slug) revalidatePath(`/facilitators/${slug}`);
}

function parseSocialLinks(formData: FormData) {
  const platforms = formData.getAll("socialPlatform").map(String);
  const urls = formData.getAll("socialUrl").map(String);

  return platforms
    .map((platform, i) => ({ platform, url: urls[i], order: i }))
    .filter((link) => link.url.trim().length > 0)
    .map((link) => socialLinkSchema.parse(link));
}

export async function createFacilitatorAction(formData: FormData) {
  await requireAdmin();

  const parsed = facilitatorSchema.parse(Object.fromEntries(formData.entries()));
  const socialLinks = parseSocialLinks(formData);

  const photoFile = formData.get("photo");
  const photoUrl =
    photoFile instanceof File && photoFile.size > 0 ? await saveUpload(photoFile, "facilitators") : undefined;

  await prisma.facilitator.create({
    data: {
      ...parsed,
      photoUrl,
      socialLinks: { create: socialLinks },
    },
  });

  revalidateFacilitatorPaths(parsed.slug);
  redirect("/admin/facilitators");
}

export async function updateFacilitatorAction(id: string, formData: FormData) {
  await requireAdmin();

  const parsed = facilitatorSchema.parse(Object.fromEntries(formData.entries()));
  const socialLinks = parseSocialLinks(formData);

  const photoFile = formData.get("photo");
  const photoUrl =
    photoFile instanceof File && photoFile.size > 0 ? await saveUpload(photoFile, "facilitators") : undefined;

  await prisma.$transaction([
    prisma.socialLink.deleteMany({ where: { facilitatorId: id } }),
    prisma.facilitator.update({
      where: { id },
      data: {
        ...parsed,
        ...(photoUrl ? { photoUrl } : {}),
        socialLinks: { create: socialLinks },
      },
    }),
  ]);

  revalidateFacilitatorPaths(parsed.slug);
  redirect("/admin/facilitators");
}

export async function deleteFacilitatorAction(id: string) {
  await requireAdmin();

  const facilitator = await prisma.facilitator.delete({ where: { id } });
  await deleteUpload(facilitator.photoUrl);

  revalidateFacilitatorPaths(facilitator.slug);
}
