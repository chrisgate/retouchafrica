"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { sendSubmissionNotification } from "@/lib/mail";
import {
  FORM_TOKEN_FIELD,
  HONEYPOT_FIELD,
  checkFormToken,
  checkRateLimits,
  hasTooManyLinks,
  isHoneypotTripped,
} from "@/lib/spam-guard";
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

  // Bots fill the hidden honeypot. Pretend it worked so they don't adapt.
  if (isHoneypotTripped(formData.get(HONEYPOT_FIELD))) {
    return { success: true };
  }

  const token = checkFormToken(formData.get(FORM_TOKEN_FIELD));
  if (token === "tooFast") {
    return { error: "That was a little quick — please wait a moment and send again." };
  }
  if (token !== "ok") {
    return { error: "This form has expired. Please refresh the page and try again." };
  }

  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: "Please check the form for errors and try again." };
  }

  if (hasTooManyLinks(parsed.data.name, parsed.data.message)) {
    return { error: "Please remove the links from your message and try again." };
  }

  const limit = await checkRateLimits(parsed.data.email);
  if (limit !== "ok") {
    return { error: "We've received several messages already — please try again a little later." };
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
