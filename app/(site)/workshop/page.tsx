import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EyebrowHeading } from "@/components/shared/EyebrowHeading";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { FadeIn } from "@/components/motion/FadeIn";
import { getPublishedWorkshops } from "@/lib/queries";
import { getNowMs } from "@/lib/time";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Workshops",
  description:
    "Hands-on retouching workshops in Africa, led by working industry professionals. See upcoming dates and past workshops.",
  alternates: { canonical: "/workshop" },
};

export default async function WorkshopListPage() {
  const workshops = await getPublishedWorkshops();

  const now = getNowMs();
  const upcoming = workshops.filter((w) => w.startDate.getTime() >= now);
  const past = workshops.filter((w) => w.startDate.getTime() < now);

  return (
    <section className="bg-paper py-24">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn className="text-center">
          <EyebrowHeading>Workshops</EyebrowHeading>
          <SectionHeading as="h1" className="mt-4">Learn From Working Professionals</SectionHeading>
        </FadeIn>

        {upcoming.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/50">Upcoming</h2>
            <div className="mt-6 flex flex-col gap-6">
              {upcoming.map((w) => (
                <WorkshopRow key={w.id} workshop={w} />
              ))}
            </div>
          </div>
        )}

        {past.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/50">Past Workshops</h2>
            <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {past.map((w) => (
                <PastWorkshopCard key={w.id} workshop={w} />
              ))}
            </div>
          </div>
        )}

        {workshops.length === 0 && (
          <p className="mt-16 text-center text-ink/50">No workshops published yet. Check back soon.</p>
        )}
      </div>
    </section>
  );
}

function WorkshopRow({ workshop }: { workshop: { id: string; slug: string; title: string; summary: string; locationLabel: string; startDate: Date } }) {
  return (
    <Link
      href={`/workshop/${workshop.slug}`}
      className="flex flex-col gap-2 border border-ink/10 p-6 transition-colors hover:border-gold sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <p className="font-display text-2xl">{workshop.title}</p>
        <p className="mt-1 text-sm text-ink/60">{workshop.summary}</p>
        <p className="mt-2 text-xs uppercase tracking-wide text-ink/40">
          {workshop.locationLabel} · {workshop.startDate.toLocaleDateString()}
        </p>
      </div>
      <span className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">View Details →</span>
    </Link>
  );
}

type PastWorkshop = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  locationLabel: string;
  startDate: Date;
  heroImageUrl: string | null;
  galleryImages: string[];
};

function PastWorkshopCard({ workshop }: { workshop: PastWorkshop }) {
  const cover = workshop.heroImageUrl || workshop.galleryImages[workshop.galleryImages.length - 1] || null;
  const date = workshop.startDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Link
      href={`/workshop/${workshop.slug}`}
      className="group flex flex-col overflow-hidden border border-ink/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ink">
        {cover && (
          <Image
            src={cover}
            alt={workshop.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <span className="absolute left-4 top-4 bg-ink/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-paper">
          Completed
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs uppercase tracking-[0.15em] text-gold">
          {workshop.locationLabel} · {date}
        </p>
        <h3 className="mt-3 font-display text-2xl leading-snug">{workshop.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm text-ink/60">{workshop.summary}</p>
        <span className="mt-auto pt-6 text-xs font-semibold uppercase tracking-[0.15em] text-gold">
          View Details <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  );
}
