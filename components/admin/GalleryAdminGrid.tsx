"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { clsx } from "clsx";
import { deleteGalleryImagesAction } from "@/lib/actions/gallery";

export type AdminGalleryItem = {
  id: string;
  imageUrl: string;
  caption: string | null;
  isPublished: boolean;
};

export function GalleryAdminGrid({ images }: { images: AdminGalleryItem[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function remove(ids: string[]) {
    const message =
      ids.length === 1 ? "Delete this photo permanently?" : `Delete ${ids.length} photos permanently?`;
    if (!window.confirm(message)) return;
    startTransition(async () => {
      await deleteGalleryImagesAction(ids);
      setSelected(new Set());
    });
  }

  if (images.length === 0) {
    return <p className="text-sm text-ink/50">No photos yet — upload some above.</p>;
  }

  const allSelected = selected.size === images.length;

  return (
    <div>
      <div className="sticky top-0 z-10 -mx-1 flex min-h-12 flex-wrap items-center gap-x-4 gap-y-2 bg-paper/95 px-1 py-2 text-sm backdrop-blur">
        <span className="text-ink/60">
          {selected.size > 0 ? `${selected.size} selected` : `${images.length} photo${images.length === 1 ? "" : "s"}`}
        </span>
        <button
          type="button"
          onClick={() => setSelected(allSelected ? new Set() : new Set(images.map((i) => i.id)))}
          className="text-xs underline hover:text-gold"
        >
          {allSelected ? "Select none" : "Select all"}
        </button>
        {selected.size > 0 && (
          <button
            type="button"
            disabled={pending}
            onClick={() => remove([...selected])}
            className="bg-red-600 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-white hover:bg-red-700 disabled:opacity-50"
          >
            {pending ? "Deleting…" : `Delete ${selected.size}`}
          </button>
        )}
      </div>

      <ul className={clsx("mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8", pending && "opacity-60")}>
        {images.map((image) => {
          const isSelected = selected.has(image.id);
          return (
            <li
              key={image.id}
              className={clsx(
                "group relative aspect-square overflow-hidden bg-paper-soft outline-2 -outline-offset-2",
                isSelected ? "outline outline-gold" : "outline-transparent",
              )}
            >
              <Image
                src={image.imageUrl}
                alt={image.caption ?? ""}
                fill
                sizes="(min-width: 1280px) 12vw, (min-width: 1024px) 16vw, 30vw"
                className={clsx("object-cover", !image.isPublished && "opacity-40")}
              />

              <button
                type="button"
                onClick={() => toggle(image.id)}
                aria-pressed={isSelected}
                aria-label={isSelected ? "Deselect photo" : "Select photo"}
                className="absolute inset-0"
              />
              <span
                aria-hidden
                className={clsx(
                  "pointer-events-none absolute left-1.5 top-1.5 flex h-5 w-5 items-center justify-center border text-xs",
                  isSelected
                    ? "border-gold bg-gold text-ink"
                    : "border-white/80 bg-ink/40 text-transparent group-hover:text-white/60",
                )}
              >
                ✓
              </span>

              {!image.isPublished && (
                <span className="pointer-events-none absolute bottom-1.5 left-1.5 bg-ink/80 px-1.5 py-0.5 text-[10px] uppercase text-paper">
                  Hidden
                </span>
              )}
              <Link
                href={`/admin/gallery/${image.id}/edit`}
                className="absolute right-1.5 top-1.5 bg-ink/80 px-2 py-1 text-[10px] uppercase tracking-wide text-paper opacity-0 transition-opacity hover:bg-gold hover:text-ink focus:opacity-100 group-hover:opacity-100"
              >
                Edit
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
