import type { Element } from "@/types";
import { Card } from "@/components/ui/Card";
import { ItemStatusBadge } from "./ItemStatusBadge";

interface SpaceItemCardProps {
  item: Element;
}

/** Card de um item dentro da listagem de um espaço (somente leitura). */
export function SpaceItemCard({ item }: SpaceItemCardProps) {
  const Icon = item.icon;

  return (
    <Card interactive className="flex h-full cursor-default flex-col p-4">
      <div className="flex items-start justify-between gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <ItemStatusBadge status={item.status} />
      </div>

      <h3 className="mt-3 text-sm font-semibold text-slate-900">{item.title}</h3>
      <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-500">
        {item.description}
      </p>

      <div className="mt-auto flex items-center justify-between gap-2 pt-3 text-xs text-slate-400">
        <span>{item.updatedAt}</span>
        {item.tags.length > 0 && (
          <span className="truncate">#{item.tags[0]}</span>
        )}
      </div>
    </Card>
  );
}
