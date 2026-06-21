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
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden p-5"
    >
      {/* Fundo levemente colorido por categoria, bem discreto */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24"
        style={{
          background: `linear-gradient(to bottom, ${space.accent}0f, transparent)`,
        }}
      />

      <div className="relative flex items-start justify-between">
        <span
          className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{
            backgroundColor: `${space.accent}1f`,
            color: space.accent,
            boxShadow: `inset 0 0 0 1px ${space.accent}29`,
          }}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="text-xs font-semibold tracking-wide text-slate-300 transition-colors group-hover:text-brand-400">
          {space.code}
        </span>
      </div>

      <h3 className="relative mt-4 text-base font-semibold text-slate-900">
        {space.title}
      </h3>

      <p className="relative mt-1 line-clamp-2 text-sm leading-relaxed text-slate-500">
        {space.description}
      </p>

      <div className="relative mt-auto flex items-center justify-between pt-4">
        <span
          className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
          style={{ backgroundColor: `${space.accent}14`, color: space.accent }}
        >
          {space.itemCount} itens
        </span>
        <ArrowUpRight
          className="h-4 w-4 text-slate-300 transition-colors group-hover:text-brand-500"
          aria-hidden="true"
        />
      </div>
    </Card>
  );
}
