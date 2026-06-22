import { spaces } from "@/data/spaces";
import { SpaceCover } from "@/components/spaces/SpaceCover";
import { SpaceCoverGrid } from "@/components/spaces/SpaceCoverGrid";
import { LabCoverC } from "./LabCoverC";
import { LabCoverD } from "./LabCoverD";
import { CoverPreviewGrid } from "./CoverPreviewGrid";
import { CoverThemePreview } from "./CoverThemePreview";
import {
  PortfolioCoverFace,
  PortfolioCoverColorGrid,
} from "@/components/spaces/premium-cover/PortfolioCoverFace";

/**
 * Laboratório visual isolado das capas. Não é a tela final e não afeta a Home.
 * Compara Atual × Experimental A × Experimental B (refinada).
 */
export function CoverLabPage() {
  const cadernos = spaces.find((s) => s.id === "cadernos") ?? spaces[0];
  const cards = spaces.find((s) => s.id === "cards") ?? spaces[0];

  return (
    <div className="space-y-12">
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <strong className="font-semibold">Ambiente de laboratório.</strong> Esta
        não é a tela final. Use para avaliar e comparar as capas antes de aplicar
        na Home.
      </div>

      <header>
        <h1 className="text-2xl font-semibold text-slate-900">CoverLab</h1>
        <p className="mt-1 text-sm text-slate-500">
          Família visual das capas, isolada da Home — comparando versões.
        </p>
      </header>

      {/* PortfolioCoverFace — versão oficial em código */}
      <section>
        <h2 className="mb-1 text-lg font-semibold text-slate-900">
          PortfolioCoverFace — versão oficial em código
        </h2>
        <p className="mb-4 text-sm text-slate-500">
          Componente entregue em código; capa principal (roxo) e variações de cor.
        </p>
        <div className="mb-8 flex justify-center sm:justify-start">
          <PortfolioCoverFace theme="purple" />
        </div>
        <PortfolioCoverColorGrid />
      </section>

      {/* Comparação Atual × C × D (Manual) */}
      <section>
        <h2 className="mb-1 text-lg font-semibold text-slate-900">
          Comparação: Atual × C × D (Manual)
        </h2>
        <p className="mb-4 text-sm text-slate-500">
          A versão D segue o Manual Visual de Capas (família coesa de objetos).
        </p>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {spaces.map((space) => (
            <div key={space.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="mb-3 text-sm font-medium text-slate-700">{space.title}</p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="mb-1 text-xs text-slate-400">Atual</p>
                  <SpaceCover space={space} />
                </div>
                <div>
                  <p className="mb-1 text-xs text-slate-400">C</p>
                  <LabCoverC space={space} />
                </div>
                <div>
                  <p className="mb-1 text-xs text-slate-400">D (Manual)</p>
                  <LabCoverD space={space} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* D em tamanho grande */}
      <section>
        <h2 className="mb-1 text-lg font-semibold text-slate-900">
          Experimental D em tamanho grande
        </h2>
        <p className="mb-4 text-sm text-slate-500">
          Avalie a família como uma coleção de capas/objetos.
        </p>
        <CoverPreviewGrid
          spaces={spaces}
          className="grid grid-cols-2 gap-6 sm:grid-cols-3"
          renderCover={(space) => <LabCoverD space={space} />}
        />
      </section>

      {/* Variações de tema (D) */}
      <section>
        <h2 className="mb-1 text-lg font-semibold text-slate-900">
          Variações de tema de cor
        </h2>
        <p className="mb-4 text-sm text-slate-500">
          A mesma capa D em diferentes temas (a cor vem sempre do token).
        </p>
        <div className="space-y-8">
          <CoverThemePreview space={cadernos} variant="D" />
          <CoverThemePreview space={cards} variant="D" />
        </div>
      </section>

      {/* Prévia tamanho Home (capas atuais) */}
      <section>
        <h2 className="mb-1 text-lg font-semibold text-slate-900">
          Prévia em tamanho da Home (capas atuais)
        </h2>
        <p className="mb-4 text-sm text-slate-500">
          Capas atuais no mesmo tamanho usado na vitrine da Home.
        </p>
        <SpaceCoverGrid spaces={spaces} />
      </section>
    </div>
  );
}
