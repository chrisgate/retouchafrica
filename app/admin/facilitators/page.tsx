import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/admin/DataTable";
import { deleteFacilitatorAction } from "@/lib/actions/facilitators";

export default async function AdminFacilitatorsPage() {
  const facilitators = await prisma.facilitator.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Facilitators</h1>
        <Link
          href="/admin/facilitators/new"
          className="bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-paper"
        >
          New Facilitator
        </Link>
      </div>

      <div className="mt-6">
        <DataTable
          rows={facilitators}
          editHref={(f) => `/admin/facilitators/${f.id}/edit`}
          onDelete={deleteFacilitatorAction}
          columns={[
            { header: "Name", cell: (f) => f.name },
            { header: "Role", cell: (f) => f.role },
            { header: "Order", cell: (f) => f.order },
            { header: "Published", cell: (f) => (f.isPublished ? "Yes" : "Draft") },
          ]}
        />
      </div>
    </div>
  );
}
