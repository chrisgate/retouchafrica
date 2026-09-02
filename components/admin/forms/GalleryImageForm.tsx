"use client";

import { useActionState } from "react";
import type { GalleryImage } from "@prisma/client";
import type { GalleryImageFormState } from "@/lib/actions/gallery";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Field, Checkbox, FormError } from "@/components/admin/forms/fields";

export function GalleryImageForm({
  action,
  image,
}: {
  action: (
    prevState: GalleryImageFormState,
    formData: FormData,
  ) => GalleryImageFormState | Promise<GalleryImageFormState>;
  image?: GalleryImage;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      <FormError message={state?.error} />

      <ImageUploadField name="image" label="Image" currentUrl={image?.imageUrl} />
      <Field label="Caption" name="caption" defaultValue={image?.caption ?? ""} />
      <Field label="Category" name="category" defaultValue={image?.category ?? ""} />
      <Field label="Order" name="order" type="number" defaultValue={String(image?.order ?? 0)} />
      <Checkbox label="Published" name="isPublished" defaultChecked={image?.isPublished ?? true} />

      <button
        type="submit"
        disabled={pending}
        className="mt-2 w-fit bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-paper hover:bg-ink/80 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save Image"}
      </button>
    </form>
  );
}
