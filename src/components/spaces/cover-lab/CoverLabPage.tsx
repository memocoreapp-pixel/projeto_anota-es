import { spaces } from "@/data/spaces";
import { SpaceCover } from "@/components/spaces/SpaceCover";
import { SpaceCoverGrid } from "@/components/spaces/SpaceCoverGrid";
import { LabCover } from "./LabCover";
import { CoverPreviewGrid } from "./CoverPreviewGrid";
import { CoverThemePreview } from "./CoverThemePreview";

/**
 * Laboratório visual isolado das capas. Não é a tela final e não afeta a Home.
 * Permite avaliar proporção, acabamento, hierarquia, paleta, consistência,
 * legibilidade, variações de cor e responsividade antes de aplicar na Home.
 */
export function CoverLabPage() {
  const cadernos = spaces.find((s) => s.id === "cadernos") ?? spaces[0];
  const cards = spaces.find((s) => s.id === "cards") ?? spaces[0];

  return (
    <div className="space-y-12">
      {/* Aviso de laboratório */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <strong className="font-semibold">Ambiente de laboratório.</strong> Esta
        não é a tela final. Use para avaliar e comparar as capas antes de aplicar
        na Home.
      </div>

      <header>
        <h1 className="text-2xl font-semibold text-slate-900">CoverLab</h1>
        <p className="mt-1 text-sm text-slate-500">
          Família visual das capas dos espaços, isolada da Home.
        </p>
      </header>

      {/* 1. Capas grandes (experimental) */}
      <section>
        <h2 className="mb-1 text-lg font-semibold text-slate-900">
          Capas em tamanho grande (experimental)
        </h2>
        <p className="mb-4 text-sm text-slate-500">
          Avalie proporção, acabamento e hierarquia de cada objeto.
        </p>
        <CoverPreviewGrid
          spaces={spaces}
          className="grid grid-cols-2 gap-6 sm:grid-cols-3"
          renderCover={(space) => <LabCover space={space} />}
        />
      </section>

      {/* 4. Comparação atual × experimental */}
      <section>
        <h2 className="mb-1 text-lg font-semibold text-slate-900">
          Comparação: atual × experimental
        </h2>
        <p className="mb-4 text-sm text-slate-500">
          Lado a lado para decidir a direção visual.
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {spaces.map((space) => (
            <div
              key={space.id}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <p className="mb-3 text-sm font-medium text-slate-700">
                {space.title}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="mb-1 text-xs text-slate-400">Atual</p>
                  <SpaceCover space={space} />
                </div>
                <div>
                  <p className="mb-1 text-xs text-slate-400">Experimental</p>
                  <LabCover space={space} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Variações de tema de cor */}
      <section>
        <h2 className="mb-1 text-lg font-semibold text-slate-900">
          Variações de tema de cor
        </h2>
        <p className="mb-4 text-sm text-slate-500">
          A mesma capa em diferentes temas (a cor vem sempre do token).
        </p>
        <div className="space-y-8">
          <CoverThemePreview space={cadernos} />
          <CoverThemePreview space={cards} />
        </div>
      </section>

      {/* 2. Prévia em tamanho da Home (capas atuais) */}
      <section>
        <h2 className="mb-1 text-lg font-semibold text-slate-900">
          Prévia em tamanho da Home
        </h2>
        <p className="mb-4 text-sm text-slate-500">
          Capas atuais no mesmo tamanho usado na vitrine da Home.
        </p>
        <SpaceCoverGrid spaces={spaces} />
      </section>
    </div>
  );
}
