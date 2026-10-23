/**
 * next/image loader. Admin uploads are served through /media, which resizes
 * them to the requested width as WebP (see app/media/[...path]/route.ts).
 * Next's built-in optimizer is avoided on purpose: it reads uploads through
 * the stale public/ snapshot (see app/uploads/[...path]/route.ts).
 */
export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  if (src.startsWith("/uploads/")) {
    return `/media/${src.slice("/uploads/".length)}?w=${width}`;
  }
  return src;
}
