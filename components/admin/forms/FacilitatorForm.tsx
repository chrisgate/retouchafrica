"use client";

import { useActionState } from "react";
import type { Facilitator, SocialLink } from "@prisma/client";
import type { FacilitatorFormState } from "@/lib/actions/facilitators";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Field, TextArea, Checkbox, FormError, SlugField } from "@/components/admin/forms/fields";

const PLATFORMS = ["INSTAGRAM", "FACEBOOK", "TIKTOK", "YOUTUBE", "TWITTER", "LINKEDIN", "OTHER"];

export function FacilitatorForm({
  action,
  facilitator,
}: {
  action: (prevState: FacilitatorFormState, formData: FormData) => FacilitatorFormState | Promise<FacilitatorFormState>;
  facilitator?: Facilitator & { socialLinks: SocialLink[] };
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const existing = facilitator?.socialLinks ?? [];
  const socialRows = Array.from({ length: 4 }, (_, i) => existing[i] ?? { platform: "INSTAGRAM", url: "" });

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      <FormError message={state?.error} />

      <SlugField label="Slug" name="slug" defaultValue={facilitator?.slug} required />
      <Field label="Name" name="name" defaultValue={facilitator?.name} required />
      <Field label="Role" name="role" defaultValue={facilitator?.role} required />
      <TextArea label="Bio" name="bio" defaultValue={facilitator?.bio} required rows={4} />
      <Field label="Order" name="order" type="number" defaultValue={String(facilitator?.order ?? 0)} />

      <ImageUploadField name="photo" label="Photo" currentUrl={facilitator?.photoUrl} />

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-ink/60">Social links</p>
        <div className="mt-2 flex flex-col gap-2">
          {socialRows.map((s, i) => (
            <div key={i} className="flex gap-2">
              <select
                name="socialPlatform"
                defaultValue={s.platform}
                className="border border-ink/20 px-2 py-2 text-sm"
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <input
                name="socialUrl"
                defaultValue={s.url}
                placeholder="https://…"
                className="flex-1 border border-ink/20 px-3 py-2 text-sm"
              />
            </div>
          ))}
        </div>
        <p className="mt-1 text-xs text-ink/40">Leave URL blank to skip a row.</p>
      </div>

      <Checkbox label="Published" name="isPublished" defaultChecked={facilitator?.isPublished ?? true} />

      <button
        type="submit"
        disabled={pending}
        className="mt-2 w-fit bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-paper hover:bg-ink/80 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save Facilitator"}
      </button>
    </form>
  );
}
