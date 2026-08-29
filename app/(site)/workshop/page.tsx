import type { Metadata } from "next";
import Link from "next/link";
import { EyebrowHeading } from "@/components/shared/EyebrowHeading";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { FadeIn } from "@/components/motion/FadeIn";
import { prisma } from "@/lib/prisma";
import { getNowMs } from "@/lib/time";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Workshops — Retouch Africa",
};

export default async function WorkshopListPage() {
  const workshops = await prisma.workshop.findMany({
    where: { isPublished: true },
    orderBy: { startDate: "desc" },
  });

  const now = getNowMs();
  const upcoming = workshops.filter((w) => w.startDate.getTime() >= now);
  const past = workshops.filter((w) => w.startDate.getTime() < now);

  return (
    <section className="bg-paper py-24">
      <div className="mx-auto max-w-5xl px-6">
        <FadeIn className="text-center">
          <EyebrowHeading>Workshops</EyebrowHeading>
          <SectionHeading className="mt-4">Learn From Working Professionals</SectionHeading>
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
            <div className="mt-6 flex flex-col gap-6">
              {past.map((w) => (
                <WorkshopRow key={w.id} workshop={w} />
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
