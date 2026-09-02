import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const createAdminUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters."),
  isSuperAdmin: z.coerce.boolean().default(false),
});

export const socialLinkSchema = z.object({
  platform: z.enum(["INSTAGRAM", "FACEBOOK", "TIKTOK", "YOUTUBE", "TWITTER", "LINKEDIN", "OTHER"]),
  url: z.string().url(),
  order: z.coerce.number().int().default(0),
});

export const workshopSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only."),
  title: z.string().min(1),
  eyebrow: z.string().default("UPCOMING WORKSHOP"),
  summary: z.string().min(1),
  description: z.string().min(1),
  durationLabel: z.string().default("3 DAYS"),
  locationLabel: z.string().min(1),
  venueLabel: z.string().optional().or(z.literal("")),
  seatsLabel: z.string().default("LIMITED SEATS"),
  startDate: z.coerce.date(),
  endDate: z.preprocess((val) => (val === "" ? undefined : val), z.coerce.date().optional().nullable()),
  registerUrl: z.string().url().optional().or(z.literal("")),
  isFeatured: z.coerce.boolean().default(false),
  isPublished: z.coerce.boolean().default(true),
});

export const facilitatorSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only."),
  name: z.string().min(1),
  role: z.string().min(1),
  bio: z.string().min(1),
  order: z.coerce.number().int().default(0),
  isPublished: z.coerce.boolean().default(true),
});

export const galleryImageSchema = z.object({
  caption: z.string().optional().or(z.literal("")),
  category: z.string().optional().or(z.literal("")),
  order: z.coerce.number().int().default(0),
  isPublished: z.coerce.boolean().default(true),
});

export const partnerSchema = z.object({
  name: z.string().min(1),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  order: z.coerce.number().int().default(0),
  isPublished: z.coerce.boolean().default(true),
});

export const siteSettingsSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroTagline: z.string(),
  heroBody: z.string(),
  storyEyebrow: z.string(),
  storyHeading: z.string(),
  storyBody: z.string(),
  missionTitle: z.string(),
  missionBody: z.string(),
  visionTitle: z.string(),
  visionBody: z.string(),
  impactTitle: z.string(),
  impactBody: z.string(),
  footerHeading: z.string(),
  footerBody: z.string(),
  contactEmail: z.string().email(),
  contactHandle: z.string(),
  secondaryHandle: z.string().optional().or(z.literal("")),
  copyrightLine: z.string(),
});

const contactBase = {
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Enter a valid email address."),
  phone: z.string().optional().or(z.literal("")),
  message: z.string().optional().or(z.literal("")),
};

export const contactFormSchema = z.object(contactBase);
export const joinCommunityFormSchema = z.object(contactBase);
export const partnerInquiryFormSchema = z.object(contactBase);
