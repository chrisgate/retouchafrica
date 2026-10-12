"use client";

import { useActionState, useState } from "react";
import {
  submitContactFormAction,
  submitJoinCommunityFormAction,
  submitPartnerInquiryFormAction,
  type SubmitFormState,
} from "@/lib/actions/submissions";

const ACTIONS = {
  CONTACT: submitContactFormAction,
  JOIN_COMMUNITY: submitJoinCommunityFormAction,
  PARTNER_INQUIRY: submitPartnerInquiryFormAction,
} as const;

export type ContactFormType = keyof typeof ACTIONS;

// Keep in sync with HONEYPOT_FIELD / FORM_TOKEN_FIELD in lib/spam-guard.ts
// (that module is server-only, so the names can't be imported here).
const HONEYPOT_FIELD = "hp_fax";
const FORM_TOKEN_FIELD = "form_token";

const inputClass = "mt-1 w-full border border-ink/20 px-3 py-2 text-sm focus:border-gold focus:outline-none";
const labelClass = "text-xs font-medium uppercase tracking-wide text-ink/60";

export function ContactFormClient({
  type = "CONTACT",
  submitLabel = "Send Message",
  successMessage = "Thanks — we've received your message and will be in touch soon.",
  formToken,
}: {
  type?: ContactFormType;
  submitLabel?: string;
  successMessage?: string;
  formToken: string;
}) {
  const [state, formAction, pending] = useActionState<SubmitFormState, FormData>(ACTIONS[type], undefined);

  // React resets uncontrolled fields after every form action — including a
  // rejected one — so values live in state to keep a visitor's message intact
  // when they hit an error (e.g. "please wait a moment").
  const [values, setValues] = useState({ name: "", email: "", phone: "", message: "" });
  const bind = (field: keyof typeof values) => ({
    name: field,
    value: values[field],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((prev) => ({ ...prev, [field]: e.target.value })),
  });

  if (state?.success) {
    return (
      <div className="border border-gold/40 bg-gold/5 p-6 text-sm text-ink/80">{successMessage}</div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name={FORM_TOKEN_FIELD} value={formToken} />

      {/* Honeypot: invisible to people and assistive tech, irresistible to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={HONEYPOT_FIELD}>Leave this field empty</label>
        <input id={HONEYPOT_FIELD} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Name
          </label>
          <input id="name" required maxLength={120} className={inputClass} {...bind("name")} />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input id="email" type="email" required maxLength={254} className={inputClass} {...bind("email")} />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className={labelClass}>
          Phone (optional)
        </label>
        <input id="phone" maxLength={40} className={inputClass} {...bind("phone")} />
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Message
        </label>
        <textarea id="message" rows={4} maxLength={5000} className={inputClass} {...bind("message")} />
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 w-fit bg-gold px-7 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-ink transition-colors hover:bg-gold-soft disabled:opacity-50"
      >
        {pending ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}
