import { Button } from "@/components/shared/Button";
import { FadeIn } from "@/components/motion/FadeIn";
import { HeroSlideshow } from "@/components/home/HeroSlideshow";
import type { SiteSettings } from "@/lib/site-settings";

export function Hero({ settings, images }: { settings: SiteSettings; images: string[] }) {
  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-ink">
      {images.length > 0 ? (
        <HeroSlideshow images={images} />
      ) : (
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(201,151,30,0.25),transparent_55%)]"
          aria-hidden
        />
      )}
      {/* Dark fade on the left keeps the text readable while the photo stays bright on the right. */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-ink from-15% via-ink/75 via-40% to-transparent to-75% max-sm:from-ink/80 max-sm:via-ink/60 max-sm:to-ink/30"
        aria-hidden
      />
      <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-ink/70 to-transparent" aria-hidden />

      {/* w-full matters: in this flex section, mx-auto alone would shrink the block and centre it. */}
      <div className="relative mx-auto w-full max-w-7xl px-6 py-24">
        <FadeIn className="max-w-md">
          <p className="eyebrow">{settings.heroEyebrow}</p>
          <h1 className="font-display mt-4 text-5xl leading-[1.05] text-paper sm:text-6xl lg:text-7xl">
            <span className="block">{settings.heroTitle.split(" ").slice(0, -1).join(" ")}</span>
            <span className="block text-gold">{settings.heroTitle.split(" ").at(-1)}</span>
          </h1>
          <div className="mt-6 h-px w-14 bg-gold" aria-hidden />
          <p className="mt-6 font-display text-xl leading-snug text-paper/90 sm:text-2xl">{settings.heroTagline}</p>
          <p className="mt-4 text-sm leading-relaxed text-paper/70">{settings.heroBody}</p>

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
