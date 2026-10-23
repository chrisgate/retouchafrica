import "server-only";
import { prisma } from "@/lib/prisma";
import { cachedQuery } from "@/lib/cache";

export const getSocialLinks = cachedQuery("social-links", () =>
  prisma.socialLink.findMany({ where: { facilitatorId: null }, orderBy: { order: "asc" } }),
);

export const getHeroImages = cachedQuery("hero-images", () =>
  prisma.heroImage.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    select: { imageUrl: true },
  }),
);

export const getFeaturedWorkshop = cachedQuery("featured-workshop", () =>
  prisma.workshop.findFirst({
    where: { isFeatured: true, isPublished: true },
    orderBy: { startDate: "asc" },
  }),
);

export const getPublishedWorkshops = cachedQuery("published-workshops", () =>
  prisma.workshop.findMany({ where: { isPublished: true }, orderBy: { startDate: "desc" } }),
);

export const getWorkshopBySlug = cachedQuery("workshop-by-slug", (slug: string) =>
  prisma.workshop.findUnique({ where: { slug } }),
);

export const getPublishedFacilitators = cachedQuery("published-facilitators", (take?: number) =>
  prisma.facilitator.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
    ...(take ? { take } : {}),
    include: { socialLinks: true },
  }),
);

export const getFacilitatorBySlug = cachedQuery("facilitator-by-slug", (slug: string) =>
  prisma.facilitator.findUnique({ where: { slug }, include: { socialLinks: true } }),
);

export const getPublishedPartners = cachedQuery("published-partners", () =>
  prisma.partner.findMany({ where: { isPublished: true }, orderBy: { order: "asc" } }),
);
