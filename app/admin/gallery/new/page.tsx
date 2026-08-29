import { GalleryImageForm } from "@/components/admin/forms/GalleryImageForm";
import { createGalleryImageAction } from "@/lib/actions/gallery";

export default function NewGalleryImagePage() {
  return (
    <div>
      <h1 className="font-display text-2xl">New Gallery Image</h1>
      <div className="mt-6">
        <GalleryImageForm action={createGalleryImageAction} />
      </div>
    </div>
  );
}
