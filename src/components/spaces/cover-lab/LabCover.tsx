import type { Space, ColorThemeId, CoverTheme } from "@/types";
import { getCoverTheme, coverThemes } from "@/data/coverThemes";
import { coverFaces } from "@/components/spaces/covers/CoverFaces";
import { cn } from "@/utils/cn";

interface LabCoverProps {
  space: Space;
  /** Força um tema de cor (para a grade de variações). */
  themeId?: ColorThemeId;
  className?: string;
}

/**
 * Versão EXPERIMENTAL da capa, usada apenas no CoverLab. Criada em paralelo:
 * não substitui o SpaceCover usado na Home. Difere no acabamento do "objeto"
 * (proporção mais alta, borda de páginas à direita, divisória no rótulo).
 */
export function LabCover({ space, themeId, className }: LabCoverProps) {
  const theme: CoverTheme = themeId ? coverThemes[themeId] : getCoverTheme(space.colorTheme);
  const Face = coverFaces[space.coverStyle];

  return (
    <div
      className={cn(
        "relative aspect-[5/7] overflow-hidden rounded-2xl shadow-soft ring-1 ring-inset ring-black/10",
        className
      )}
      style={{ backgroundColor: theme.base }}
    >
      <Face theme={theme} />

      {/* Borda de "páginas" à direita (espessura do objeto) */}
      <div
        className="pointer-events-none absolute inset-y-[7%] right-[3px] w-[3px] rounded-full"
        style={{ background: "rgba(255,255,255,0.18)" }}
      />

      {/* Esmaecido na base para legibilidade do rótulo */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[36%]"
        style={{ background: `linear-gradient(to top, ${theme.base} 34%, transparent)` }}
      />

      {/* Rótulo */}
      <div className="absolute inset-x-0 bottom-0 p-3">
        <div className="mb-1 h-px w-8" style={{ background: theme.onCover, opacity: 0.4 }} />
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
