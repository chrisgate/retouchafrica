"use client";

import { useActionState, useState } from "react";
import {
  submitContactFormAction,
  submitJoinCommunityFormAction,
  submitPartnerInquiryFormAction,
  type SubmitFormState,
} from "@/lib/actions/submissions";
import { TurnstileWidget } from "@/components/forms/TurnstileWidget";

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
const TURNSTILE_RESPONSE_FIELD = "cf-turnstile-response";

const inputClass = "mt-1 w-full border border-ink/20 px-3 py-2 text-sm focus:border-gold focus:outline-none";
const labelClass = "text-xs font-medium uppercase tracking-wide text-ink/60";

export function ContactFormClient({
  type = "CONTACT",
  submitLabel = "Send Message",
  successMessage = "Thanks — we've received your message and will be in touch soon.",
  formToken,
  turnstileSiteKey,
}: {
  type?: ContactFormType;
  submitLabel?: string;
  successMessage?: string;
  formToken: string;
  /** null when Turnstile isn't configured — the form then relies on the other protections. */
  turnstileSiteKey: string | null;
}) {
  const [state, formAction, pending] = useActionState<SubmitFormState, FormData>(ACTIONS[type], undefined);

  // React resets uncontrolled fields after every form action — including a
  // rejected one — so values live in state to keep a visitor's message intact
  // when they hit an error (e.g. "please wait a moment").
  const [values, setValues] = useState({ name: "", email: "", phone: "", message: "" });
  // Turnstile tokens are single-use: cleared on every submit, re-issued by the
  // widget (reset whenever the action returns) before the button re-enables.
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaFailed, setCaptchaFailed] = useState(false);
  const awaitingCaptcha = turnstileSiteKey !== null && captchaToken === "";

  function submitAction(formData: FormData) {
    setCaptchaToken("");
    formAction(formData);
  }

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
    <form action={submitAction} className="flex flex-col gap-4">
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

      {turnstileSiteKey && (
        <div>
          <input type="hidden" name={TURNSTILE_RESPONSE_FIELD} value={captchaToken} />
          <TurnstileWidget
            siteKey={turnstileSiteKey}
            onToken={(token) => {
              setCaptchaToken(token);
              if (token) setCaptchaFailed(false);
            }}
            onFailure={() => setCaptchaFailed(true)}
            resetKey={state}
          />
          {captchaFailed && (
            <p role="alert" className="mt-2 text-sm text-red-600">
              We couldn&apos;t load the security check. Please refresh the page, or turn off any content blocker for
              this site, and try again.
            </p>
          )}
        </div>
      )}

      {state?.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || awaitingCaptcha}
        className="mt-2 w-fit bg-gold px-7 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-ink transition-colors hover:bg-gold-soft disabled:opacity-50"
      >
        {pending ? "Sending…" : awaitingCaptcha ? "Verifying…" : submitLabel}
      </button>
    </form>
  );
}
