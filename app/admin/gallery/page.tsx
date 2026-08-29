import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/admin/DataTable";
import { deleteGalleryImageAction } from "@/lib/actions/gallery";

export default async function AdminGalleryPage() {
  const images = await prisma.galleryImage.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Gallery</h1>
        <Link
          href="/admin/gallery/new"
          className="bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-paper"
        >
          New Image
        </Link>
      </div>

      <div className="mt-6">
        <DataTable
          rows={images}
          editHref={(img) => `/admin/gallery/${img.id}/edit`}
          onDelete={deleteGalleryImageAction}
          columns={[
            {
              header: "Preview",
              cell: (img) => (
                <div className="relative h-12 w-12 overflow-hidden bg-paper-soft">
                  <Image src={img.imageUrl} alt="" fill className="object-cover" />
                </div>
              ),
            },
            { header: "Caption", cell: (img) => img.caption ?? "—" },
            { header: "Category", cell: (img) => img.category ?? "—" },
            { header: "Order", cell: (img) => img.order },
            { header: "Published", cell: (img) => (img.isPublished ? "Yes" : "Draft") },
          ]}
        />
      </div>
    </div>
  );
}
