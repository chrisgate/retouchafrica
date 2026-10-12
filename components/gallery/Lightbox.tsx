"use client";

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { GalleryItem } from "@/components/gallery/types";

const SWIPE_THRESHOLD = 50;

function Arrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-[1.5]" aria-hidden>
      <path
        d={direction === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const controlClass =
  "flex h-12 w-12 items-center justify-center rounded-full border border-paper/20 bg-ink/60 text-paper backdrop-blur transition-colors hover:border-gold hover:text-gold focus-visible:outline-2 focus-visible:outline-gold";

/**
 * Full-screen photo viewer: arrow keys / buttons / swipe to move, Esc or the
 * backdrop to close. Rendered in a portal because ancestors (FadeIn) use CSS
 * transforms, which would otherwise break `position: fixed`.
 */
export function Lightbox({
  items,
  index,
  onIndexChange,
  onClose,
}: {
  items: GalleryItem[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const count = items.length;
  const item = items[index];

  const go = useCallback(
    (step: number) => onIndexChange((index + step + count) % count),
    [index, count, onIndexChange],
  );

  // Lock page scroll, move focus into the dialog, and give it back on close.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>("button")?.focus();
    return () => {
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  // Warm the cache for the photos either side so paging feels instant.
  useEffect(() => {
    if (count < 2) return;
    for (const offset of [-1, 1]) {
      const neighbour = items[(index + offset + count) % count];
      new window.Image().src = neighbour.src;
    }
  }, [index, items, count]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft" && count > 1) go(-1);
      else if (e.key === "ArrowRight" && count > 1) go(1);
      else if (e.key === "Tab") {
        // Keep keyboard focus inside the dialog.
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button");
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [go, onClose, count]);

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      className="fixed inset-0 z-50 flex flex-col bg-ink/95 backdrop-blur-sm"
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null || count < 2) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(delta) > SWIPE_THRESHOLD) go(delta > 0 ? -1 : 1);
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-paper/70" aria-live="polite">
          {index + 1} <span className="text-gold">/</span> {count}
        </p>
        <button type="button" onClick={onClose} aria-label="Close viewer" className={controlClass}>
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.5]" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Clicking the dark area around the photo closes the viewer. */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20" onClick={onClose}>
        {count > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            aria-label="Previous photo"
            className={`${controlClass} absolute left-2 z-10 hidden sm:flex sm:left-5`}
          >
            <Arrow direction="left" />
          </button>
        )}

        {/* eslint-disable-next-line @next/next/no-img-element -- full-size viewer; sources are already sized at upload */}
        <img
          key={item.id}
          src={item.src}
          alt={item.caption ?? ""}
          onClick={(e) => e.stopPropagation()}
          className="max-h-full max-w-full animate-[lightbox-in_0.35s_ease-out] object-contain shadow-2xl"
        />

        {count > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            aria-label="Next photo"
            className={`${controlClass} absolute right-2 z-10 hidden sm:flex sm:right-5`}
          >
            <Arrow direction="right" />
          </button>
        )}
      </div>

      <div className="flex min-h-16 flex-col items-center justify-center gap-3 px-6 py-3 text-center">
        {item.caption && <p className="max-w-2xl text-sm text-paper/80">{item.caption}</p>}
        {count > 1 && (
          <div className="flex gap-3 sm:hidden">
            <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className={controlClass}>
              <Arrow direction="left" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next photo" className={controlClass}>
              <Arrow direction="right" />
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
