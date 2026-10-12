import { prisma } from "@/lib/prisma";
import { GalleryUploader } from "@/components/admin/GalleryUploader";
import { GalleryAdminGrid } from "@/components/admin/GalleryAdminGrid";

export default async function AdminGalleryPage() {
  const images = await prisma.galleryImage.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    select: { id: true, imageUrl: true, caption: true, isPublished: true },
  });

  return (
    <div>
      <h1 className="font-display text-2xl">Gallery</h1>
      <p className="mt-1 text-sm text-ink/60">
        Add photos in bulk — no captions or categories needed. Click a photo to select it; use Edit to hide it or add a
        caption.
      </p>

      <div className="mt-6">
        <GalleryUploader />
      </div>

      <div className="mt-10">
        <GalleryAdminGrid images={images} />
      </div>
    </div>
  );
}
