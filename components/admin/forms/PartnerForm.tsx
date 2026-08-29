import type { Partner } from "@prisma/client";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Field, Checkbox } from "@/components/admin/forms/fields";

export function PartnerForm({
  action,
  partner,
}: {
  action: (formData: FormData) => void | Promise<void>;
  partner?: Partner;
}) {
  return (
    <form action={action} className="flex max-w-xl flex-col gap-5">
      <Field label="Name" name="name" defaultValue={partner?.name} required />
      <Field label="Website URL" name="websiteUrl" defaultValue={partner?.websiteUrl ?? ""} />
      <ImageUploadField name="logo" label="Logo" currentUrl={partner?.logoUrl} />
      <Field label="Order" name="order" type="number" defaultValue={String(partner?.order ?? 0)} />
      <Checkbox label="Published" name="isPublished" defaultChecked={partner?.isPublished ?? true} />

      <button
        type="submit"
        className="mt-2 w-fit bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-paper hover:bg-ink/80"
      >
        Save Partner
      </button>
    </form>
  );
}
