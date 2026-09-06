import Image from "next/image";
import { EyebrowHeading } from "@/components/shared/EyebrowHeading";
import { Button } from "@/components/shared/Button";
import { FadeIn } from "@/components/motion/FadeIn";
import { prisma } from "@/lib/prisma";

export async function PartnersStrip() {
  const partners = await prisma.partner.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  });

  if (partners.length === 0) return null;

  return (
    <section className="bg-paper py-20">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn className="text-center">
          <EyebrowHeading>Partners &amp; Sponsors</EyebrowHeading>
        </FadeIn>

        <div className="mt-10 flex flex-wrap items-start justify-center gap-x-12 gap-y-8">
          {partners.map((partner) => (
            <div key={partner.id} className="flex flex-col items-center gap-2 transition-transform hover:scale-105">
              <div className="relative h-14 w-40">
                <Image src={partner.logoUrl} alt={partner.name} fill className="object-contain" />
              </div>
              <p className="text-xs font-medium uppercase tracking-wide text-ink/60">{partner.name}</p>
            </div>
          ))}
          <Button href="/partners" variant="outline" className="self-center">
            Become a Partner
          </Button>
        </div>
      </div>
    </section>
  );
}
