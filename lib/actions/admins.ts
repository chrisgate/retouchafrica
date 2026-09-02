"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth";
import { createAdminUserSchema, formatZodError } from "@/lib/validation/schemas";

export type AdminUserFormState = { error?: string } | undefined;

export async function createAdminUserAction(
  _prevState: AdminUserFormState,
  formData: FormData,
): Promise<AdminUserFormState> {
  await requireSuperAdmin();

  const parsed = createAdminUserSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: formatZodError(parsed.error) };

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  try {
    await prisma.adminUser.create({
      data: { email: parsed.data.email, passwordHash, isSuperAdmin: parsed.data.isSuperAdmin },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "An admin user with this email already exists." };
    }
    throw error;
  }

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
