"use client";

import { useState } from "react";
import Image from "next/image";

export function ImageUploadField({
  name,
  label,
  currentUrl,
  multiple = false,
}: {
  name: string;
  label: string;
  currentUrl?: string | null;
  multiple?: boolean;
}) {
  const [previews, setPreviews] = useState<string[]>(currentUrl ? [currentUrl] : []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  }

  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wide text-ink/60">{label}</label>
      <input
        type="file"
        name={name}
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple={multiple}
        onChange={handleChange}
        className="mt-1 block w-full text-sm"
      />
      {previews.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {previews.map((src, i) => (
            <div key={i} className="relative h-20 w-20 overflow-hidden border border-ink/10 bg-paper-soft">
              <Image src={src} alt="" fill unoptimized className="object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
