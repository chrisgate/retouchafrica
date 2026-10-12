"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { clsx } from "clsx";
import { MotionConfig, motion } from "motion/react";
import { Lightbox } from "@/components/gallery/Lightbox";
import type { GalleryItem } from "@/components/gallery/types";

const ALL = "All";

/**
 * The public gallery: photos keep their natural proportions (no cropping) in a
 * masonry layout, open into a lightbox, and — only if the admin has actually
 * tagged photos with categories — can be filtered by category.
 */
export function GalleryMasonry({ items }: { items: GalleryItem[] }) {
  const [category, setCategory] = useState(ALL);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const categories = useMemo(() => {
    const names = new Set<string>();
    for (const item of items) if (item.category) names.add(item.category);
    return names.size > 1 ? [ALL, ...names] : [];
  }, [items]);

  const visible = useMemo(
    () => (category === ALL ? items : items.filter((item) => item.category === category)),
    [items, category],
  );

  return (
    <MotionConfig reducedMotion="user">
      {categories.length > 0 && (
        <div className="mb-10 flex flex-wrap justify-center gap-2" role="group" aria-label="Filter photos by category">
          {categories.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setCategory(name)}
              aria-pressed={category === name}
              className={clsx(
                "border px-5 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition-colors",
                category === name
                  ? "border-gold bg-gold text-ink"
                  : "border-paper/20 text-paper/70 hover:border-gold hover:text-gold",
              )}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      <div className="columns-2 gap-3 sm:gap-4 lg:columns-3 xl:columns-4">
        {visible.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -60px 0px" }}
            transition={{ duration: 0.5, ease: "easeOut", delay: (i % 4) * 0.05 }}
            className="mb-3 break-inside-avoid sm:mb-4"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={item.caption ? `View photo: ${item.caption}` : `View photo ${i + 1} of ${visible.length}`}
              className="group relative block w-full cursor-zoom-in overflow-hidden bg-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              style={{ aspectRatio: `${item.width} / ${item.height}` }}
            >
              <Image
                src={item.src}
                alt={item.caption ?? ""}
                width={item.width}
                height={item.height}
                sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              {/* Hover: darken, thin gold keyline, caption */}
              <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
              <span className="pointer-events-none absolute inset-2 border border-gold/0 transition-colors duration-300 group-hover:border-gold/80" />
              {item.caption && (
                <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-4 text-left text-xs leading-snug text-paper opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {item.caption}
                </span>
              )}
            </button>
          </motion.div>
        ))}
      </div>

      {openIndex !== null && visible[openIndex] && (
        <Lightbox
          items={visible}
          index={openIndex}
          onIndexChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </MotionConfig>
  );
}
