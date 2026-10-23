import type { MetadataRoute } from "next";
import { getPublishedFacilitators, getPublishedWorkshops } from "@/lib/queries";
import { absoluteUrl } from "@/lib/site";

// Built from the database on request — a build-time sitemap would be frozen
// (and the build has no database).
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [workshops, facilitators] = await Promise.all([getPublishedWorkshops(), getPublishedFacilitators()]);

  const pages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/workshop"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/facilitators"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/gallery"), changeFrequency: "weekly", priority: 0.6 },
    { url: absoluteUrl("/partners"), changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/community"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.5 },
  ];

  return [
    ...pages,
    ...workshops.map((w) => ({
      url: absoluteUrl(`/workshop/${w.slug}`),
      lastModified: w.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...facilitators.map((f) => ({
      url: absoluteUrl(`/facilitators/${f.slug}`),
      lastModified: f.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
