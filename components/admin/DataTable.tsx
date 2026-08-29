import Link from "next/link";

export type Column<T> = {
  header: string;
  cell: (row: T) => React.ReactNode;
};

export function DataTable<T extends { id: string }>({
  rows,
  columns,
  editHref,
  onDelete,
  emptyLabel = "Nothing here yet.",
}: {
  rows: T[];
  columns: Column<T>[];
  editHref: (row: T) => string;
  onDelete: (id: string) => Promise<void>;
  emptyLabel?: string;
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-ink/50">{emptyLabel}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-ink/10 text-left text-xs uppercase tracking-wide text-ink/50">
            {columns.map((col) => (
              <th key={col.header} className="py-2 pr-4 font-medium whitespace-nowrap">
                {col.header}
              </th>
            ))}
            <th className="py-2 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-ink/5">
              {columns.map((col) => (
                <td key={col.header} className="py-3 pr-4">
                  {col.cell(row)}
                </td>
              ))}
              <td className="py-3 text-right">
                <div className="flex justify-end gap-3">
                  <Link href={editHref(row)} className="text-xs underline hover:text-gold">
                    Edit
                  </Link>
                  <form
                    action={async () => {
                      "use server";
                      await onDelete(row.id);
                    }}
                  >
                    <button type="submit" className="text-xs text-red-600 underline hover:text-red-800">
                      Delete
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
