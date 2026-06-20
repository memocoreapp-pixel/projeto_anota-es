import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { Space } from "@/types";
import { Card } from "@/components/ui/Card";

interface SpaceCardProps {
  space: Space;
}

/** Card de um espaço na grade "Seus espaços". */
export function SpaceCard({ space }: SpaceCardProps) {
  const navigate = useNavigate();
  const Icon = space.icon;

  return (
    <Card
      interactive
      role="button"
      tabIndex={0}
      onClick={() => navigate(space.route)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          navigate(space.route);
        }
      }}
      className="group cursor-pointer p-5"
    >
      <div className="flex items-start justify-between">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${space.accent}14`, color: space.accent }}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <ArrowUpRight className="h-4 w-4 text-slate-300 transition-colors group-hover:text-brand-500" />
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-xs font-medium text-slate-400">{space.code}</span>
        <h3 className="text-base font-semibold text-slate-900">{space.title}</h3>
      </div>

      <p className="mt-1 text-sm leading-relaxed text-slate-500">
        {space.description}
      </p>

      <p className="mt-4 text-xs font-medium text-slate-400">
        {space.itemCount} itens
      </p>
    </Card>
  );
}
