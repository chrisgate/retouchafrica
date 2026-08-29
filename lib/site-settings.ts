import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

const DEFAULT_SETTINGS = {
  id: 1,
  heroEyebrow: "WELCOME TO",
  heroTitle: "RETOUCH AFRICA",
  heroTagline: "Elevating the art of retouching across Africa.",
  heroBody: "",
  heroImageUrl: null as string | null,
  heroVideoUrl: null as string | null,
  storyEyebrow: "OUR STORY",
  storyHeading: "A Community. A Vision. A Movement.",
  storyBody: "",
  missionTitle: "OUR MISSION",
  missionBody: "",
  visionTitle: "OUR VISION",
  visionBody: "",
  impactTitle: "OUR IMPACT",
  impactBody: "",
  footerHeading: "Be Part of Africa's Retouching Future",
  footerBody: "",
  contactEmail: "helloretouchafrica@gmail.com",
  contactHandle: "@retouch_africa",
  secondaryHandle: "@theretouchafrica" as string | null,
  copyrightLine: "© 2026 Retouch Africa. All Rights Reserved.",
};

export type SiteSettings = typeof DEFAULT_SETTINGS;

export const getSiteSettings = unstable_cache(
  async (): Promise<SiteSettings> => {
    const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
    return settings ?? DEFAULT_SETTINGS;
  },
  ["site-settings"],
  { tags: ["site-settings"] }
);
