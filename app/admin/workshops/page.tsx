import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/admin/DataTable";
import { deleteWorkshopAction } from "@/lib/actions/workshops";

export default async function AdminWorkshopsPage() {
  const workshops = await prisma.workshop.findMany({ orderBy: { startDate: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Workshops</h1>
        <Link
          href="/admin/workshops/new"
          className="bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-paper"
        >
          New Workshop
        </Link>
      </div>

      <div className="mt-6">
        <DataTable
          rows={workshops}
          editHref={(w) => `/admin/workshops/${w.id}/edit`}
          onDelete={deleteWorkshopAction}
          columns={[
            { header: "Title", cell: (w) => w.title },
            { header: "Start Date", cell: (w) => w.startDate.toLocaleDateString() },
            { header: "Featured", cell: (w) => (w.isFeatured ? "Yes" : "—") },
            { header: "Published", cell: (w) => (w.isPublished ? "Yes" : "Draft") },
          ]}
        />
      </div>
    </div>
  );
}
