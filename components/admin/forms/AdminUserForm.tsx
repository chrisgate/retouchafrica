"use client";

import { useActionState } from "react";
import { createAdminUserAction } from "@/lib/actions/admins";
import { Field, Checkbox, FormError } from "@/components/admin/forms/fields";

export function AdminUserForm() {
  const [state, formAction, pending] = useActionState(createAdminUserAction, undefined);

  return (
    <form action={formAction} className="mt-4 flex flex-col gap-4">
      <FormError message={state?.error} />
      <Field label="Email" name="email" type="email" required />
      <Field label="Password (min. 8 characters)" name="password" type="password" required />
      <Checkbox label="Grant super admin (can manage other admins)" name="isSuperAdmin" />
      <button
        type="submit"
        disabled={pending}
        className="mt-2 w-fit bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-paper hover:bg-ink/80 disabled:opacity-50"
      >
        {pending ? "Adding…" : "Add Admin"}
      </button>
    </form>
  );
}
