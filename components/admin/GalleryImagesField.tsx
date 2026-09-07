"use client";

import { useState } from "react";
import Image from "next/image";

export function GalleryImagesField({ images }: { images: string[] }) {
  const [kept, setKept] = useState(images);

  function remove(url: string) {
    setKept((prev) => prev.filter((u) => u !== url));
  }

  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wide text-ink/60">Collage photos (add more)</label>

      {kept.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {kept.map((url) => (
            <div key={url} className="relative h-20 w-20 overflow-hidden border border-ink/10 bg-paper-soft">
              <Image src={url} alt="" fill unoptimized className="object-cover" />
              <input type="hidden" name="existingGalleryImages" value={url} />
              <button
                type="button"
                onClick={() => remove(url)}
                aria-label="Remove photo"
                className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink/70 text-xs leading-none text-paper hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        type="file"
        name="galleryImages"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        className="mt-2 block w-full text-sm"
      />
    </div>
  );
}
