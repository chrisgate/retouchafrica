"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { saveUpload, deleteUpload } from "@/lib/uploads";
import { partnerSchema } from "@/lib/validation/schemas";

function revalidatePartnerPaths() {
  revalidatePath("/");
  revalidatePath("/partners");
}

export async function createPartnerAction(formData: FormData) {
  await requireAdmin();

  const parsed = partnerSchema.parse(Object.fromEntries(formData.entries()));
  const file = formData.get("logo");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("A logo file is required.");
  }
  const logoUrl = await saveUpload(file, "partners");

  await prisma.partner.create({
    data: {
      name: parsed.name,
      websiteUrl: parsed.websiteUrl || null,
      order: parsed.order,
      isPublished: parsed.isPublished,
      logoUrl,
    },
  });

  revalidatePartnerPaths();
  redirect("/admin/partners");
}

export async function updatePartnerAction(id: string, formData: FormData) {
  await requireAdmin();

  const parsed = partnerSchema.parse(Object.fromEntries(formData.entries()));
  const file = formData.get("logo");
  const logoUrl = file instanceof File && file.size > 0 ? await saveUpload(file, "partners") : undefined;

  await prisma.partner.update({
    where: { id },
    data: {
      name: parsed.name,
      websiteUrl: parsed.websiteUrl || null,
      order: parsed.order,
      isPublished: parsed.isPublished,
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
