import type { Space } from "@/types";
import { SpaceCoverCard } from "./SpaceCoverCard";

interface SpaceCoverGridProps {
  spaces: Space[];
}

/**
 * Grade responsiva da vitrine de capas.
 * Mobile: 1 coluna · Tablet: 2 · Notebook: 3 · Desktop grande: 6 em fileira.
 * A legibilidade nunca é sacrificada para manter 6 em linha.
 */
export function SpaceCoverGrid({ spaces }: SpaceCoverGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {spaces.map((space) => (
        <SpaceCoverCard key={space.id} space={space} />
      ))}
    </div>
  );
}
