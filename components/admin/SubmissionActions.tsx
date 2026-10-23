"use client";

import { useTransition } from "react";
import { deleteSubmissionAction, markSubmissionStatusAction } from "@/lib/actions/submissions";

export function SubmissionActions({ id, archived }: { id: string; archived: boolean }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex gap-3 whitespace-nowrap">
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => markSubmissionStatusAction(id, archived ? "READ" : "ARCHIVED"))}
        className="text-xs underline hover:text-gold disabled:opacity-50"
      >
        {archived ? "Unarchive" : "Archive"}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!window.confirm("Delete this submission permanently?")) return;
          startTransition(() => deleteSubmissionAction(id));
        }}
        className="text-xs text-red-600 underline hover:text-red-800 disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
