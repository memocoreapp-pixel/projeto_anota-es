import { useEffect, useRef } from "react";
import { UserPlus } from "lucide-react";
import type { Collaborator } from "@/types";
import { Button } from "@/components/ui/Button";
import { CollaboratorRow } from "./CollaboratorRow";

interface CollaboratorsPopoverProps {
  collaborators: Collaborator[];
  onClose: () => void;
}

/**
 * Popover com a lista de colaboradores. Fecha ao clicar fora ou pressionar Esc.
 */
export function CollaboratorsPopover({
  collaborators,
  onClose,
}: CollaboratorsPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointer(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="Colaboradores"
      className="absolute right-0 top-full z-20 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-soft"
    >
      <div className="flex items-center justify-between px-2 pb-2">
        <h3 className="text-sm font-semibold text-slate-800">Colaboradores</h3>
        <span className="text-xs text-slate-400">{collaborators.length} pessoas</span>
      </div>

      <div className="max-h-64 space-y-0.5 overflow-y-auto">
        {collaborators.map((collaborator) => (
          <CollaboratorRow key={collaborator.id} collaborator={collaborator} />
        ))}
      </div>

      <div className="mt-2 border-t border-slate-100 pt-3">
        <Button variant="secondary" size="sm" icon={UserPlus} className="w-full">
          Convidar pessoa
        </Button>
      </div>
    </div>
  );
}
