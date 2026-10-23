import { Hero } from "@/components/home/Hero";
import { OurStory } from "@/components/home/OurStory";
import { UpcomingWorkshop } from "@/components/home/UpcomingWorkshop";
import { FacilitatorsPreview } from "@/components/home/FacilitatorsPreview";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { PartnersStrip } from "@/components/home/PartnersStrip";
import { CTASection } from "@/components/shared/CTASection";
import { getSiteSettings } from "@/lib/site-settings";
import { getSocialLinks, getHeroImages, getFeaturedWorkshop } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, heroImages, featuredWorkshop, socialLinks] = await Promise.all([
    getSiteSettings(),
    getHeroImages(),
    getFeaturedWorkshop(),
    getSocialLinks(),
  ]);

  return (
    <>
      <Hero settings={settings} images={heroImages.map((image) => image.imageUrl)} />
      <OurStory settings={settings} />
      <UpcomingWorkshop workshop={featuredWorkshop} />
      <FacilitatorsPreview />
      <GalleryPreview />
      <PartnersStrip />
      <CTASection heading={settings.footerHeading} body={settings.footerBody} socialLinks={socialLinks} />
    </>
  );
}
