"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_BYTES = 8 * 1024 * 1024; // keep in sync with lib/uploads.ts
const MAX_IMAGES = 8; // keep in sync with app/api/settings/hero-images/route.ts
const ENDPOINT = "/api/settings/hero-images";

type HeroImageItem = { id: string; imageUrl: string };

function sendFile(file: File, onProgress: (fraction: number) => void): Promise<HeroImageItem> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", ENDPOINT);
    xhr.responseType = "json";
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(e.loaded / e.total);
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve(xhr.response);
      else reject(new Error(xhr.response?.error ?? "Upload failed."));
    };
    xhr.onerror = () => reject(new Error("Network error — check your connection."));
    const body = new FormData();
    body.append("file", file);
    xhr.send(body);
  });
}

/** Saves immediately (no need to press "Save Settings"), independent of the text fields below it. */
export function HeroImageUploader({ images: initial }: { images: HeroImageItem[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState(initial);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string>();

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;

    setError(undefined);
    let count = images.length;
    for (const [index, file] of files.entries()) {
      if (count >= MAX_IMAGES) {
        setError(`Up to ${MAX_IMAGES} images — the rest were skipped.`);
        break;
      }
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError(`${file.name}: use JPEG, PNG, WebP or AVIF.`);
        continue;
      }
      if (file.size > MAX_BYTES) {
        setError(`${file.name}: larger than the 8MB limit.`);
        continue;
      }
      setProgress(0);
      try {
        const saved = await sendFile(file, (fraction) => setProgress((index + fraction) / files.length));
        setImages((current) => [...current, saved]);
        count += 1;
      } catch (err) {
        setError(`${file.name}: ${err instanceof Error ? err.message : "Upload failed."}`);
      }
    }
    setProgress(null);
    router.refresh();
  }

  async function handleRemove(id: string) {
    if (!confirm("Remove this image from the hero slideshow?")) return;
    setError(undefined);
    const res = await fetch(`${ENDPOINT}?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!res.ok) return setError("Could not remove the image. Try again.");
    setImages((current) => current.filter((image) => image.id !== id));
    router.refresh();
  }

  const uploading = progress !== null;

  return (
    <div>
      <span className="text-xs font-medium uppercase tracking-wide text-ink/60">
        Background images ({images.length}/{MAX_IMAGES})
      </span>

      {images.length > 0 ? (
        <ul className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((image, i) => (
            <li key={image.id} className="relative aspect-[16/9] overflow-hidden border border-ink/10 bg-ink">
              <Image src={image.imageUrl} alt={`Hero image ${i + 1}`} fill unoptimized className="object-cover" />
              <span className="absolute left-1 top-1 bg-ink/70 px-1.5 text-[10px] text-paper">{i + 1}</span>
              <button
                type="button"
                onClick={() => handleRemove(image.id)}
                aria-label={`Remove hero image ${i + 1}`}
                className="absolute right-1 top-1 bg-ink/70 px-1.5 text-xs text-paper hover:bg-red-700"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 border border-dashed border-ink/20 px-3 py-6 text-center text-sm text-ink/50">
          No images yet — the home page shows a plain dark background.
        </p>
      )}

      <div className="mt-3 flex items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_TYPES.join(",")}
          onChange={handleFiles}
          className="hidden"
        />
        <button
          type="button"
          disabled={uploading || images.length >= MAX_IMAGES}
          onClick={() => inputRef.current?.click()}
          className="bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-paper hover:bg-ink/80 disabled:opacity-50"
        >
          {uploading ? `Uploading ${Math.round(progress * 100)}%` : "Add images"}
        </button>
      </div>

      <p className="mt-2 text-xs text-ink/50">
        With more than one image the hero fades between them automatically, in the order shown. Best: wide landscape
        photos (about 2400×1200 px or larger, under 8MB each) with the subject on the right — the text sits over the
        left side. JPEG, PNG, WebP or AVIF.
      </p>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
    </div>
  );
}
