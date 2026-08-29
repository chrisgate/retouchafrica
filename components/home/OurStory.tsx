import { EyebrowHeading } from "@/components/shared/EyebrowHeading";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/shared/Button";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";
import type { SiteSettings } from "@/lib/site-settings";

const ICONS = {
  mission: (
    <svg viewBox="0 0 24 24" className="h-8 w-8 stroke-gold fill-none stroke-[1.5]">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" className="fill-gold" />
    </svg>
  ),
  vision: (
    <svg viewBox="0 0 24 24" className="h-8 w-8 stroke-gold fill-none stroke-[1.5]">
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  impact: (
    <svg viewBox="0 0 24 24" className="h-8 w-8 stroke-gold fill-none stroke-[1.5]">
      <circle cx="12" cy="6.5" r="2.2" />
      <circle cx="5.5" cy="8.5" r="1.8" />
      <circle cx="18.5" cy="8.5" r="1.8" />
      <path d="M7.5 20c0-2.9 2-5 4.5-5s4.5 2.1 4.5 5M2 19c0-2.4 1.6-4 3.5-4M22 19c0-2.4-1.6-4-3.5-4" />
    </svg>
  ),
};

export function OurStory({ settings }: { settings: SiteSettings }) {
  const columns = [
    { key: "mission", title: settings.missionTitle, body: settings.missionBody },
    { key: "vision", title: settings.visionTitle, body: settings.visionBody },
    { key: "impact", title: settings.impactTitle, body: settings.impactBody },
  ] as const;

  return (
    <section className="bg-paper py-24">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <FadeIn>
          <EyebrowHeading>{settings.storyEyebrow}</EyebrowHeading>
          <SectionHeading className="mt-4">{settings.storyHeading}</SectionHeading>
          <span className="mt-6 block h-px w-10 bg-gold" />
          <p className="mt-6 max-w-md text-ink/70">{settings.storyBody}</p>
          <Button href="/about" variant="solid-dark" className="mt-8">
            Learn More About Us
          </Button>
        </FadeIn>

        <div className="lg:border-l lg:border-ink/10 lg:pl-10 lg:pt-8">
          <StaggerChildren className="grid gap-10 sm:grid-cols-3 sm:divide-x sm:divide-ink/10">
            {columns.map((col, i) => (
              <StaggerItem key={col.key} className={i > 0 ? "sm:pl-10" : undefined}>
                {ICONS[col.key]}
                <h3 className="mt-9 text-sm font-semibold uppercase tracking-[0.15em]">{col.title}</h3>
                <p className="mt-3 text-sm text-ink/60">{col.body}</p>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </div>
    </section>
  );
}
