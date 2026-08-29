import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/admin/DataTable";
import { deletePartnerAction } from "@/lib/actions/partners";

export default async function AdminPartnersPage() {
  const partners = await prisma.partner.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Partners</h1>
        <Link
          href="/admin/partners/new"
          className="bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-paper"
        >
          New Partner
        </Link>
      </div>

      <div className="mt-6">
        <DataTable
          rows={partners}
          editHref={(p) => `/admin/partners/${p.id}/edit`}
          onDelete={deletePartnerAction}
          columns={[
            {
              header: "Logo",
              cell: (p) => (
                <div className="relative h-8 w-20 overflow-hidden bg-paper-soft">
                  <Image src={p.logoUrl} alt="" fill className="object-contain" />
                </div>
              ),
            },
            { header: "Name", cell: (p) => p.name },
            { header: "Order", cell: (p) => p.order },
            { header: "Published", cell: (p) => (p.isPublished ? "Yes" : "Draft") },
          ]}
        />
      </div>
    </div>
  );
}
