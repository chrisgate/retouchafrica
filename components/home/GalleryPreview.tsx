import { EyebrowHeading } from "@/components/shared/EyebrowHeading";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/shared/Button";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { FadeIn } from "@/components/motion/FadeIn";
import { GsapScrollReveal } from "@/components/motion/GsapScrollReveal";
import { prisma } from "@/lib/prisma";

export async function GalleryPreview() {
  const images = await prisma.galleryImage.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
    take: 5,
  });

  if (images.length === 0) return null;

  return (
    <section className="bg-ink py-24">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn className="mb-10 flex items-end justify-between">
          <div>
            <EyebrowHeading>Gallery</EyebrowHeading>
            <SectionHeading className="mt-4 text-paper">Moments That Inspire</SectionHeading>
          </div>
          <Button href="/gallery" variant="outline-light" className="hidden sm:inline-flex">
            View Full Gallery
          </Button>
        </FadeIn>

        <GsapScrollReveal>
          <GalleryGrid images={images} variant="strip" />
        </GsapScrollReveal>

        <div className="mt-8 flex justify-center sm:hidden">
          <Button href="/gallery" variant="outline-light">
            View Full Gallery
          </Button>
        </div>
      </div>
    </section>
  );
}
