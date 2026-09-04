import { NextResponse, type NextRequest } from "next/server";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";

const UPLOADS_DIR = process.env.UPLOADS_DIR ?? path.join(process.cwd(), "public", "uploads");

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

/**
 * Next.js's production server snapshots `public/` once at boot (see
 * next/dist/server/lib/router-utils/filesystem.js) and never rechecks disk,
 * so a file uploaded after the server started 404s through normal static
 * serving even though it's sitting right there on disk. This route only
 * gets hit for exactly those cache-miss cases (a real, on-disk public file
 * is served by Next's static path first) — it reads the file live instead.
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await params;

  if (segments.some((segment) => segment.includes("..") || segment.includes("/") || segment.includes("\\"))) {
    return new NextResponse(null, { status: 400 });
  }

  const resolvedRoot = path.resolve(/* turbopackIgnore: true */ UPLOADS_DIR);
  const resolvedPath = path.resolve(resolvedRoot, ...segments);
  if (!resolvedPath.startsWith(resolvedRoot + path.sep)) {
    return new NextResponse(null, { status: 400 });
  }

  try {
    const [data, stats] = await Promise.all([readFile(resolvedPath), stat(resolvedPath)]);
    const contentType = CONTENT_TYPES[path.extname(resolvedPath).toLowerCase()] ?? "application/octet-stream";
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(stats.size),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
