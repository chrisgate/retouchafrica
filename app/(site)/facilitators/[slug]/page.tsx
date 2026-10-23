import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SocialIcons } from "@/components/shared/SocialIcons";
import { Button } from "@/components/shared/Button";
import { FadeIn } from "@/components/motion/FadeIn";
import { getFacilitatorBySlug } from "@/lib/queries";
import { JsonLd } from "@/components/shared/JsonLd";
import { SITE_NAME, absoluteUrl, truncate } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const facilitator = await getFacilitatorBySlug(slug);
  if (!facilitator || !facilitator.isPublished) return { title: "Facilitator" };

  const title = `${facilitator.name}, ${facilitator.role}`;
  const description = truncate(facilitator.bio);
  const path = `/facilitators/${facilitator.slug}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "profile",
      siteName: SITE_NAME,
      title,
      description,
      url: path,
      ...(facilitator.photoUrl ? { images: [{ url: facilitator.photoUrl, alt: facilitator.name }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(facilitator.photoUrl ? { images: [facilitator.photoUrl] } : {}),
    },
  };
}

export default async function FacilitatorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const facilitator = await getFacilitatorBySlug(slug);
  if (!facilitator || !facilitator.isPublished) notFound();

  return (
    <section className="bg-paper py-24">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: facilitator.name,
          jobTitle: facilitator.role,
          description: facilitator.bio,
          url: absoluteUrl(`/facilitators/${facilitator.slug}`),
          ...(facilitator.photoUrl ? { image: absoluteUrl(facilitator.photoUrl) } : {}),
          sameAs: facilitator.socialLinks.map((link) => link.url),
          worksFor: { "@type": "Organization", name: SITE_NAME },
        }}
      />
      <div className="mx-auto grid max-w-5xl gap-12 px-6 sm:grid-cols-[minmax(0,320px)_1fr]">
        <FadeIn>
          <div className="relative aspect-[4/5] overflow-hidden bg-paper-soft">
            {facilitator.photoUrl && (
              <Image
                src={facilitator.photoUrl}
                alt={facilitator.name}
                fill
                sizes="(min-width: 640px) 320px, 100vw"
                className="object-cover"
              />
            )}
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 className="font-display text-4xl">{facilitator.name}</h1>
          <p className="mt-2 text-sm uppercase tracking-[0.1em] text-ink/50">{facilitator.role}</p>
          <p className="mt-6 max-w-xl text-ink/70">{facilitator.bio}</p>
          <SocialIcons links={facilitator.socialLinks} className="mt-6" />
          <Button href="/facilitators" variant="outline" className="mt-10">
            Back to Facilitators
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}
