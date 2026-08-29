"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { saveUpload, deleteUpload } from "@/lib/uploads";
import { galleryImageSchema } from "@/lib/validation/schemas";

function revalidateGalleryPaths() {
  revalidatePath("/");
  revalidatePath("/gallery");
}

export async function createGalleryImageAction(formData: FormData) {
  await requireAdmin();

  const parsed = galleryImageSchema.parse(Object.fromEntries(formData.entries()));
  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("An image file is required.");
  }
  const imageUrl = await saveUpload(file, "gallery");

  await prisma.galleryImage.create({
    data: {
      imageUrl,
      caption: parsed.caption || null,
      category: parsed.category || null,
      order: parsed.order,
      isPublished: parsed.isPublished,
    },
  });

  revalidateGalleryPaths();
  redirect("/admin/gallery");
}

export async function updateGalleryImageAction(id: string, formData: FormData) {
  await requireAdmin();

  const parsed = galleryImageSchema.parse(Object.fromEntries(formData.entries()));
  const file = formData.get("image");
  const imageUrl = file instanceof File && file.size > 0 ? await saveUpload(file, "gallery") : undefined;

  await prisma.galleryImage.update({
    where: { id },
    data: {
      caption: parsed.caption || null,
      category: parsed.category || null,
      order: parsed.order,
      isPublished: parsed.isPublished,
      ...(imageUrl ? { imageUrl } : {}),
    },
  });

  revalidateGalleryPaths();
  redirect("/admin/gallery");
}

export async function deleteGalleryImageAction(id: string) {
  await requireAdmin();

  const image = await prisma.galleryImage.delete({ where: { id } });
  await deleteUpload(image.imageUrl);

  revalidateGalleryPaths();
}
