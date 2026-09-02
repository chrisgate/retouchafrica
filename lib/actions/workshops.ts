"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { saveUpload, deleteUpload } from "@/lib/uploads";
import { workshopSchema, formatZodError } from "@/lib/validation/schemas";

export type WorkshopFormState = { error?: string } | undefined;

function revalidateWorkshopPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/workshop");
  if (slug) revalidatePath(`/workshop/${slug}`);
}

function isUniqueSlugError(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

async function collectGalleryImages(formData: FormData, folder = "workshops"): Promise<string[]> {
  const files = formData.getAll("galleryImages").filter((f): f is File => f instanceof File && f.size > 0);
  const uploaded = await Promise.all(files.map((file) => saveUpload(file, folder as never)));
  const existing = formData.getAll("existingGalleryImages").map(String).filter(Boolean);
  return [...existing, ...uploaded];
}

export async function createWorkshopAction(
  _prevState: WorkshopFormState,
  formData: FormData,
): Promise<WorkshopFormState> {
  await requireAdmin();

  const parsed = workshopSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: formatZodError(parsed.error) };

  let galleryImages: string[];
  let heroImageUrl: string | undefined;
  try {
    galleryImages = await collectGalleryImages(formData);
    const heroFile = formData.get("heroImage");
    heroImageUrl = heroFile instanceof File && heroFile.size > 0 ? await saveUpload(heroFile, "workshops") : undefined;
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to upload image." };
  }

  try {
    await prisma.workshop.create({
      data: {
        ...parsed.data,
        venueLabel: parsed.data.venueLabel || null,
        registerUrl: parsed.data.registerUrl || null,
        heroImageUrl,
        galleryImages,
      },
    });
  } catch (error) {
    if (isUniqueSlugError(error)) return { error: "A workshop with this slug already exists." };
    throw error;
  }

  revalidateWorkshopPaths(parsed.data.slug);
  redirect("/admin/workshops");
}

export async function updateWorkshopAction(
  id: string,
  _prevState: WorkshopFormState,
  formData: FormData,
): Promise<WorkshopFormState> {
  await requireAdmin();

  const parsed = workshopSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: formatZodError(parsed.error) };

  let galleryImages: string[];
  let heroImageUrl: string | undefined;
  try {
    galleryImages = await collectGalleryImages(formData);
    const heroFile = formData.get("heroImage");
    heroImageUrl = heroFile instanceof File && heroFile.size > 0 ? await saveUpload(heroFile, "workshops") : undefined;
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to upload image." };
  }

  try {
    await prisma.workshop.update({
      where: { id },
      data: {
        ...parsed.data,
        venueLabel: parsed.data.venueLabel || null,
        registerUrl: parsed.data.registerUrl || null,
        galleryImages,
        ...(heroImageUrl ? { heroImageUrl } : {}),
      },
    });
  } catch (error) {
    if (isUniqueSlugError(error)) return { error: "A workshop with this slug already exists." };
    throw error;
  }

  revalidateWorkshopPaths(parsed.data.slug);
  redirect("/admin/workshops");
}

export async function deleteWorkshopAction(id: string) {
  await requireAdmin();

  const workshop = await prisma.workshop.delete({ where: { id } });
  await deleteUpload(workshop.heroImageUrl);
  await Promise.all(workshop.galleryImages.map((url) => deleteUpload(url)));

  revalidateWorkshopPaths(workshop.slug);
}
