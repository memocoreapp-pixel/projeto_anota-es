import type { ReactNode } from "react";
import type { Space } from "@/types";

interface CoverPreviewGridProps {
  spaces: Space[];
  className?: string;
  renderCover: (space: Space) => ReactNode;
}

/** Grade simples para exibir uma coleção de capas no laboratório. */
export function CoverPreviewGrid({
  spaces,
  className = "grid grid-cols-2 gap-6 sm:grid-cols-3",
  renderCover,
}: CoverPreviewGridProps) {
  return (
    <div className={className}>
      {spaces.map((space) => (
        <div key={space.id}>{renderCover(space)}</div>
      ))}
    </div>
  );
}
