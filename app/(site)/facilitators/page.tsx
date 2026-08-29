import type { Metadata } from "next";
import { EyebrowHeading } from "@/components/shared/EyebrowHeading";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { FacilitatorCard } from "@/components/facilitators/FacilitatorCard";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";
import { FadeIn } from "@/components/motion/FadeIn";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Facilitators — Retouch Africa",
};

export default async function FacilitatorsPage() {
  const facilitators = await prisma.facilitator.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
    include: { socialLinks: true },
  });

  return (
    <section className="bg-paper py-24">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn className="text-center">
          <EyebrowHeading>Facilitators</EyebrowHeading>
          <SectionHeading className="mt-4">Meet the Experts</SectionHeading>
        </FadeIn>

        <StaggerChildren className="mt-16 grid items-stretch gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {facilitators.map((f) => (
            <StaggerItem key={f.id} className="h-full">
              <FacilitatorCard facilitator={f} />
            </StaggerItem>
          ))}
        </StaggerChildren>

        {facilitators.length === 0 && (
          <p className="mt-16 text-center text-ink/50">Facilitators coming soon.</p>
        )}
      </div>
    </section>
  );
}
