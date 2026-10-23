import { NextResponse, type NextRequest } from "next/server";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

export const dynamic = "force-dynamic";

const UPLOADS_DIR = process.env.UPLOADS_DIR ?? path.join(process.cwd(), "public", "uploads");
const CACHE_DIR = path.join(os.tmpdir(), "retouch-media-cache");
const RESIZABLE = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
// Snap requests to a fixed set so the cache can't be flooded with odd widths.
const WIDTHS = [320, 480, 640, 828, 1080, 1280, 1600, 1920, 2400];

/**
 * Resized WebP versions of uploaded images, so phones don't download the
 * 2400px originals. Upload filenames are random UUIDs and never overwritten,
 * so variants are cached on disk (and by browsers) indefinitely.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await params;

  if (segments.some((segment) => segment.includes("..") || segment.includes("/") || segment.includes("\\"))) {
    return new NextResponse(null, { status: 400 });
  }

  const resolvedRoot = path.resolve(/* turbopackIgnore: true */ UPLOADS_DIR);
  const resolvedPath = path.resolve(resolvedRoot, ...segments);
  if (!resolvedPath.startsWith(resolvedRoot + path.sep) || !RESIZABLE.has(path.extname(resolvedPath).toLowerCase())) {
    return new NextResponse(null, { status: 400 });
  }

  const requested = Number(request.nextUrl.searchParams.get("w"));
  const width = WIDTHS.find((w) => w >= requested) ?? WIDTHS[WIDTHS.length - 1];
  const cacheFile = path.join(/* turbopackIgnore: true */ CACHE_DIR, `${segments.join("_")}.${width}.webp`);

  const headers = {
    "Content-Type": "image/webp",
    "Cache-Control": "public, max-age=31536000, immutable",
  };

  try {
    return new NextResponse(new Uint8Array(await readFile(cacheFile)), { headers });
  } catch {
    // not cached yet
  }

  try {
    const data = await sharp(resolvedPath)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toBuffer();
    // Best effort: a read-only or full temp dir just means re-encoding next time.
    mkdir(CACHE_DIR, { recursive: true })
      .then(() => writeFile(cacheFile, data))
      .catch(() => {});
    return new NextResponse(new Uint8Array(data), { headers });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
