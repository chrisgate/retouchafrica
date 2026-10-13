"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { clsx } from "clsx";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";

const INTERVAL_MS = 6000;

/** Cross-fades between the hero images. A single image (or reduced motion) stays still. */
export function HeroSlideshow({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = images.length;

  useEffect(() => {
    if (count < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setActive((i) => (i + 1) % count), INTERVAL_MS);
    return () => clearInterval(timer);
  }, [count, paused, active]);

  return (
    <>
      <ParallaxLayer className="absolute inset-x-0 -top-16 -bottom-16" distance={50}>
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            priority={i === 0}
            className={clsx(
              "object-cover object-[70%_center] transition-opacity duration-1000",
              i === active % count ? "opacity-100" : "opacity-0",
            )}
          />
        ))}
      </ParallaxLayer>

      {count > 1 && (
        <div
          className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show hero image ${i + 1}`}
              aria-current={i === active % count}
              className="flex h-6 w-6 items-center justify-center"
            >
              <span
                className={clsx(
                  "h-1.5 rounded-full transition-all",
                  i === active % count ? "w-6 bg-gold" : "w-1.5 bg-paper/50",
                )}
              />
            </button>
          ))}
        </div>
      )}
    </>
  );
}
