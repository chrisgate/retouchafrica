import "server-only";
import { prisma } from "@/lib/prisma";
import { getImageSize } from "@/lib/uploads";
import type { GalleryItem } from "@/components/gallery/types";

// Newest first among photos sharing an order value, so fresh uploads (order 0)
// appear at the top without anyone having to manage ordering.
const PUBLISHED_ORDER = [{ order: "asc" as const }, { createdAt: "desc" as const }];

const FALLBACK_SIZE = { width: 4, height: 3 };

/** Published gallery photos, newest first, with the dimensions the layout needs. */
export async function getPublishedGalleryItems(limit?: number): Promise<GalleryItem[]> {
  const images = await prisma.galleryImage.findMany({
    where: { isPublished: true },
    orderBy: PUBLISHED_ORDER,
    ...(limit ? { take: limit } : {}),
  });

  return Promise.all(
    images.map(async (image) => {
      const size = (await getImageSize(image.imageUrl)) ?? FALLBACK_SIZE;
      return {
        id: image.id,
        src: image.imageUrl,
        caption: image.caption,
        category: image.category,
        ...size,
      };
    }),
  );
}
