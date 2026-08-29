import Image from "next/image";
import { Button } from "@/components/shared/Button";
import { FadeIn } from "@/components/motion/FadeIn";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import type { SiteSettings } from "@/lib/site-settings";

export function Hero({ settings }: { settings: SiteSettings }) {
  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-ink">
      <ParallaxLayer className="absolute inset-x-0 -top-16 -bottom-16" distance={50}>
        {settings.heroImageUrl ? (
          <Image
            src={settings.heroImageUrl}
            alt=""
            fill
            priority
            className="object-cover opacity-60"
          />
        ) : (
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(201,151,30,0.25),transparent_55%)]"
            aria-hidden
          />
        )}
      </ParallaxLayer>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-6 py-24">
        <FadeIn className="max-w-xl">
          <p className="eyebrow">{settings.heroEyebrow}</p>
          <h1 className="font-display mt-4 text-5xl leading-[1.05] text-paper sm:text-6xl">
            {settings.heroTitle.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="text-gold">{settings.heroTitle.split(" ").at(-1)}</span>
          </h1>
          <p className="mt-6 font-display text-2xl text-paper/90">{settings.heroTagline}</p>
          <p className="mt-4 text-paper/70">{settings.heroBody}</p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/workshop" variant="solid">
              Upcoming Workshop
            </Button>
            <Button href={settings.heroVideoUrl || "/gallery"} variant="outline-light">
              ▶ Watch Highlights
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
