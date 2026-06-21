import type { Space, ColorThemeId, CoverTheme } from "@/types";
import { getCoverTheme, coverThemes } from "@/data/coverThemes";
import { coverFacesB } from "./FacesB";
import { cn } from "@/utils/cn";

interface LabCoverBProps {
  space: Space;
  themeId?: ColorThemeId;
  className?: string;
}

/**
 * "Experimental B — refinada". Componente novo do CoverLab, em paralelo ao
 * LabCover (A). Usa as faces refinadas (FacesB) e um shell com leve realce.
 */
export function LabCoverB({ space, themeId, className }: LabCoverBProps) {
  const theme: CoverTheme = themeId ? coverThemes[themeId] : getCoverTheme(space.colorTheme);
  const Face = coverFacesB[space.coverStyle];

  return (
    <div
      className={cn(
        "relative aspect-[5/7] overflow-hidden rounded-2xl shadow-soft ring-1 ring-inset ring-black/10",
        className
      )}
      style={{ backgroundColor: theme.base }}
    >
      <Face theme={theme} />

      {/* Realce superior sutil (acabamento) */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[14%]"
        style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.12), transparent)" }}
      />

      {/* Borda de páginas à direita */}
      <div
        className="pointer-events-none absolute inset-y-[7%] right-[3px] w-[3px] rounded-full"
        style={{ background: "rgba(255,255,255,0.18)" }}
      />

      {/* Esmaecido na base para o rótulo */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[36%]"
        style={{ background: `linear-gradient(to top, ${theme.base} 34%, transparent)` }}
      />

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
