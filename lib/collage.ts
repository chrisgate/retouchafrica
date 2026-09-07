/**
 * Fills a 3-slot photo collage from however many gallery images a workshop
 * actually has: 1 photo repeats to fill all three slots, 2 photos repeat the
 * first to fill the third, 3+ uses the first three as-is.
 */
export function fillCollageImages(images: string[]): string[] {
  if (images.length === 0) return [];
  if (images.length >= 3) return images.slice(0, 3);
  if (images.length === 1) return [images[0], images[0], images[0]];
  return [images[0], images[1], images[0]];
}
