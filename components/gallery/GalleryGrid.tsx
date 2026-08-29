import Image from "next/image";
import type { GalleryImage } from "@prisma/client";

export function GalleryGrid({
  images,
  variant = "grid",
}: {
  images: GalleryImage[];
  variant?: "grid" | "strip";
}) {
  if (images.length === 0) return null;

  if (variant === "strip") {
    return (
      <div className="flex gap-3 overflow-x-auto pb-2">
        {images.map((img) => (
          <div
            key={img.id}
            data-reveal
            className="relative h-64 w-56 flex-none overflow-hidden bg-ink-soft sm:w-72"
          >
            <Image src={img.imageUrl} alt={img.caption ?? ""} fill className="object-cover" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {images.map((img) => (
        <figure key={img.id} data-reveal className="group relative aspect-square overflow-hidden bg-paper-soft">
          <Image
            src={img.imageUrl}
            alt={img.caption ?? ""}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {img.caption && (
            <figcaption className="absolute inset-x-0 bottom-0 bg-ink/70 px-3 py-2 text-xs text-paper opacity-0 transition-opacity group-hover:opacity-100">
              {img.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
