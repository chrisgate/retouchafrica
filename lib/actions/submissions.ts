"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { sendSubmissionNotification } from "@/lib/mail";
import {
  contactFormSchema,
  joinCommunityFormSchema,
  partnerInquiryFormSchema,
} from "@/lib/validation/schemas";

export type SubmitFormState = { success?: boolean; error?: string } | undefined;

async function submit(
  type: "CONTACT" | "JOIN_COMMUNITY" | "PARTNER_INQUIRY",
  formData: FormData
): Promise<SubmitFormState> {
  const schema =
    type === "CONTACT"
      ? contactFormSchema
      : type === "JOIN_COMMUNITY"
        ? joinCommunityFormSchema
        : partnerInquiryFormSchema;

  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: "Please check the form for errors and try again." };
  }

  await prisma.submission.create({
    data: {
      type,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      message: parsed.data.message || null,
    },
  });

  await sendSubmissionNotification({
    type,
    name: parsed.data.name,
    email: parsed.data.email,
    message: parsed.data.message,
  });

  return { success: true };
}

export async function submitContactFormAction(
  _prevState: SubmitFormState,
  formData: FormData
): Promise<SubmitFormState> {
  return submit("CONTACT", formData);
}

export async function submitJoinCommunityFormAction(
  _prevState: SubmitFormState,
  formData: FormData
): Promise<SubmitFormState> {
  return submit("JOIN_COMMUNITY", formData);
}

export async function submitPartnerInquiryFormAction(
  _prevState: SubmitFormState,
  formData: FormData
): Promise<SubmitFormState> {
  return submit("PARTNER_INQUIRY", formData);
}

export async function markSubmissionStatusAction(id: string, status: "NEW" | "READ" | "ARCHIVED") {
  await requireAdmin();
  await prisma.submission.update({ where: { id }, data: { status } });
  revalidatePath("/admin/submissions");
}
