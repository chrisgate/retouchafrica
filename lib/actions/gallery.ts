"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { invalidateSiteData } from "@/lib/cache";
import { requireAdmin } from "@/lib/auth";
import { saveUpload, deleteUpload } from "@/lib/uploads";
import { galleryImageSchema, formatZodError } from "@/lib/validation/schemas";

export type GalleryImageFormState = { error?: string } | undefined;

function revalidateGalleryPaths() {
  invalidateSiteData();
  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}

// New photos are added through the batch uploader (POST /api/gallery/upload);
// this file only handles editing and removing existing ones.

export async function updateGalleryImageAction(
  id: string,
  _prevState: GalleryImageFormState,
  formData: FormData,
): Promise<GalleryImageFormState> {
  await requireAdmin();

  const parsed = galleryImageSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: formatZodError(parsed.error) };

  const file = formData.get("image");
  let imageUrl: string | undefined;
  if (file instanceof File && file.size > 0) {
    try {
      imageUrl = await saveUpload(file, "gallery");
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Failed to upload image." };
    }
  }

  await prisma.galleryImage.update({
    where: { id },
    data: {
      caption: parsed.data.caption || null,
      category: parsed.data.category || null,
      order: parsed.data.order,
      isPublished: parsed.data.isPublished,
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

export async function deleteGalleryImagesAction(ids: string[]) {
  await requireAdmin();
  if (ids.length === 0) return;

  const images = await prisma.galleryImage.findMany({ where: { id: { in: ids } } });
  await prisma.galleryImage.deleteMany({ where: { id: { in: images.map((image) => image.id) } } });
  await Promise.all(images.map((image) => deleteUpload(image.imageUrl)));

  revalidateGalleryPaths();
}
