import type { Metadata } from "next";
import { EyebrowHeading } from "@/components/shared/EyebrowHeading";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { FadeIn } from "@/components/motion/FadeIn";
import { ContactForm } from "@/components/forms/ContactForm";
import { SocialIcons } from "@/components/shared/SocialIcons";
import { getSiteSettings } from "@/lib/site-settings";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact — Retouch Africa",
};

export default async function ContactPage() {
  const [settings, socialLinks] = await Promise.all([
    getSiteSettings(),
    prisma.socialLink.findMany({ where: { facilitatorId: null }, orderBy: { order: "asc" } }),
  ]);

  return (
    <section className="bg-paper py-24">
      <div className="mx-auto grid max-w-5xl gap-16 px-6 lg:grid-cols-2">
        <FadeIn>
          <EyebrowHeading>Contact</EyebrowHeading>
          <SectionHeading className="mt-4">Get In Touch</SectionHeading>
          <p className="mt-4 max-w-md text-ink/70">
            Questions about a workshop, partnership, or the community? Reach out — we&apos;d love to hear from you.
          </p>

          <div className="mt-8 flex flex-col gap-2 text-sm">
            <a href={`mailto:${settings.contactEmail}`} className="hover:text-gold">
              {settings.contactEmail}
            </a>
            <span className="text-ink/60">{settings.contactHandle}</span>
          </div>

          <SocialIcons links={socialLinks} className="mt-6" />
        </FadeIn>

        <FadeIn delay={0.1}>
          <ContactForm type="CONTACT" />
        </FadeIn>
      </div>
    </section>
  );
}
