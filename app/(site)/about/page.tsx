import type { Metadata } from "next";
import { EyebrowHeading } from "@/components/shared/EyebrowHeading";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";
import { CTASection } from "@/components/shared/CTASection";
import { getSiteSettings } from "@/lib/site-settings";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About — Retouch Africa",
};

export default async function AboutPage() {
  const [settings, socialLinks] = await Promise.all([
    getSiteSettings(),
    prisma.socialLink.findMany({ where: { facilitatorId: null }, orderBy: { order: "asc" } }),
  ]);

  const columns = [
    { title: settings.missionTitle, body: settings.missionBody },
    { title: settings.visionTitle, body: settings.visionBody },
    { title: settings.impactTitle, body: settings.impactBody },
  ];

  return (
    <>
      <section className="bg-paper py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <FadeIn>
            <EyebrowHeading>{settings.storyEyebrow}</EyebrowHeading>
            <SectionHeading className="mt-4">{settings.storyHeading}</SectionHeading>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-ink/70">{settings.storyBody}</p>
          </FadeIn>
        </div>

        <StaggerChildren className="mx-auto mt-20 grid max-w-5xl gap-12 px-6 sm:grid-cols-3">
          {columns.map((col) => (
            <StaggerItem key={col.title} className="text-center">
              <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-gold">{col.title}</h3>
              <p className="mt-3 text-sm text-ink/60">{col.body}</p>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>

      <CTASection heading={settings.footerHeading} body={settings.footerBody} socialLinks={socialLinks} />
    </>
  );
}
