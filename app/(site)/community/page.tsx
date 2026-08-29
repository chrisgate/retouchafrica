import type { Metadata } from "next";
import { EyebrowHeading } from "@/components/shared/EyebrowHeading";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { FadeIn } from "@/components/motion/FadeIn";
import { ContactForm } from "@/components/forms/ContactForm";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Community — Retouch Africa",
};

export default async function CommunityPage() {
  const settings = await getSiteSettings();

  return (
    <section className="bg-ink py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <FadeIn>
          <EyebrowHeading>Community</EyebrowHeading>
          <SectionHeading className="mt-4 text-paper">{settings.footerHeading}</SectionHeading>
          <p className="mx-auto mt-4 max-w-xl text-paper/70">{settings.footerBody}</p>
        </FadeIn>
      </div>

      <div className="mx-auto mt-16 max-w-xl px-6">
        <div className="bg-paper p-8">
          <h2 className="font-display text-2xl">Join the Community</h2>
          <p className="mt-2 text-sm text-ink/60">
            Tell us a little about yourself and we&apos;ll get you connected.
          </p>
          <div className="mt-6">
            <ContactForm type="JOIN_COMMUNITY" submitLabel="Join the Community" />
          </div>
        </div>
      </div>
    </section>
  );
}
