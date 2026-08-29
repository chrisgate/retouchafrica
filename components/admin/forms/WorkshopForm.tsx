import type { Workshop } from "@prisma/client";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Field, TextArea, Checkbox } from "@/components/admin/forms/fields";

function toLocalInputValue(date?: Date | null) {
  if (!date) return "";
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export function WorkshopForm({
  action,
  workshop,
}: {
  action: (formData: FormData) => void | Promise<void>;
  workshop?: Workshop;
}) {
  return (
    <form action={action} className="flex max-w-2xl flex-col gap-5">
      {workshop?.galleryImages.map((url) => (
        <input key={url} type="hidden" name="existingGalleryImages" value={url} />
      ))}

      <Field label="Slug (lowercase-with-hyphens)" name="slug" defaultValue={workshop?.slug} required />
      <Field label="Title" name="title" defaultValue={workshop?.title} required />
      <Field label="Eyebrow" name="eyebrow" defaultValue={workshop?.eyebrow ?? "UPCOMING WORKSHOP"} />
      <TextArea label="Summary" name="summary" defaultValue={workshop?.summary} required rows={2} />
      <TextArea label="Description" name="description" defaultValue={workshop?.description} required rows={6} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Duration label" name="durationLabel" defaultValue={workshop?.durationLabel ?? "3 DAYS"} />
        <Field label="Seats label" name="seatsLabel" defaultValue={workshop?.seatsLabel ?? "LIMITED SEATS"} />
        <Field label="Location label" name="locationLabel" defaultValue={workshop?.locationLabel} required />
        <Field label="Venue label" name="venueLabel" defaultValue={workshop?.venueLabel ?? ""} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Start date & time"
          name="startDate"
          type="datetime-local"
          defaultValue={toLocalInputValue(workshop?.startDate)}
          required
        />
        <Field
          label="End date & time"
          name="endDate"
          type="datetime-local"
          defaultValue={toLocalInputValue(workshop?.endDate)}
        />
      </div>

      <Field label="External register URL (optional)" name="registerUrl" defaultValue={workshop?.registerUrl ?? ""} />

      <ImageUploadField name="heroImage" label="Hero image" currentUrl={workshop?.heroImageUrl} />
      <ImageUploadField name="galleryImages" label="Collage photos (add more)" multiple />

      <div className="flex gap-6">
        <Checkbox label="Featured on homepage" name="isFeatured" defaultChecked={workshop?.isFeatured ?? false} />
        <Checkbox label="Published" name="isPublished" defaultChecked={workshop?.isPublished ?? true} />
      </div>

      <button
        type="submit"
        className="mt-2 w-fit bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-paper hover:bg-ink/80"
      >
        Save Workshop
      </button>
    </form>
  );
}

