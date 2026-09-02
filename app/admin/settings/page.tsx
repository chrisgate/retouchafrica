import { getSiteSettings } from "@/lib/site-settings";
import { SiteSettingsForm } from "@/components/admin/forms/SiteSettingsForm";

export default async function AdminSettingsPage() {
  const s = await getSiteSettings();

  return (
    <div>
      <h1 className="font-display text-2xl">Site Settings</h1>
      <SiteSettingsForm settings={s} />
    </div>
  );
}
