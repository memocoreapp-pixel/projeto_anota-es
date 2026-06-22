import type { ElementStatus } from "@/types";

const STATUS: Record<ElementStatus, { label: string; cls: string }> = {
  finalizado: { label: "Finalizado", cls: "bg-emerald-50 text-emerald-700" },
  em_andamento: { label: "Em andamento", cls: "bg-blue-50 text-blue-700" },
  planejado: { label: "Planejado", cls: "bg-amber-50 text-amber-700" },
  ativo: { label: "Ativo", cls: "bg-brand-50 text-brand-700" },
  rascunho: { label: "Rascunho", cls: "bg-slate-100 text-slate-600" },
  arquivado: { label: "Arquivado", cls: "bg-slate-100 text-slate-500" },
};

interface ItemStatusBadgeProps {
  status: ElementStatus;
}

/** Selo de status reutilizável de um item. */
export function ItemStatusBadge({ status }: ItemStatusBadgeProps) {
  const s = STATUS[status] ?? STATUS.ativo;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${s.cls}`}
    >
      {s.label}
    </span>
  );
}
