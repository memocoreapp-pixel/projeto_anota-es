import { Card } from "@/components/ui/Card";

interface EmptyStateProps {
  title?: string;
  message?: string;
}

/** Estado vazio para listagens de espaços. */
export function EmptyState({
  title = "Nada por aqui ainda",
  message = "Os itens deste espaço aparecerão aqui.",
}: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-center justify-center gap-1 px-6 py-16 text-center">
      <p className="text-sm font-medium text-slate-700">{title}</p>
      <p className="max-w-sm text-sm text-slate-500">{message}</p>
    </Card>
  );
}
