import type { GalleryImage } from "@prisma/client";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Field, Checkbox } from "@/components/admin/forms/fields";

export function GalleryImageForm({
  action,
  image,
}: {
  action: (formData: FormData) => void | Promise<void>;
  image?: GalleryImage;
}) {
  return (
    <form action={action} className="flex max-w-xl flex-col gap-5">
      <ImageUploadField name="image" label="Image" currentUrl={image?.imageUrl} />
      <Field label="Caption" name="caption" defaultValue={image?.caption ?? ""} />
      <Field label="Category" name="category" defaultValue={image?.category ?? ""} />
      <Field label="Order" name="order" type="number" defaultValue={String(image?.order ?? 0)} />
      <Checkbox label="Published" name="isPublished" defaultChecked={image?.isPublished ?? true} />

      <button
        type="submit"
        className="mt-2 w-fit bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-paper hover:bg-ink/80"
      >
        Save Image
      </button>
    </form>
  );
}
