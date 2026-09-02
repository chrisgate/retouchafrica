"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { saveUpload, deleteUpload } from "@/lib/uploads";
import { partnerSchema, formatZodError } from "@/lib/validation/schemas";

export type PartnerFormState = { error?: string } | undefined;

function revalidatePartnerPaths() {
  revalidatePath("/");
  revalidatePath("/partners");
}

export async function createPartnerAction(
  _prevState: PartnerFormState,
  formData: FormData,
): Promise<PartnerFormState> {
  await requireAdmin();

  const parsed = partnerSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: formatZodError(parsed.error) };

  const file = formData.get("logo");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "A logo file is required." };
  }

  let logoUrl: string;
  try {
    logoUrl = await saveUpload(file, "partners");
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to upload logo." };
  }

  await prisma.partner.create({
    data: {
      name: parsed.data.name,
      websiteUrl: parsed.data.websiteUrl || null,
      order: parsed.data.order,
      isPublished: parsed.data.isPublished,
      logoUrl,
    },
  });

  revalidatePartnerPaths();
  redirect("/admin/partners");
}

export async function updatePartnerAction(
  id: string,
  _prevState: PartnerFormState,
  formData: FormData,
): Promise<PartnerFormState> {
  await requireAdmin();

  const parsed = partnerSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: formatZodError(parsed.error) };

  const file = formData.get("logo");
  let logoUrl: string | undefined;
  if (file instanceof File && file.size > 0) {
    try {
      logoUrl = await saveUpload(file, "partners");
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Failed to upload logo." };
    }
  }

  await prisma.partner.update({
    where: { id },
    data: {
      name: parsed.data.name,
      websiteUrl: parsed.data.websiteUrl || null,
      order: parsed.data.order,
      isPublished: parsed.data.isPublished,
      ...(logoUrl ? { logoUrl } : {}),
    },
  });

  revalidatePartnerPaths();
  redirect("/admin/partners");
}

export async function deletePartnerAction(id: string) {
  await requireAdmin();

  const partner = await prisma.partner.delete({ where: { id } });
  await deleteUpload(partner.logoUrl);

  revalidatePartnerPaths();
}
