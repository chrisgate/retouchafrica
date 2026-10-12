import type { Metadata } from "next";
import { EyebrowHeading } from "@/components/shared/EyebrowHeading";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { GalleryMasonry } from "@/components/gallery/GalleryMasonry";
import { FadeIn } from "@/components/motion/FadeIn";
import { getPublishedGalleryItems } from "@/lib/gallery";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery — Retouch Africa",
  description: "Moments from Retouch Africa workshops, mentorship sessions and community gatherings.",
};

export default async function GalleryPage() {
  const items = await getPublishedGalleryItems();

  return (
    <section className="bg-ink pb-28 pt-20 sm:pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <EyebrowHeading>Gallery</EyebrowHeading>
          <SectionHeading as="h1" className="mt-4 text-paper">
            Moments That Inspire
          </SectionHeading>
          <div className="mx-auto mt-6 flex items-center justify-center gap-3" aria-hidden>
            <span className="h-px w-12 bg-gold/60" />
            <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
            <span className="h-px w-12 bg-gold/60" />
          </div>
          <p className="mt-6 text-paper/60">
            A look back at the workshops, the people and the conversations shaping Africa&rsquo;s retouching community.
          </p>
          {items.length > 0 && (
            <p className="mt-3 text-xs uppercase tracking-[0.25em] text-paper/40">
              {items.length} {items.length === 1 ? "photograph" : "photographs"}
            </p>
          )}
        </FadeIn>

        <div className="mt-14 sm:mt-16">
          {items.length > 0 ? (
            <GalleryMasonry items={items} />
          ) : (
            <p className="text-center text-paper/50">Gallery coming soon.</p>
          )}
        </div>
      </div>
    </section>
  );
}
