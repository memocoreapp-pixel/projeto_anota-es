import { useNavigate } from "react-router-dom";
import type { Space } from "@/types";
import { getCoverTheme } from "@/data/coverThemes";
import { SpaceCover } from "./SpaceCover";

interface SpaceCoverCardProps {
  space: Space;
}

/**
 * Item da vitrine "Seus espaços": capa + descrição curta abaixo, com um ponto
 * discreto na cor do tema. O card inteiro é clicável e acessível por teclado.
 */
export function SpaceCoverCard({ space }: SpaceCoverCardProps) {
  const navigate = useNavigate();
  const theme = getCoverTheme(space.colorTheme);

  return (
    <button
      type="button"
      onClick={() => navigate(space.route)}
      aria-label={space.fullTitle}
      className="group flex h-full flex-col rounded-xl text-left focus-visible:outline-none"
    >
      <SpaceCover
        space={space}
        className="shadow-card group-hover:-translate-y-0.5 group-hover:shadow-soft motion-safe:transition-transform"
      />

      <div className="mt-3 flex items-start justify-between gap-2">
        <p className="line-clamp-2 text-sm leading-relaxed text-slate-500">
          {space.description}
        </p>
        <span
          className="mt-1 h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: theme.base }}
          aria-hidden="true"
        />
      </div>
    </button>
  );
}
