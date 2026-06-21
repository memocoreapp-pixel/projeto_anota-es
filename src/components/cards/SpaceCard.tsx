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
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden"
    >
      {/* Capa sutil: gradiente discreto + watermark do ícone da categoria */}
      <div
        className="relative h-20 overflow-hidden border-b border-slate-100"
        style={{
          background: `linear-gradient(135deg, ${space.accent}16 0%, ${space.accent}05 60%, transparent 100%)`,
        }}
      >
        <Icon
          aria-hidden="true"
          strokeWidth={1.25}
          className="pointer-events-none absolute -right-3 -top-4 h-28 w-28"
          style={{ color: space.accent, opacity: 0.1 }}
        />

        <div className="relative flex items-start justify-between p-4">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-white"
            style={{
              color: space.accent,
              boxShadow: `inset 0 0 0 1px ${space.accent}29, 0 1px 2px rgba(16,24,40,0.06)`,
            }}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-xs font-semibold tracking-wide text-slate-300 transition-colors group-hover:text-brand-400">
            {space.code}
          </span>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex flex-1 flex-col p-5 pt-4">
        <h3 className="text-base font-semibold text-slate-900">{space.title}</h3>

        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-500">
          {space.description}
        </p>

        <div className="mt-auto flex items-center justify-between pt-4">
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
      </div>
    </Card>
  );
}
