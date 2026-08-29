import { Hero } from "@/components/home/Hero";
import { OurStory } from "@/components/home/OurStory";
import { UpcomingWorkshop } from "@/components/home/UpcomingWorkshop";
import { FacilitatorsPreview } from "@/components/home/FacilitatorsPreview";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { PartnersStrip } from "@/components/home/PartnersStrip";
import { CTASection } from "@/components/shared/CTASection";
import { getSiteSettings } from "@/lib/site-settings";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, featuredWorkshop, socialLinks] = await Promise.all([
    getSiteSettings(),
    prisma.workshop.findFirst({
      where: { isFeatured: true, isPublished: true },
      orderBy: { startDate: "asc" },
    }),
    prisma.socialLink.findMany({ where: { facilitatorId: null }, orderBy: { order: "asc" } }),
  ]);

  return (
    <>
      <Hero settings={settings} />
      <OurStory settings={settings} />
      <UpcomingWorkshop workshop={featuredWorkshop} />
      <FacilitatorsPreview />
      <GalleryPreview />
      <PartnersStrip />
      <CTASection heading={settings.footerHeading} body={settings.footerBody} socialLinks={socialLinks} />
    </>
  );
}
