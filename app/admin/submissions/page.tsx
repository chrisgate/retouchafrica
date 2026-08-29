import { prisma } from "@/lib/prisma";
import { SubmissionStatusSelect } from "@/components/admin/SubmissionStatusSelect";

export default async function AdminSubmissionsPage() {
  const submissions = await prisma.submission.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="font-display text-2xl">Submissions</h1>

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
            </tr>
          </thead>
          <tbody>
            {submissions.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-ink/40">
                  No submissions yet.
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
                  <SubmissionStatusSelect id={s.id} status={s.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
