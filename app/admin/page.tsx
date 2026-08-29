import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [workshops, facilitators, gallery, partners, newSubmissions] = await Promise.all([
    prisma.workshop.count(),
    prisma.facilitator.count(),
    prisma.galleryImage.count(),
    prisma.partner.count(),
    prisma.submission.count({ where: { status: "NEW" } }),
  ]);

  const cards = [
    { label: "Workshops", value: workshops, href: "/admin/workshops" },
    { label: "Facilitators", value: facilitators, href: "/admin/facilitators" },
    { label: "Gallery Images", value: gallery, href: "/admin/gallery" },
    { label: "Partners", value: partners, href: "/admin/partners" },
    { label: "New Submissions", value: newSubmissions, href: "/admin/submissions" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl">Dashboard</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="border border-ink/10 bg-paper p-5 transition-colors hover:border-gold"
          >
            <p className="font-display text-3xl">{card.value}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-ink/50">{card.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
