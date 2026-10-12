import Image from "next/image";
import Link from "next/link";
import { EyebrowHeading } from "@/components/shared/EyebrowHeading";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/shared/Button";
import { FadeIn } from "@/components/motion/FadeIn";
import { GsapScrollReveal } from "@/components/motion/GsapScrollReveal";
import { getPublishedGalleryItems } from "@/lib/gallery";

const PREVIEW_COUNT = 6;

export async function GalleryPreview() {
  const items = await getPublishedGalleryItems(PREVIEW_COUNT);

  if (items.length === 0) return null;

  return (
    <section className="bg-ink py-24">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn className="mb-12 text-center">
          <EyebrowHeading>Gallery</EyebrowHeading>
          <SectionHeading className="mt-4 text-paper">Moments That Inspire</SectionHeading>
          <div className="mx-auto mt-6 flex items-center justify-center gap-3" aria-hidden>
            <span className="h-px w-12 bg-gold/60" />
            <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
            <span className="h-px w-12 bg-gold/60" />
          </div>
        </FadeIn>

        {/* A tidy, uniform contact-sheet: every photo links through to the full gallery. */}
        <GsapScrollReveal className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.id}
              href="/gallery"
              data-reveal
              aria-label={item.caption ? `${item.caption} — open the gallery` : "Open the gallery"}
              className="group relative aspect-4/5 overflow-hidden bg-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:aspect-4/3"
            >
              <Image
                src={item.src}
                alt={item.caption ?? ""}
                fill
                sizes="(min-width: 1024px) 33vw, 50vw"
                className="object-cover object-[50%_30%] transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <span className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/25" />
              <span className="pointer-events-none absolute inset-2 border border-gold/0 transition-colors duration-300 group-hover:border-gold/80" />
            </Link>
          ))}
        </GsapScrollReveal>

        <div className="mt-12 flex justify-center">
          <Button href="/gallery" variant="outline-light">
            View Full Gallery
          </Button>
        </div>
      </div>
    </section>
  );
}
