import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

export type UploadFolder = "workshops" | "facilitators" | "gallery" | "partners" | "settings";

const UPLOADS_DIR = process.env.UPLOADS_DIR ?? path.join(process.cwd(), "public", "uploads");
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED_MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

/**
 * Saves an uploaded image to local disk under public/uploads/<folder>/<id>.<ext>
 * and returns the public URL path to store in the DB (e.g. "/uploads/gallery/abc123.jpg").
 *
 * Local filesystem storage (not S3) is intentional: this is a low-traffic
 * self-hosted site, and Coolify's persistent volumes solve the
 * "files lost on redeploy" problem directly. See PLAN.md, section "Admin Panel".
 */
export async function saveUpload(file: File, folder: UploadFolder): Promise<string> {
  if (file.size === 0) {
    throw new Error("Uploaded file is empty.");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Uploaded file exceeds the 8MB size limit.");
  }
  const ext = ALLOWED_MIME_TO_EXT[file.type];
  if (!ext) {
    throw new Error(`Unsupported file type: ${file.type || "unknown"}. Use JPEG, PNG, WebP, or AVIF.`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${randomUUID()}.${ext}`;
  const folderPath = path.join(/* turbopackIgnore: true */ UPLOADS_DIR, folder);
  await mkdir(folderPath, { recursive: true });

  const optimized = await sharp(buffer)
    .rotate()
    .resize({ width: 2400, withoutEnlargement: true })
    .toBuffer();

  await writeFile(path.join(/* turbopackIgnore: true */ folderPath, filename), optimized);

  return `/uploads/${folder}/${filename}`;
}

/**
 * Deletes a previously uploaded image given its public URL path
 * (e.g. "/uploads/gallery/abc123.jpg"). No-ops silently if the file is missing
 * or the path doesn't look like one of ours (external URL, null, etc).
 */
export async function deleteUpload(publicPath: string | null | undefined): Promise<void> {
  if (!publicPath || !publicPath.startsWith("/uploads/")) return;
  const relative = publicPath.replace(/^\/uploads\//, "");
  const absolute = path.join(/* turbopackIgnore: true */ UPLOADS_DIR, relative);
  try {
    await unlink(absolute);
  } catch {
    // File already gone or never existed — safe to ignore.
  }
}
