import { unstable_cache, revalidateTag } from "next/cache";

/** Every cached public-site query carries this tag; admin writes clear it. */
export const SITE_TAG = "site-data";

// unstable_cache stores JSON, which turns Dates into strings. Round-trip
// through JSON ourselves and revive ISO timestamps so callers still get Dates.
const ISO_DATE = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?Z$/;

/**
 * Caches a read-only database query. Entries live until an admin write calls
 * invalidateSiteData(), with `revalidate` seconds as a safety net.
 */
export function cachedQuery<A extends unknown[], R>(
  key: string,
  fn: (...args: A) => Promise<R>,
  revalidate = 300,
): (...args: A) => Promise<R> {
  const cached = unstable_cache(async (...args: A) => JSON.stringify(await fn(...args)), [key], {
    tags: [SITE_TAG],
    revalidate,
  });
  return async (...args: A) =>
    JSON.parse(await cached(...args), (_k, v) => (typeof v === "string" && ISO_DATE.test(v) ? new Date(v) : v)) as R;
}

/** Call after any write that changes what the public site shows. */
export function invalidateSiteData() {
  revalidateTag(SITE_TAG, { expire: 0 });
}
