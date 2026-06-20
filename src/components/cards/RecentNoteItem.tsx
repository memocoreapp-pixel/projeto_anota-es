import { FileText, ChevronRight } from "lucide-react";
import type { RecentNote } from "@/types";

interface RecentNoteItemProps {
  note: RecentNote;
}

/** Item de lista de uma nota recente. */
export function RecentNoteItem({ note }: RecentNoteItemProps) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-slate-50"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
        <FileText className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-800">{note.title}</p>
        <p className="truncate text-xs text-slate-500">
          {note.space} · {note.updatedAt}
        </p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" aria-hidden="true" />
    </button>
  );
}
