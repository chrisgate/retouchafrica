import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { invalidateSiteData } from "@/lib/cache";
import { getSession } from "@/lib/session";
import { saveUpload, deleteUpload } from "@/lib/uploads";

export const dynamic = "force-dynamic";

const MAX_HERO_IMAGES = 8; // keep in sync with components/admin/HeroImageUploader.tsx

/**
 * Home-page hero slideshow images: POST adds one (one file per request, like
 * the gallery uploader), DELETE ?id=… removes one. Lives outside /admin so the
 * proxy and Server Action 1MB body caps don't apply to full-size photos; auth
 * is checked directly.
 */
async function requireAdminSession() {
  const session = await getSession();
  return session.isAdmin && session.userId;
}

function refresh() {
  invalidateSiteData();
  revalidatePath("/");
  revalidatePath("/admin/settings");
}

export async function POST(request: NextRequest) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  }

  if ((await prisma.heroImage.count()) >= MAX_HERO_IMAGES) {
    return NextResponse.json({ error: `You can have up to ${MAX_HERO_IMAGES} hero images. Remove one first.` }, { status: 400 });
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
    imageUrl = await saveUpload(file, "settings");
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload image." },
      { status: 400 },
    );
  }

  try {
    const last = await prisma.heroImage.aggregate({ _max: { order: true } });
    const image = await prisma.heroImage.create({
      data: { imageUrl, order: (last._max.order ?? -1) + 1 },
    });
    refresh();
    return NextResponse.json({ id: image.id, imageUrl });
  } catch {
    await deleteUpload(imageUrl);
    return NextResponse.json({ error: "Could not save the image. Try again." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  }

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing image id." }, { status: 400 });

  const image = await prisma.heroImage.findUnique({ where: { id } });
  if (image) {
    await prisma.heroImage.delete({ where: { id } });
    await deleteUpload(image.imageUrl);
  }
  refresh();
  return NextResponse.json({ ok: true });
}
