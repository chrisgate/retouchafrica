import { ContactFormClient, type ContactFormType } from "@/components/forms/ContactFormClient";
import { createFormToken } from "@/lib/spam-guard";

/**
 * Server wrapper so every render of a form page gets a fresh signed token
 * (see lib/spam-guard.ts). Pages keep using <ContactForm /> unchanged.
 */
export function ContactForm(props: {
  type?: ContactFormType;
  submitLabel?: string;
  successMessage?: string;
}) {
  return <ContactFormClient {...props} formToken={createFormToken()} />;
}
