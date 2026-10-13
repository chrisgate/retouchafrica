import { getSiteSettings } from "@/lib/site-settings";
import { prisma } from "@/lib/prisma";
import { SiteSettingsForm } from "@/components/admin/forms/SiteSettingsForm";

export default async function AdminSettingsPage() {
  const [s, heroImages] = await Promise.all([
    getSiteSettings(),
    prisma.heroImage.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }], select: { id: true, imageUrl: true } }),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl">Site Settings</h1>
      <SiteSettingsForm settings={s} heroImages={heroImages} />
    </div>
  );
}
