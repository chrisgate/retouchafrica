-- CreateTable
CREATE TABLE "HeroImage" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HeroImage_pkey" PRIMARY KEY ("id")
);

-- Carry over any single hero image set before rotation existed.
INSERT INTO "HeroImage" ("id", "imageUrl")
SELECT 'hero_' || md5("heroImageUrl"), "heroImageUrl" FROM "SiteSettings" WHERE "heroImageUrl" IS NOT NULL;
