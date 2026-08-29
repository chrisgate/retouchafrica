import { getSiteSettings } from "@/lib/site-settings";
import { updateSiteSettingsAction } from "@/lib/actions/settings";
import { Field, TextArea } from "@/components/admin/forms/fields";

export default async function AdminSettingsPage() {
  const s = await getSiteSettings();

  return (
    <div>
      <h1 className="font-display text-2xl">Site Settings</h1>

      <form action={updateSiteSettingsAction} className="mt-6 flex max-w-2xl flex-col gap-8">
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gold">Hero</h2>
          <Field label="Eyebrow" name="heroEyebrow" defaultValue={s.heroEyebrow} />
          <Field label="Title" name="heroTitle" defaultValue={s.heroTitle} />
          <Field label="Tagline" name="heroTagline" defaultValue={s.heroTagline} />
          <TextArea label="Body" name="heroBody" defaultValue={s.heroBody} rows={3} />
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gold">Our Story</h2>
          <Field label="Eyebrow" name="storyEyebrow" defaultValue={s.storyEyebrow} />
          <Field label="Heading" name="storyHeading" defaultValue={s.storyHeading} />
          <TextArea label="Body" name="storyBody" defaultValue={s.storyBody} rows={3} />
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gold">Mission / Vision / Impact</h2>
          <Field label="Mission title" name="missionTitle" defaultValue={s.missionTitle} />
          <TextArea label="Mission body" name="missionBody" defaultValue={s.missionBody} rows={2} />
          <Field label="Vision title" name="visionTitle" defaultValue={s.visionTitle} />
          <TextArea label="Vision body" name="visionBody" defaultValue={s.visionBody} rows={2} />
          <Field label="Impact title" name="impactTitle" defaultValue={s.impactTitle} />
          <TextArea label="Impact body" name="impactBody" defaultValue={s.impactBody} rows={2} />
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gold">Footer &amp; Contact</h2>
          <Field label="Footer heading" name="footerHeading" defaultValue={s.footerHeading} />
          <TextArea label="Footer body" name="footerBody" defaultValue={s.footerBody} rows={2} />
          <Field label="Contact email" name="contactEmail" defaultValue={s.contactEmail} />
          <Field label="Contact handle" name="contactHandle" defaultValue={s.contactHandle} />
          <Field label="Secondary handle" name="secondaryHandle" defaultValue={s.secondaryHandle ?? ""} />
          <Field label="Copyright line" name="copyrightLine" defaultValue={s.copyrightLine} />
        </section>

        <button
          type="submit"
          className="w-fit bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-paper hover:bg-ink/80"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
}
