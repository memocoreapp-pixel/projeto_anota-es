import type { Space } from "@/types";
import { getCoverTheme } from "@/data/coverThemes";
import { coverFaces } from "./covers/CoverFaces";
import { cn } from "@/utils/cn";

interface SpaceCoverProps {
  space: Space;
  className?: string;
}

/**
 * Capa de um espaço, montada como um objeto visual em camadas (lombada,
 * profundidade, textura, etiqueta e símbolo) pela "face" do tipo. A cor base
 * vem sempre de um token de tema (colorTheme), nunca hardcodada. Um esmaecido
 * na base integra o rótulo (título + contagem) à capa.
 */
export function SpaceCover({ space, className }: SpaceCoverProps) {
  const theme = getCoverTheme(space.colorTheme);
  const Face = coverFaces[space.coverStyle];

  return (
    <div
      className={cn(
        "relative aspect-[3/4] overflow-hidden rounded-xl shadow-card ring-1 ring-inset ring-black/10 transition-shadow",
        className
      )}
      style={{ backgroundColor: theme.base }}
    >
      {/* Objeto da capa (camadas específicas do tipo) */}
      <Face theme={theme} />

      {/* Esmaecido na base para legibilidade do rótulo */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%]"
        style={{
          background: `linear-gradient(to top, ${theme.base} 34%, transparent)`,
        }}
      />

      {/* Rótulo integrado na base da capa */}
      <div className="absolute inset-x-0 bottom-0 px-3 pb-3">
        <p className="truncate text-sm font-semibold" style={{ color: theme.onCover }}>
          {space.title}
        </p>
        <p className="text-xs" style={{ color: theme.onCover, opacity: 0.75 }}>
          {space.itemCount} {space.countLabel}
        </p>
      </div>
    </div>
  );
}
