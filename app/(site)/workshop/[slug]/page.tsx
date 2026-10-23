import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { EyebrowHeading } from "@/components/shared/EyebrowHeading";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/shared/Button";
import { Countdown } from "@/components/shared/Countdown";
import { FadeIn } from "@/components/motion/FadeIn";
import { getWorkshopBySlug } from "@/lib/queries";
import { getNowMs } from "@/lib/time";
import { fillCollageImages } from "@/lib/collage";
import { JsonLd } from "@/components/shared/JsonLd";
import { SITE_NAME, SITE_URL, absoluteUrl, truncate } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const workshop = await getWorkshopBySlug(slug);
  if (!workshop || !workshop.isPublished) return { title: "Workshop" };

  const description = truncate(workshop.summary || workshop.description);
  const image = workshop.heroImageUrl || workshop.galleryImages[workshop.galleryImages.length - 1];
  const path = `/workshop/${workshop.slug}`;
  return {
    title: workshop.title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: workshop.title,
      description,
      url: path,
      ...(image ? { images: [{ url: image, alt: workshop.title }] } : {}),
    },
    twitter: { card: "summary_large_image", title: workshop.title, description, ...(image ? { images: [image] } : {}) },
  };
}

export default async function WorkshopDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const workshop = await getWorkshopBySlug(slug);
  if (!workshop || !workshop.isPublished) notFound();

  const isUpcoming = workshop.startDate.getTime() >= getNowMs();
  const collage = fillCollageImages(workshop.galleryImages);
  const eventImage = workshop.heroImageUrl || workshop.galleryImages[workshop.galleryImages.length - 1];

  return (
    <section className="bg-ink py-24">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Event",
          name: workshop.title,
          description: workshop.summary || workshop.description,
          startDate: workshop.startDate.toISOString(),
          ...(workshop.endDate ? { endDate: workshop.endDate.toISOString() } : {}),
          eventStatus: "https://schema.org/EventScheduled",
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          location: {
            "@type": "Place",
            name: workshop.venueLabel || workshop.locationLabel,
            address: workshop.locationLabel,
          },
          url: absoluteUrl(`/workshop/${workshop.slug}`),
          ...(eventImage ? { image: [absoluteUrl(eventImage)] } : {}),
          organizer: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        }}
      />
      <div className="mx-auto grid max-w-6xl gap-16 px-6 lg:grid-cols-2">
        <FadeIn>
          <EyebrowHeading>{workshop.eyebrow}</EyebrowHeading>
          <SectionHeading as="h1" className="mt-4 text-paper">{workshop.title}</SectionHeading>
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
            {isUpcoming ? (
              <Button href={workshop.registerUrl || "/contact"} variant="solid">
                Register Now
              </Button>
            ) : (
              <span className="inline-flex items-center border border-paper/20 px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-paper/50">
                Registration Closed
              </span>
            )}
            <Button href="/workshop" variant="outline-light">
              Back to Workshops
            </Button>
          </div>
        </FadeIn>

        <FadeIn delay={0.15} className="flex flex-col gap-8">
          {collage.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {collage.map((src, i) => (
                <div key={i} className="relative aspect-[3/4] overflow-hidden bg-ink-soft">
                  <Image
                    src={src}
                    alt={`${workshop.title} — workshop photo ${i + 1}`}
                    fill
                    sizes="(min-width: 1024px) 18vw, 30vw"
                    className="object-cover"
                  />
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
