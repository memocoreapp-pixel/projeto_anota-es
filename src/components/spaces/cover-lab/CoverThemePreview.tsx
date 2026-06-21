import type { Space, ColorThemeId } from "@/types";
import { coverThemes } from "@/data/coverThemes";
import { LabCover } from "./LabCover";

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
}

/** Mostra uma capa (experimental) em todas as variações de tema de cor. */
export function CoverThemePreview({ space }: CoverThemePreviewProps) {
  return (
    <div>
      <p className="mb-3 text-sm font-medium text-slate-700">
        {space.title} — variações de cor
      </p>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {themeOrder.map((id) => (
          <div key={id}>
            <LabCover space={space} themeId={id} />
            <p className="mt-1 text-center text-xs text-slate-500">
              {coverThemes[id].label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
