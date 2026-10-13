import "server-only";
import { prisma } from "@/lib/prisma";
import { getImageSize } from "@/lib/uploads";
import type { GalleryImage } from "@prisma/client";
import type { GalleryItem } from "@/components/gallery/types";

// Newest first among photos sharing an order value, so fresh uploads (order 0)
// appear at the top without anyone having to manage ordering.
const PUBLISHED_ORDER = [{ order: "asc" as const }, { createdAt: "desc" as const }];

const FALLBACK_SIZE = { width: 4, height: 3 };

async function toGalleryItems(images: GalleryImage[]): Promise<GalleryItem[]> {
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

/** Published gallery photos, newest first, with the dimensions the layout needs. */
export async function getPublishedGalleryItems(limit?: number): Promise<GalleryItem[]> {
  const images = await prisma.galleryImage.findMany({
    where: { isPublished: true },
    orderBy: PUBLISHED_ORDER,
    ...(limit ? { take: limit } : {}),
  });
  return toGalleryItems(images);
}

/**
 * `count` published photos chosen at random, in random order. Callers must be
 * dynamically rendered (the home page is) or the pick would be frozen at build.
 * Only ids are loaded to choose from, so this stays cheap for large galleries.
 */
export async function getRandomGalleryItems(count: number): Promise<GalleryItem[]> {
  const all = await prisma.galleryImage.findMany({ where: { isPublished: true }, select: { id: true } });

  // Fisher–Yates shuffle, stopping once `count` picks are settled.
  const ids = all.map((image) => image.id);
  const picks = Math.min(count, ids.length);
  for (let i = 0; i < picks; i++) {
    const j = i + Math.floor(Math.random() * (ids.length - i));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  const chosen = ids.slice(0, picks);
  if (chosen.length === 0) return [];

  const images = await prisma.galleryImage.findMany({ where: { id: { in: chosen } } });
  const byId = new Map(images.map((image) => [image.id, image]));
  // findMany doesn't preserve the `in` order — restore the shuffled order.
  return toGalleryItems(chosen.flatMap((id) => byId.get(id) ?? []));
}
