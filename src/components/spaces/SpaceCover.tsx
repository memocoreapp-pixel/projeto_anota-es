import type { Space } from "@/types";
import { getCoverTheme } from "@/data/coverThemes";
import { coverMotifs } from "./covers/CoverMotifs";
import { cn } from "@/utils/cn";

interface SpaceCoverProps {
  space: Space;
  className?: string;
}

/**
 * Capa de um espaço. A composição (objeto: caderno/fichário/página/deck)
 * preenche todo o quadro. A cor vem sempre de um token de tema (colorTheme),
 * nunca hardcodada. Um esmaecido na base funde a composição no fundo para o
 * rótulo (título + contagem) ficar sempre legível.
 */
export function SpaceCover({ space, className }: SpaceCoverProps) {
  const theme = getCoverTheme(space.colorTheme);
  const Motif = coverMotifs[space.coverStyle];

  return (
    <div
      className={cn(
        "relative aspect-[3/4] overflow-hidden rounded-xl ring-1 ring-inset ring-black/5 transition-shadow",
        className
      )}
      style={{ backgroundColor: theme.base }}
    >
      {/* Composição da capa (preenche o quadro) */}
      <div className="absolute inset-0">
        <Motif theme={theme} />
      </div>

      {/* Esmaecido na base para legibilidade do rótulo */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5"
        style={{
          background: `linear-gradient(to top, ${theme.base} 32%, transparent)`,
        }}
      />

      {/* Rótulo integrado na base da capa */}
      <div className="absolute inset-x-0 bottom-0 px-3 pb-3">
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
