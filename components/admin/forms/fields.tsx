"use client";

import { useState, type ChangeEvent, type FocusEvent } from "react";

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="border border-red-600/30 bg-red-600/5 px-3 py-2 text-sm text-red-600">{message}</p>;
}

// React resets *uncontrolled* fields in a <form action={...}> after every action
// call (mirroring native form-submit reset) — including on a failed submission.
// These stay controlled by local state instead, so a validation error doesn't
// wipe out everything the user typed.

export function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wide text-ink/60">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required={required}
        className="mt-1 w-full border border-ink/20 px-3 py-2 text-sm focus:border-gold focus:outline-none"
      />
    </div>
  );
}

export function TextArea({
  label,
  name,
  defaultValue,
  required,
  rows = 3,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  rows?: number;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wide text-ink/60">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required={required}
        rows={rows}
        className="mt-1 w-full border border-ink/20 px-3 py-2 text-sm focus:border-gold focus:outline-none"
      />
    </div>
  );
}

function sanitizeSlug(raw: string, { collapse = false }: { collapse?: boolean } = {}) {
  let value = raw.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
  if (collapse) value = value.replace(/-+/g, "-").replace(/^-|-$/g, "");
  return value;
}

/**
 * Sanitizes to lowercase-letters-numbers-hyphens as the user types (matching
 * the server's slug regex exactly), so the format can never fail validation —
 * only emptiness/uniqueness can still be rejected server-side.
 */
export function SlugField({
  label,
  name,
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
}) {
  const [value, setValue] = useState(() => sanitizeSlug(defaultValue ?? ""));

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const el = e.target;
    const cursor = el.selectionStart ?? el.value.length;
    const cursorInSanitized = sanitizeSlug(el.value.slice(0, cursor)).length;
    setValue(sanitizeSlug(el.value));
    requestAnimationFrame(() => el.setSelectionRange(cursorInSanitized, cursorInSanitized));
  }

  function handleBlur(e: FocusEvent<HTMLInputElement>) {
    setValue(sanitizeSlug(e.target.value, { collapse: true }));
  }

  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wide text-ink/60">{label}</label>
      <input
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        required={required}
        pattern="[a-z0-9-]+"
        className="mt-1 w-full border border-ink/20 px-3 py-2 text-sm focus:border-gold focus:outline-none"
      />
      <p className="mt-1 text-xs text-ink/40">Lowercase letters, numbers, and hyphens only — typed automatically.</p>
    </div>
  );
}

export function Checkbox({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked ?? false);
  return (
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        className="h-4 w-4"
      />
      {label}
    </label>
  );
}
