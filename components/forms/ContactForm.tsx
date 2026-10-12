import { ContactFormClient, type ContactFormType } from "@/components/forms/ContactFormClient";
import { createFormToken } from "@/lib/spam-guard";
import { getTurnstileSiteKey } from "@/lib/turnstile";

/**
 * Server wrapper so every render of a form page gets a fresh signed token
 * (see lib/spam-guard.ts) and, when configured, the Turnstile site key (read
 * here at request time so it works as a plain runtime env var).
 * Pages keep using <ContactForm /> unchanged.
 */
export function ContactForm(props: {
  type?: ContactFormType;
  submitLabel?: string;
  successMessage?: string;
}) {
  return <ContactFormClient {...props} formToken={createFormToken()} turnstileSiteKey={getTurnstileSiteKey()} />;
}
