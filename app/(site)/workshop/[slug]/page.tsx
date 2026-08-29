import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { EyebrowHeading } from "@/components/shared/EyebrowHeading";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/shared/Button";
import { Countdown } from "@/components/shared/Countdown";
import { FadeIn } from "@/components/motion/FadeIn";
import { prisma } from "@/lib/prisma";
import { getNowMs } from "@/lib/time";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const workshop = await prisma.workshop.findUnique({ where: { slug } });
  return { title: workshop ? `${workshop.title} — Retouch Africa` : "Workshop — Retouch Africa" };
}

export default async function WorkshopDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const workshop = await prisma.workshop.findUnique({ where: { slug } });
  if (!workshop || !workshop.isPublished) notFound();

  const isUpcoming = workshop.startDate.getTime() >= getNowMs();

  return (
    <section className="bg-ink py-24">
      <div className="mx-auto grid max-w-6xl gap-16 px-6 lg:grid-cols-2">
        <FadeIn>
          <EyebrowHeading>{workshop.eyebrow}</EyebrowHeading>
          <SectionHeading className="mt-4 text-paper">{workshop.title}</SectionHeading>
          <p className="mt-6 whitespace-pre-line text-paper/70">{workshop.description}</p>

          <div className="mt-8 grid grid-cols-3 gap-6 text-sm">
            <div>
              <p className="font-semibold text-paper">{workshop.durationLabel}</p>
              <p className="text-xs text-paper/50">Hands-on Training</p>
            </div>
            <div>
              <p className="font-semibold text-paper">{workshop.locationLabel}</p>
              <p className="text-xs text-paper/50">{workshop.venueLabel}</p>
            </div>
            <div>
              <p className="font-semibold text-paper">{workshop.seatsLabel}</p>
              <p className="text-xs text-paper/50">Exclusive, Interactive</p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button href={workshop.registerUrl || "/contact"} variant="solid">
              Register Now
            </Button>
            <Button href="/workshop" variant="outline-light">
              Back to Workshops
            </Button>
          </div>
        </FadeIn>

        <FadeIn delay={0.15} className="flex flex-col gap-8">
          {workshop.galleryImages.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {workshop.galleryImages.slice(0, 3).map((src, i) => (
                <div key={i} className="relative aspect-[3/4] overflow-hidden bg-ink-soft">
                  <Image src={src} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
          {isUpcoming && <Countdown target={workshop.startDate.toISOString()} />}
        </FadeIn>
      </div>
    </section>
  );
}
