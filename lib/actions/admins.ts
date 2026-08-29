"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth";
import { createAdminUserSchema } from "@/lib/validation/schemas";

export async function createAdminUserAction(formData: FormData) {
  await requireSuperAdmin();

  const parsed = createAdminUserSchema.parse(Object.fromEntries(formData.entries()));
  const passwordHash = await bcrypt.hash(parsed.password, 10);

  await prisma.adminUser.create({
    data: { email: parsed.email, passwordHash, isSuperAdmin: parsed.isSuperAdmin },
  });

  revalidatePath("/admin/users");
}

export async function deleteAdminUserAction(id: string) {
  const { session } = await requireSuperAdmin();

  if (id === session.userId) {
    throw new Error("You can't remove your own admin account.");
  }

  const total = await prisma.adminUser.count();
  if (total <= 1) {
    throw new Error("At least one admin account must remain.");
  }

  await prisma.adminUser.delete({ where: { id } });
  revalidatePath("/admin/users");
}
