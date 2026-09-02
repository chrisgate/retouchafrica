"use client";

import { useActionState } from "react";
import type { Partner } from "@prisma/client";
import type { PartnerFormState } from "@/lib/actions/partners";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Field, Checkbox, FormError } from "@/components/admin/forms/fields";

export function PartnerForm({
  action,
  partner,
}: {
  action: (prevState: PartnerFormState, formData: FormData) => PartnerFormState | Promise<PartnerFormState>;
  partner?: Partner;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      <FormError message={state?.error} />

      <Field label="Name" name="name" defaultValue={partner?.name} required />
      <Field label="Website URL" name="websiteUrl" defaultValue={partner?.websiteUrl ?? ""} />
      <ImageUploadField name="logo" label="Logo" currentUrl={partner?.logoUrl} />
      <Field label="Order" name="order" type="number" defaultValue={String(partner?.order ?? 0)} />
      <Checkbox label="Published" name="isPublished" defaultChecked={partner?.isPublished ?? true} />

      <button
        type="submit"
        disabled={pending}
        className="mt-2 w-fit bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-paper hover:bg-ink/80 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save Partner"}
      </button>
    </form>
  );
}
