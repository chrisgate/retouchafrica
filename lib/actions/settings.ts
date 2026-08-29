"use server";

import { revalidatePath, updateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { siteSettingsSchema } from "@/lib/validation/schemas";

export async function updateSiteSettingsAction(formData: FormData) {
  await requireAdmin();

  const raw = Object.fromEntries(formData.entries());
  const parsed = siteSettingsSchema.parse(raw);

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: parsed,
    create: { id: 1, ...parsed },
  });

  updateTag("site-settings");
  revalidatePath("/");
  revalidatePath("/about");
}
