import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { invalidateSiteData } from "@/lib/cache";
import { getSession } from "@/lib/session";
import { saveUpload, deleteUpload } from "@/lib/uploads";

export const dynamic = "force-dynamic";

/**
 * Single-photo upload endpoint for the admin gallery uploader. The uploader
 * sends one file per request (a few in parallel) so each photo gets its own
 * progress bar and success/failure — and so a big batch never runs into the
 * request-body limits that apply to Server Actions. Lives outside /admin on
 * purpose: proxy.ts buffers request bodies on matched paths, so it would cap
 * uploads. Auth is therefore checked here, directly.
 */
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session.isAdmin || !session.userId) {
    return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  }

  let file: FormDataEntryValue | null;
  try {
    file = (await request.formData()).get("file");
  } catch {
    return NextResponse.json({ error: "Could not read the upload." }, { status: 400 });
  }
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No image received." }, { status: 400 });
  }

  let imageUrl: string;
  try {
    imageUrl = await saveUpload(file, "gallery");
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload image." },
      { status: 400 },
    );
  }

  try {
    const image = await prisma.galleryImage.create({ data: { imageUrl } });
    invalidateSiteData();
    revalidatePath("/");
    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    return NextResponse.json({ id: image.id, imageUrl });
  } catch {
    await deleteUpload(imageUrl);
    return NextResponse.json({ error: "Could not save the photo. Try again." }, { status: 500 });
  }
}
