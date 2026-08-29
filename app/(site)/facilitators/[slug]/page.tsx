import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SocialIcons } from "@/components/shared/SocialIcons";
import { Button } from "@/components/shared/Button";
import { FadeIn } from "@/components/motion/FadeIn";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const facilitator = await prisma.facilitator.findUnique({ where: { slug } });
  return { title: facilitator ? `${facilitator.name} — Retouch Africa` : "Facilitator — Retouch Africa" };
}

export default async function FacilitatorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const facilitator = await prisma.facilitator.findUnique({
    where: { slug },
    include: { socialLinks: true },
  });
  if (!facilitator || !facilitator.isPublished) notFound();

  return (
    <section className="bg-paper py-24">
      <div className="mx-auto grid max-w-5xl gap-12 px-6 sm:grid-cols-[minmax(0,320px)_1fr]">
        <FadeIn>
          <div className="relative aspect-[4/5] overflow-hidden bg-paper-soft">
            {facilitator.photoUrl && (
              <Image src={facilitator.photoUrl} alt={facilitator.name} fill className="object-cover" />
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
