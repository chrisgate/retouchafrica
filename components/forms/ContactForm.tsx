"use client";

import { useActionState } from "react";
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

export function ContactForm({
  type = "CONTACT",
  submitLabel = "Send Message",
  successMessage = "Thanks — we've received your message and will be in touch soon.",
}: {
  type?: keyof typeof ACTIONS;
  submitLabel?: string;
  successMessage?: string;
}) {
  const [state, formAction, pending] = useActionState<SubmitFormState, FormData>(ACTIONS[type], undefined);

  if (state?.success) {
    return (
      <div className="border border-gold/40 bg-gold/5 p-6 text-sm text-ink/80">{successMessage}</div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-xs font-medium uppercase tracking-wide text-ink/60">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            className="mt-1 w-full border border-ink/20 px-3 py-2 text-sm focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="email" className="text-xs font-medium uppercase tracking-wide text-ink/60">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 w-full border border-ink/20 px-3 py-2 text-sm focus:border-gold focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="text-xs font-medium uppercase tracking-wide text-ink/60">
          Phone (optional)
        </label>
        <input
          id="phone"
          name="phone"
          className="mt-1 w-full border border-ink/20 px-3 py-2 text-sm focus:border-gold focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="message" className="text-xs font-medium uppercase tracking-wide text-ink/60">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="mt-1 w-full border border-ink/20 px-3 py-2 text-sm focus:border-gold focus:outline-none"
        />
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

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
