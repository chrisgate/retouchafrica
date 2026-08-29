import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // --- Admin user ---
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@retouchafrica.org";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "change-me-please";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash, isSuperAdmin: true },
    create: { email: adminEmail, passwordHash, isSuperAdmin: true },
  });

  // --- Site settings (singleton) ---
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      heroBody:
        "We are a creative community, platform and movement dedicated to educating, inspiring and connecting retouchers, photographers and digital artists across the continent.",
      storyBody:
        "Retouch Africa was born from a simple belief: that Africa is home to extraordinary talent, and with the right knowledge, resources and opportunities, we can compete and lead globally.",
      missionBody:
        "To empower creatives through world-class retouching education, mentorship and community.",
      visionBody:
        "To build Africa's most respected retouching platform and raise a new generation of retouching leaders.",
      impactBody: "We educate. We connect. We create opportunities. We elevate Africa.",
      footerBody:
        "Join a growing community of creatives, learn from the best, and transform your skills.",
    },
  });

  // --- Site-wide social links (footer + CTA "Follow Us") ---
  const siteSocialLinks = [
    { platform: "INSTAGRAM" as const, url: "https://instagram.com/retouch_africa", order: 0 },
    { platform: "FACEBOOK" as const, url: "https://facebook.com/retouchafrica", order: 1 },
    { platform: "TIKTOK" as const, url: "https://tiktok.com/@retouch_africa", order: 2 },
    { platform: "YOUTUBE" as const, url: "https://youtube.com/@retouchafrica", order: 3 },
  ];
  await prisma.socialLink.deleteMany({ where: { facilitatorId: null } });
  await prisma.socialLink.createMany({ data: siteSocialLinks });

  // --- Facilitators ---
  const facilitators = [
    {
      slug: "ore",
      name: "Ore",
      role: "Professional Retoucher & Educator",
      bio: "A professional beauty, fashion and editorial retoucher.",
      photoUrl: "/uploads/facilitators/ore_pictures.jpeg",
      instagram: "ore_pictures",
      order: 0,
    },
    {
      slug: "ella-boamah",
      name: "Ella Boamah",
      role: "Photographer & Educator",
      bio: "A talented photographer and retoucher based in Accra, Ghana.",
      photoUrl: "/uploads/facilitators/ellaboamahphotography.jpeg",
      instagram: "ellaboamahphotography",
      order: 1,
    },
    {
      slug: "balogun-victor",
      name: "Balogun Victor",
      role: "Professional Retoucher & Educator",
      bio: "A professional retoucher and educator, passionate about sharing knowledge and helping creatives develop their skills and creative workflow.",
      photoUrl: "/uploads/facilitators/thebalogunvictor.jpeg",
      instagram: "thebalogunvictor",
      order: 2,
    },
  ];

  for (const f of facilitators) {
    const { instagram, ...data } = f;
    const facilitator = await prisma.facilitator.upsert({
      where: { slug: f.slug },
      update: data,
      create: data,
    });

    await prisma.socialLink.deleteMany({ where: { facilitatorId: facilitator.id } });
    await prisma.socialLink.create({
      data: {
        facilitatorId: facilitator.id,
        platform: "INSTAGRAM",
        url: `https://instagram.com/${instagram}`,
        order: 0,
      },
    });
  }

  // --- Featured workshop (countdown target ~3 weeks out) ---
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 21);
  startDate.setHours(9, 0, 0, 0);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 2);

  const workshopData = {
    title: "High-End Beauty & Editorial Retouching Workshop",
    summary: "Three intensive days of retouching, creativity and connection with industry professionals.",
    description:
      "Join us for an immersive three-day workshop covering advanced frequency separation, dodge & burn, color grading, and portfolio-ready editorial retouching techniques — taught by working professionals and capped at a small cohort for hands-on mentorship.",
    durationLabel: "3 DAYS",
    locationLabel: "LAGOS, NIGERIA",
    venueLabel: "MCB Studio Rentals",
    seatsLabel: "LIMITED SEATS",
    startDate,
    endDate,
    isFeatured: true,
    isPublished: true,
    galleryImages: [
      "/uploads/workshops/placeholder.png",
      "/uploads/workshops/placeholder.png",
      "/uploads/workshops/placeholder.png",
    ],
  };

  await prisma.workshop.upsert({
    where: { slug: "high-end-beauty-editorial-retouching" },
    update: workshopData,
    create: { slug: "high-end-beauty-editorial-retouching", ...workshopData },
  });

  // --- Gallery images (placeholder captions; imageUrl left as local placeholder path) ---
  const galleryCaptions = [
    "Facilitator walkthrough during a live retouching demo",
    "Attendees collaborating during a hands-on session",
    "One-on-one mentorship between sessions",
    "Studio lighting setup for the portrait shoot",
    "Group portrait after workshop completion",
    "Editorial retouching before/after review",
    "Networking during the community mixer",
    "Behind the scenes of the portfolio shoot",
  ];
  for (let i = 0; i < galleryCaptions.length; i++) {
    const imageUrl = `/uploads/gallery/placeholder-${(i % 3) + 1}.png`;
    await prisma.galleryImage.upsert({
      where: { id: `seed-gallery-${i}` },
      update: { imageUrl },
      create: {
        id: `seed-gallery-${i}`,
        imageUrl,
        caption: galleryCaptions[i],
        category: "Workshop 2026",
        order: i,
      },
    });
  }

  // --- Partners ---
  const partners = [
    { name: "MCB Studio Rentals", order: 0 },
    { name: "Evoto AI", order: 1 },
    { name: "Huion", order: 2 },
    { name: "Canon", order: 3 },
    { name: "Profoto", order: 4 },
    { name: "KelbyOne", order: 5 },
  ];
  for (const p of partners) {
    const existing = await prisma.partner.findFirst({ where: { name: p.name } });
    if (!existing) {
      await prisma.partner.create({
        data: { ...p, logoUrl: "/uploads/partners/placeholder.png" },
      });
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
