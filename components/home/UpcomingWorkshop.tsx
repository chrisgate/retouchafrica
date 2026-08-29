import Image from "next/image";
import { EyebrowHeading } from "@/components/shared/EyebrowHeading";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/shared/Button";
import { Countdown } from "@/components/shared/Countdown";
import { FadeIn } from "@/components/motion/FadeIn";
import type { Workshop } from "@prisma/client";

const INFO_ICONS = {
  duration: (
    <svg viewBox="0 0 24 24" className="h-6 w-6 stroke-gold fill-none stroke-[1.5]">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  ),
  location: (
    <svg viewBox="0 0 24 24" className="h-6 w-6 stroke-gold fill-none stroke-[1.5]">
      <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  ),
  seats: (
    <svg viewBox="0 0 24 24" className="h-6 w-6 stroke-gold fill-none stroke-[1.5]">
      <circle cx="9" cy="8" r="3" />
      <path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6M17 8.5a3 3 0 1 1 3.6 2.9M17.5 14.5c2.5.3 4.5 2 4.5 5.5" />
    </svg>
  ),
};

export function UpcomingWorkshop({ workshop }: { workshop: Workshop | null }) {
  if (!workshop) return null;

  return (
    <section className="bg-ink py-24">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2">
        <FadeIn>
          <EyebrowHeading>{workshop.eyebrow}</EyebrowHeading>
          <SectionHeading className="mt-4 text-paper">{workshop.title}</SectionHeading>
          <p className="mt-6 max-w-md text-paper/70">{workshop.summary}</p>

          <div className="mt-10 grid grid-cols-3 gap-6">
            <div>
              {INFO_ICONS.duration}
              <p className="mt-3 text-sm font-semibold text-paper">{workshop.durationLabel}</p>
              <p className="text-xs text-paper/50">Hands-on Training</p>
            </div>
            <div>
              {INFO_ICONS.location}
              <p className="mt-3 text-sm font-semibold text-paper">{workshop.locationLabel}</p>
              <p className="text-xs text-paper/50">{workshop.venueLabel}</p>
            </div>
            <div>
              {INFO_ICONS.seats}
              <p className="mt-3 text-sm font-semibold text-paper">{workshop.seatsLabel}</p>
              <p className="text-xs text-paper/50">Exclusive, Interactive</p>
            </div>
          </div>

          <Button href={`/workshop/${workshop.slug}`} variant="solid" className="mt-10">
            View Details &amp; Register
          </Button>
        </FadeIn>

        <FadeIn delay={0.15} className="flex flex-col gap-8">
          <div className="grid grid-cols-3 gap-3">
            {(workshop.galleryImages.length > 0
              ? workshop.galleryImages
              : [null, null, null]
            )
              .slice(0, 3)
              .map((src, i) => (
                <div key={i} className="relative aspect-[3/4] overflow-hidden bg-ink-soft">
                  {src && <Image src={src} alt="" fill className="object-cover" />}
                </div>
              ))}
          </div>
          <Countdown target={workshop.startDate.toISOString()} />
        </FadeIn>
      </div>
    </section>
  );
}
