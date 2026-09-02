"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { saveUpload, deleteUpload } from "@/lib/uploads";
import { galleryImageSchema, formatZodError } from "@/lib/validation/schemas";

export type GalleryImageFormState = { error?: string } | undefined;

function revalidateGalleryPaths() {
  revalidatePath("/");
  revalidatePath("/gallery");
}

export async function createGalleryImageAction(
  _prevState: GalleryImageFormState,
  formData: FormData,
): Promise<GalleryImageFormState> {
  await requireAdmin();

  const parsed = galleryImageSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: formatZodError(parsed.error) };

  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "An image file is required." };
  }

  let imageUrl: string;
  try {
    imageUrl = await saveUpload(file, "gallery");
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to upload image." };
  }

  await prisma.galleryImage.create({
    data: {
      imageUrl,
      caption: parsed.data.caption || null,
      category: parsed.data.category || null,
      order: parsed.data.order,
      isPublished: parsed.data.isPublished,
    },
  });

  revalidateGalleryPaths();
  redirect("/admin/gallery");
}

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
