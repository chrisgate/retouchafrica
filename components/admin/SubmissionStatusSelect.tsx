"use client";

import { markSubmissionStatusAction } from "@/lib/actions/submissions";

const STATUS_OPTIONS = ["NEW", "READ", "ARCHIVED"] as const;

export function SubmissionStatusSelect({
  id,
  status,
}: {
  id: string;
  status: (typeof STATUS_OPTIONS)[number];
}) {
  return (
    <select
      defaultValue={status}
      onChange={(e) => markSubmissionStatusAction(id, e.target.value as (typeof STATUS_OPTIONS)[number])}
      className="border border-ink/20 px-2 py-1 text-xs"
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
