import type { Space, ColorThemeId } from "@/types";
import { coverThemes } from "@/data/coverThemes";
import { LabCover } from "./LabCover";
import { LabCoverB } from "./LabCoverB";
import { LabCoverC } from "./LabCoverC";

/** Ordem de exibição das variações de cor. */
const themeOrder: ColorThemeId[] = [
  "purple",
  "white",
  "green",
  "blue",
  "beige",
  "gray",
  "guava",
];

interface CoverThemePreviewProps {
  space: Space;
  /** Qual versão experimental usar. Padrão: C. */
  variant?: "A" | "B" | "C";
}

/** Mostra uma capa (experimental) em todas as variações de tema de cor. */
export function CoverThemePreview({ space, variant = "C" }: CoverThemePreviewProps) {
  return (
    <div>
      <p className="mb-3 text-sm font-medium text-slate-700">
        {space.title} — variações de cor (Experimental {variant})
      </p>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {themeOrder.map((id) => (
          <div key={id}>
            {variant === "A" && <LabCover space={space} themeId={id} />}
            {variant === "B" && <LabCoverB space={space} themeId={id} />}
            {variant === "C" && <LabCoverC space={space} themeId={id} />}
            <p className="mt-1 text-center text-xs text-slate-500">
              {coverThemes[id].label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
