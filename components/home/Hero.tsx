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
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink/0 sm:via-ink/50" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/80 to-transparent" aria-hidden />

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
