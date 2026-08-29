import { Button } from "@/components/shared/Button";
import { SocialIcons, type SocialLinkItem } from "@/components/shared/SocialIcons";

export function CTASection({
  heading,
  body,
  socialLinks,
}: {
  heading: string;
  body: string;
  socialLinks: SocialLinkItem[];
}) {
  return (
    <section className="relative overflow-hidden bg-ink py-24">
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gold/20 blur-[120px]"
        aria-hidden
      />
      <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-10 px-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl">
          <h2 className="font-display text-4xl leading-tight text-paper sm:text-5xl">{heading}</h2>
          <p className="mt-4 text-paper/70">{body}</p>
        </div>
        <div className="flex flex-col items-start gap-4 sm:items-end">
          <Button href="/community" variant="solid">
            Join the Community
          </Button>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <span className="text-xs uppercase tracking-[0.2em] text-paper/50">Follow Us</span>
            <SocialIcons links={socialLinks} variant="light" />
          </div>
        </div>
      </div>
    </section>
  );
}
