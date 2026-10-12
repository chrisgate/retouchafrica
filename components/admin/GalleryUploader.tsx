"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_BYTES = 8 * 1024 * 1024; // keep in sync with lib/uploads.ts
const CONCURRENCY = 3;

type Status = "queued" | "uploading" | "done" | "error";

type Item = {
  id: number;
  file: File;
  preview: string;
  status: Status;
  progress: number;
  error?: string;
};

function validate(file: File): string | undefined {
  if (!ACCEPTED_TYPES.includes(file.type)) return "Use JPEG, PNG, WebP or AVIF.";
  if (file.size > MAX_BYTES) return "Larger than the 8MB limit.";
  return undefined;
}

function sendFile(file: File, onProgress: (fraction: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/gallery/upload");
    xhr.responseType = "json";
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(e.loaded / e.total);
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(xhr.response?.error ?? "Upload failed."));
    };
    xhr.onerror = () => reject(new Error("Network error — check your connection."));
    const body = new FormData();
    body.append("file", file);
    xhr.send(body);
  });
}

export function GalleryUploader() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [dragging, setDragging] = useState(false);
  const nextId = useRef(0);
  const itemsRef = useRef<Item[]>([]);
  const running = useRef(0);

  // The ref is the single source of truth for the queue (the runner below reads
  // it synchronously, so it must never lag behind); state just mirrors it for
  // rendering. Every change goes through update() so the two can't drift apart.
  function update(change: (current: Item[]) => Item[]) {
    itemsRef.current = change(itemsRef.current);
    setItems(itemsRef.current);
  }

  function patch(id: number, change: Partial<Item>) {
    update((current) => current.map((item) => (item.id === id ? { ...item, ...change } : item)));
  }

  // Release object URLs when leaving the page.
  useEffect(() => {
    return () => itemsRef.current.forEach((item) => URL.revokeObjectURL(item.preview));
  }, []);

  // Starts queued uploads until CONCURRENCY are in flight; each finished upload
  // pulls the next one, and the last one refreshes the page data.
  function pump() {
    while (running.current < CONCURRENCY) {
      const next = itemsRef.current.find((item) => item.status === "queued");
      if (!next) break;
      running.current += 1;
      patch(next.id, { status: "uploading", progress: 0 });

      sendFile(next.file, (fraction) => patch(next.id, { progress: fraction }))
        .then(() => patch(next.id, { status: "done", progress: 1 }))
        .catch((error: Error) => patch(next.id, { status: "error", error: error.message }))
        .finally(() => {
          running.current -= 1;
          if (running.current === 0 && !itemsRef.current.some((item) => item.status === "queued")) {
            router.refresh();
          } else {
            pump();
          }
        });
    }
  }

  function addFiles(list: FileList | File[]) {
    const files = Array.from(list);
    if (files.length === 0) return;
    const added: Item[] = files.map((file) => {
      const error = validate(file);
      return {
        id: nextId.current++,
        file,
        preview: URL.createObjectURL(file),
        status: error ? "error" : "queued",
        progress: 0,
        error,
      };
    });
    update((current) => [...current, ...added]);
    pump();
  }

  function retry(id: number) {
    patch(id, { status: "queued", progress: 0, error: undefined });
    pump();
  }

  function clearFinished() {
    const finished = itemsRef.current.filter((item) => item.status === "done" || item.status === "error");
    finished.forEach((item) => URL.revokeObjectURL(item.preview));
    update((current) => current.filter((item) => !finished.includes(item)));
  }

  const done = items.filter((item) => item.status === "done").length;
  const failed = items.filter((item) => item.status === "error").length;
  const busy = items.some((item) => item.status === "queued" || item.status === "uploading");

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        className={clsx(
          "flex flex-col items-center justify-center gap-3 border-2 border-dashed px-6 py-10 text-center transition-colors",
          dragging ? "border-gold bg-gold/10" : "border-ink/20 bg-paper-soft",
        )}
      >
        <svg viewBox="0 0 24 24" className="h-9 w-9 fill-none stroke-gold stroke-[1.5]" aria-hidden>
          <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" strokeLinecap="round" />
        </svg>
        <p className="text-sm font-medium">Drag photos here, or choose them from your device</p>
        <p className="text-xs text-ink/50">Select as many as you like — they upload straight away. JPEG, PNG, WebP or AVIF, up to 8MB each.</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-1 bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-paper hover:bg-ink/80"
        >
          Choose Photos
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = ""; // allow re-selecting the same files
          }}
        />
      </div>

      {items.length > 0 && (
        <div className="mt-4" aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <p>
              {busy ? "Uploading… " : "Finished. "}
              <span className="text-ink/60">
                {done} of {items.length} uploaded{failed > 0 && `, ${failed} failed`}
              </span>
            </p>
            {!busy && (
              <button type="button" onClick={clearFinished} className="text-xs underline hover:text-gold">
                Clear list
              </button>
            )}
          </div>

          <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-8">
            {items.map((item) => (
              <li key={item.id} className="relative aspect-square overflow-hidden border border-ink/10 bg-paper-soft">
                {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
                <img
                  src={item.preview}
                  alt=""
                  className={clsx("h-full w-full object-cover", item.status !== "done" && "opacity-60")}
                />

                {item.status === "uploading" && (
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-ink/20">
                    <div className="h-full bg-gold transition-[width]" style={{ width: `${item.progress * 100}%` }} />
                  </div>
                )}
                {item.status === "queued" && (
                  <span className="absolute bottom-1 left-1 bg-ink/70 px-1.5 py-0.5 text-[10px] uppercase text-paper">
                    Waiting
                  </span>
                )}
                {item.status === "done" && (
                  <span
                    aria-label="Uploaded"
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs text-white"
                  >
                    ✓
                  </span>
                )}
                {item.status === "error" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-red-700/85 p-1.5 text-center text-[10px] leading-tight text-white">
                    <span>{item.error}</span>
                    {!validate(item.file) && (
                      <button type="button" onClick={() => retry(item.id)} className="underline">
                        Retry
                      </button>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
