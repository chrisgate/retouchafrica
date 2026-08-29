import { EyebrowHeading } from "@/components/shared/EyebrowHeading";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/shared/Button";
import { FacilitatorCard } from "@/components/facilitators/FacilitatorCard";
import { GsapScrollReveal } from "@/components/motion/GsapScrollReveal";
import { FadeIn } from "@/components/motion/FadeIn";
import { prisma } from "@/lib/prisma";

export async function FacilitatorsPreview() {
  const facilitators = await prisma.facilitator.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
    take: 3,
    include: { socialLinks: true },
  });

  if (facilitators.length === 0) return null;

  return (
    <section className="bg-paper py-24">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn className="text-center">
          <EyebrowHeading>Facilitators</EyebrowHeading>
          <SectionHeading className="mt-4">Meet the Experts</SectionHeading>
        </FadeIn>

        <GsapScrollReveal className="mt-14 grid items-stretch gap-10 sm:grid-cols-3">
          {facilitators.map((f) => (
            <div key={f.id} data-reveal className="h-full">
              <FacilitatorCard facilitator={f} />
            </div>
          ))}
        </GsapScrollReveal>

        <div className="mt-14 flex justify-center">
          <Button href="/facilitators" variant="outline">
            View All Facilitators
          </Button>
        </div>
      </div>
    </section>
  );
}
