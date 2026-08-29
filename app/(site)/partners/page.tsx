import type { Metadata } from "next";
import Image from "next/image";
import { EyebrowHeading } from "@/components/shared/EyebrowHeading";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { FadeIn } from "@/components/motion/FadeIn";
import { ContactForm } from "@/components/forms/ContactForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Partners — Retouch Africa",
};

export default async function PartnersPage() {
  const partners = await prisma.partner.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  });

  return (
    <section className="bg-paper py-24">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <FadeIn>
          <EyebrowHeading>Partners &amp; Sponsors</EyebrowHeading>
          <SectionHeading className="mt-4">Backed By Industry Leaders</SectionHeading>
        </FadeIn>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-14 gap-y-10">
          {partners.map((partner) => (
            <div key={partner.id} className="relative h-10 w-32 opacity-80">
              <Image src={partner.logoUrl} alt={partner.name} fill className="object-contain" />
            </div>
          ))}
        </div>

        {partners.length === 0 && <p className="mt-16 text-ink/50">Partners coming soon.</p>}
      </div>

      <div className="mx-auto mt-24 max-w-xl px-6">
        <h2 className="font-display text-center text-3xl">Become a Partner</h2>
        <p className="mt-3 text-center text-sm text-ink/60">
          Interested in supporting Africa&apos;s retouching community? Tell us about your brand.
        </p>
        <div className="mt-8">
          <ContactForm type="PARTNER_INQUIRY" submitLabel="Submit Inquiry" />
        </div>
      </div>
    </section>
  );
}
