import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { GalleryImageForm } from "@/components/admin/forms/GalleryImageForm";
import { updateGalleryImageAction } from "@/lib/actions/gallery";

export default async function EditGalleryImagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const image = await prisma.galleryImage.findUnique({ where: { id } });
  if (!image) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl">Edit Gallery Image</h1>
      <div className="mt-6">
        <GalleryImageForm image={image} action={updateGalleryImageAction.bind(null, id)} />
      </div>
    </div>
  );
}
