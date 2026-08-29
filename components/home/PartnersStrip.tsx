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

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {partners.map((partner) => (
            <div key={partner.id} className="relative h-8 w-28 opacity-70 grayscale hover:opacity-100 hover:grayscale-0">
              <Image src={partner.logoUrl} alt={partner.name} fill className="object-contain" />
            </div>
          ))}
          <Button href="/partners" variant="outline">
            Become a Partner
          </Button>
        </div>
      </div>
    </section>
  );
}
