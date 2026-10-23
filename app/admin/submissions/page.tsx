import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SubmissionStatusSelect } from "@/components/admin/SubmissionStatusSelect";
import { SubmissionActions } from "@/components/admin/SubmissionActions";

export default async function AdminSubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const showArchived = (await searchParams).view === "archived";
  const [submissions, activeCount, archivedCount] = await Promise.all([
    prisma.submission.findMany({
      where: showArchived ? { status: "ARCHIVED" } : { status: { not: "ARCHIVED" } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.submission.count({ where: { status: { not: "ARCHIVED" } } }),
    prisma.submission.count({ where: { status: "ARCHIVED" } }),
  ]);

  const tabClass = (active: boolean) =>
    `border-b-2 pb-2 text-sm ${active ? "border-gold text-ink" : "border-transparent text-ink/50 hover:text-ink"}`;

  return (
    <div>
      <h1 className="font-display text-2xl">Submissions</h1>

      <div className="mt-4 flex gap-6 border-b border-ink/10">
        <Link href="/admin/submissions" className={tabClass(!showArchived)}>
          Inbox ({activeCount})
        </Link>
        <Link href="/admin/submissions?view=archived" className={tabClass(showArchived)}>
          Archived ({archivedCount})
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-left text-xs uppercase tracking-wide text-ink/50">
              <th className="py-2 pr-4 font-medium">Type</th>
              <th className="py-2 pr-4 font-medium">Name</th>
              <th className="py-2 pr-4 font-medium">Email</th>
              <th className="py-2 pr-4 font-medium">Message</th>
              <th className="py-2 pr-4 font-medium">Received</th>
              <th className="py-2 pr-4 font-medium">Status</th>
              <th className="py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-ink/40">
                  {showArchived ? "No archived submissions." : "No submissions yet."}
                </td>
              </tr>
            )}
            {submissions.map((s) => (
              <tr key={s.id} className="border-b border-ink/5 align-top">
                <td className="py-3 pr-4">{s.type.replace("_", " ")}</td>
                <td className="py-3 pr-4">{s.name}</td>
                <td className="py-3 pr-4">
                  <a href={`mailto:${s.email}`} className="underline">
                    {s.email}
                  </a>
                  {s.phone && <div className="text-xs text-ink/50">{s.phone}</div>}
                </td>
                <td className="max-w-xs py-3 pr-4 whitespace-pre-wrap">{s.message ?? "—"}</td>
                <td className="py-3 pr-4 whitespace-nowrap">{s.createdAt.toLocaleString()}</td>
                <td className="py-3 pr-4">
                  <SubmissionStatusSelect key={s.status} id={s.id} status={s.status} />
                </td>
                <td className="py-3">
                  <SubmissionActions id={s.id} archived={s.status === "ARCHIVED"} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
