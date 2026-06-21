import type { Space } from "@/types";
import { getCoverTheme } from "@/data/coverThemes";
import { coverMotifs } from "./covers/CoverMotifs";
import { cn } from "@/utils/cn";

interface SpaceCoverProps {
  space: Space;
  className?: string;
}

/**
 * Capa de um espaço. A cor vem sempre de um token de tema (colorTheme),
 * nunca hardcodada — permitindo troca futura (branco, roxo, goiaba, etc.).
 * O motivo SVG ocupa a área superior; o rótulo (título + contagem) fica na base.
 */
export function SpaceCover({ space, className }: SpaceCoverProps) {
  const theme = getCoverTheme(space.colorTheme);
  const Motif = coverMotifs[space.coverStyle];

  return (
    <div
      className={cn(
        "relative flex aspect-[3/4] flex-col overflow-hidden rounded-xl ring-1 ring-inset ring-black/5 transition-shadow",
        className
      )}
      style={{ backgroundColor: theme.base }}
    >
      {/* Motivo (área superior) */}
      <div className="relative flex-1">
        <div className="absolute inset-0 flex items-center justify-center p-3">
          <Motif theme={theme} />
        </div>
      </div>

      {/* Rótulo (base) */}
      <div className="relative px-3 pb-3 pt-1">
        <p
          className="truncate text-sm font-semibold"
          style={{ color: theme.onCover }}
        >
          {space.title}
        </p>
        <p className="text-xs" style={{ color: theme.onCover, opacity: 0.75 }}>
          {space.itemCount} {space.countLabel}
        </p>
      </div>
    </div>
  );
}
