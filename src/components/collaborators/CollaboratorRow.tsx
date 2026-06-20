import type { Collaborator } from "@/types";
import { Avatar } from "./Avatar";

interface CollaboratorRowProps {
  collaborator: Collaborator;
}

/** Linha de um colaborador dentro do popover: avatar, nome, permissão e atividade. */
export function CollaboratorRow({ collaborator }: CollaboratorRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-slate-50">
      <Avatar name={collaborator.name} color={collaborator.color} size="md" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-800">
          {collaborator.name}
        </p>
        <p className="truncate text-xs text-slate-500">{collaborator.activity}</p>
      </div>
      <span className="shrink-0 text-xs font-medium text-slate-400">
        {collaborator.permission}
      </span>
    </div>
  );
}
