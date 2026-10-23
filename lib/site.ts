export const SITE_NAME = "Retouch Africa";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://retouchafrica.com").replace(/\/$/, "");
export const SITE_DESCRIPTION =
  "Retouch Africa is a creative community, platform and movement dedicated to educating, inspiring and connecting retouchers, photographers and digital artists across the continent.";

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Trims text to a meta-description length without cutting mid-word. */
export function truncate(text: string, max = 158): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max).replace(/\s+\S*$/, "") + "…";
}
