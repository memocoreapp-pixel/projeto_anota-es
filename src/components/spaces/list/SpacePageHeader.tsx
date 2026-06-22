import { Link } from "react-router-dom";
import type { Space } from "@/types";

interface SpacePageHeaderProps {
  space: Space;
  count: number;
}

/** Cabeçalho da página interna de um espaço: trilha, ícone, título e contagem. */
export function SpacePageHeader({ space, count }: SpacePageHeaderProps) {
  const Icon = space.icon;

  return (
    <div className="mb-6">
      <nav className="text-xs text-slate-400">
        <Link to="/" className="hover:text-slate-600">
          Início
        </Link>
        <span> / {space.title}</span>
      </nav>

      <div className="mt-2 flex items-start gap-3">
        <span
          className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${space.accent}1f`, color: space.accent }}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            {space.fullTitle}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{space.description}</p>
        </div>
      </div>

      <p className="mt-3 text-xs font-medium text-slate-400">
        {count} {space.countLabel}
      </p>
    </div>
  );
}
