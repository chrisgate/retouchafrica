"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { saveUpload, deleteUpload } from "@/lib/uploads";
import { workshopSchema } from "@/lib/validation/schemas";

function revalidateWorkshopPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/workshop");
  if (slug) revalidatePath(`/workshop/${slug}`);
}

async function collectGalleryImages(formData: FormData, folder = "workshops"): Promise<string[]> {
  const files = formData.getAll("galleryImages").filter((f): f is File => f instanceof File && f.size > 0);
  const uploaded = await Promise.all(files.map((file) => saveUpload(file, folder as never)));
  const existing = formData.getAll("existingGalleryImages").map(String).filter(Boolean);
  return [...existing, ...uploaded];
}

export async function createWorkshopAction(formData: FormData) {
  await requireAdmin();

  const parsed = workshopSchema.parse(Object.fromEntries(formData.entries()));
  const galleryImages = await collectGalleryImages(formData);

  const heroFile = formData.get("heroImage");
  const heroImageUrl =
    heroFile instanceof File && heroFile.size > 0 ? await saveUpload(heroFile, "workshops") : undefined;

  await prisma.workshop.create({
    data: {
      ...parsed,
      venueLabel: parsed.venueLabel || null,
      registerUrl: parsed.registerUrl || null,
      heroImageUrl,
      galleryImages,
    },
  });

  revalidateWorkshopPaths(parsed.slug);
  redirect("/admin/workshops");
}

export async function updateWorkshopAction(id: string, formData: FormData) {
  await requireAdmin();

  const parsed = workshopSchema.parse(Object.fromEntries(formData.entries()));
  const galleryImages = await collectGalleryImages(formData);

  const heroFile = formData.get("heroImage");
  const heroImageUrl =
    heroFile instanceof File && heroFile.size > 0 ? await saveUpload(heroFile, "workshops") : undefined;

  await prisma.workshop.update({
    where: { id },
    data: {
      ...parsed,
      venueLabel: parsed.venueLabel || null,
      registerUrl: parsed.registerUrl || null,
      galleryImages,
      ...(heroImageUrl ? { heroImageUrl } : {}),
    },
  });

  revalidateWorkshopPaths(parsed.slug);
  redirect("/admin/workshops");
}

export async function deleteWorkshopAction(id: string) {
  await requireAdmin();

  const workshop = await prisma.workshop.delete({ where: { id } });
  await deleteUpload(workshop.heroImageUrl);
  await Promise.all(workshop.galleryImages.map((url) => deleteUpload(url)));

  revalidateWorkshopPaths(workshop.slug);
}
