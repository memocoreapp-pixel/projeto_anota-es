import { useState } from "react";
import type { Collaborator } from "@/types";
import { Avatar } from "./Avatar";
import { CollaboratorsPopover } from "./CollaboratorsPopover";

interface CollaboratorAvatarsProps {
  collaborators: Collaborator[];
  /** Quantidade máxima de avatares visíveis antes do contador +N. */
  max?: number;
}

/**
 * Pilha de avatares de colaboradores. Mostra até `max` avatares e um contador
 * "+N" quando há mais. Clicar abre o popover de colaboradores.
 */
export function CollaboratorAvatars({
  collaborators,
  max = 3,
}: CollaboratorAvatarsProps) {
  const [open, setOpen] = useState(false);

  const visible = collaborators.slice(0, max);
  const remaining = collaborators.length - visible.length;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center -space-x-2 rounded-full p-0.5 transition-opacity hover:opacity-90"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Ver colaboradores"
      >
        {visible.map((collaborator) => (
          <Avatar
            key={collaborator.id}
            name={collaborator.name}
            color={collaborator.color}
          />
        ))}
        {remaining > 0 && (
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 ring-2 ring-white">
            +{remaining}
          </span>
        )}
      </button>

      {open && (
        <CollaboratorsPopover
          collaborators={collaborators}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
