-- CreateEnum
CREATE TYPE "SocialPlatform" AS ENUM ('INSTAGRAM', 'FACEBOOK', 'TIKTOK', 'YOUTUBE', 'TWITTER', 'LINKEDIN', 'OTHER');

-- CreateEnum
CREATE TYPE "SubmissionType" AS ENUM ('CONTACT', 'JOIN_COMMUNITY', 'PARTNER_INQUIRY');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('NEW', 'READ', 'ARCHIVED');

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "heroEyebrow" TEXT NOT NULL DEFAULT 'WELCOME TO',
    "heroTitle" TEXT NOT NULL DEFAULT 'RETOUCH AFRICA',
    "heroTagline" TEXT NOT NULL DEFAULT 'Elevating the art of retouching across Africa.',
    "heroBody" TEXT NOT NULL DEFAULT '',
    "heroImageUrl" TEXT,
    "heroVideoUrl" TEXT,
    "storyEyebrow" TEXT NOT NULL DEFAULT 'OUR STORY',
    "storyHeading" TEXT NOT NULL DEFAULT 'A Community. A Vision. A Movement.',
    "storyBody" TEXT NOT NULL DEFAULT '',
    "missionTitle" TEXT NOT NULL DEFAULT 'OUR MISSION',
    "missionBody" TEXT NOT NULL DEFAULT '',
    "visionTitle" TEXT NOT NULL DEFAULT 'OUR VISION',
    "visionBody" TEXT NOT NULL DEFAULT '',
    "impactTitle" TEXT NOT NULL DEFAULT 'OUR IMPACT',
    "impactBody" TEXT NOT NULL DEFAULT '',
    "footerHeading" TEXT NOT NULL DEFAULT 'Be Part of Africa''s Retouching Future',
    "footerBody" TEXT NOT NULL DEFAULT '',
    "contactEmail" TEXT NOT NULL DEFAULT 'helloretouchafrica@gmail.com',
    "contactHandle" TEXT NOT NULL DEFAULT '@retouch_africa',
    "secondaryHandle" TEXT DEFAULT '@theretouchafrica',
    "copyrightLine" TEXT NOT NULL DEFAULT '© 2026 Retouch Africa. All Rights Reserved.',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialLink" (
    "id" TEXT NOT NULL,
    "platform" "SocialPlatform" NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "facilitatorId" TEXT,

    CONSTRAINT "SocialLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workshop" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "eyebrow" TEXT NOT NULL DEFAULT 'UPCOMING WORKSHOP',
    "summary" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "durationLabel" TEXT NOT NULL DEFAULT '3 DAYS',
    "locationLabel" TEXT NOT NULL,
    "venueLabel" TEXT,
    "seatsLabel" TEXT NOT NULL DEFAULT 'LIMITED SEATS',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "registerUrl" TEXT,
    "heroImageUrl" TEXT,
    "galleryImages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workshop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Facilitator" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "photoUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Facilitator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryImage" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "caption" TEXT,
    "category" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GalleryImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "websiteUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "type" "SubmissionType" NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT,
    "metadata" JSONB,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE INDEX "SocialLink_facilitatorId_idx" ON "SocialLink"("facilitatorId");

-- CreateIndex
CREATE UNIQUE INDEX "Workshop_slug_key" ON "Workshop"("slug");

-- CreateIndex
CREATE INDEX "Workshop_isFeatured_idx" ON "Workshop"("isFeatured");

-- CreateIndex
CREATE INDEX "Workshop_isPublished_idx" ON "Workshop"("isPublished");

-- CreateIndex
CREATE UNIQUE INDEX "Facilitator_slug_key" ON "Facilitator"("slug");

-- CreateIndex
CREATE INDEX "Facilitator_isPublished_idx" ON "Facilitator"("isPublished");

-- CreateIndex
CREATE INDEX "GalleryImage_isPublished_idx" ON "GalleryImage"("isPublished");

-- CreateIndex
CREATE INDEX "Partner_isPublished_idx" ON "Partner"("isPublished");

-- CreateIndex
CREATE INDEX "Submission_type_idx" ON "Submission"("type");

-- CreateIndex
CREATE INDEX "Submission_status_idx" ON "Submission"("status");

-- AddForeignKey
ALTER TABLE "SocialLink" ADD CONSTRAINT "SocialLink_facilitatorId_fkey" FOREIGN KEY ("facilitatorId") REFERENCES "Facilitator"("id") ON DELETE CASCADE ON UPDATE CASCADE;
