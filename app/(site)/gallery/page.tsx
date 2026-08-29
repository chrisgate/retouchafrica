import type { Metadata } from "next";
import { EyebrowHeading } from "@/components/shared/EyebrowHeading";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { FadeIn } from "@/components/motion/FadeIn";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery — Retouch Africa",
};

export default async function GalleryPage() {
  const images = await prisma.galleryImage.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  });

  return (
    <section className="bg-ink py-24">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn className="text-center">
          <EyebrowHeading>Gallery</EyebrowHeading>
          <SectionHeading className="mt-4 text-paper">Moments That Inspire</SectionHeading>
        </FadeIn>

        <div className="mt-16">
          <GalleryGrid images={images} variant="grid" />
        </div>

        {images.length === 0 && (
          <p className="mt-16 text-center text-paper/50">Gallery coming soon.</p>
        )}
      </div>
    </section>
  );
}
