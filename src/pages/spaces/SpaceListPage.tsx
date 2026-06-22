import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import type { ElementStatus } from "@/types";
import { getSpaceById } from "@/data/spaces";
import { elements } from "@/data/elements";
import { SpacePageHeader } from "@/components/spaces/list/SpacePageHeader";
import { SpaceItemCard } from "@/components/spaces/list/SpaceItemCard";
import { EmptyState } from "@/components/spaces/list/EmptyState";
import { SpaceFilters, type FilterOption } from "@/components/spaces/list/SpaceFilters";

/** Filtros disponíveis e quais status cada um agrupa. */
const FILTERS: { value: string; label: string; statuses: ElementStatus[] }[] = [
  { value: "todos", label: "Todos", statuses: [] },
  { value: "andamento", label: "Em andamento", statuses: ["em_andamento", "ativo"] },
  { value: "planejado", label: "Planejado", statuses: ["planejado"] },
  { value: "finalizado", label: "Finalizado", statuses: ["finalizado"] },
  { value: "rascunho", label: "Rascunho", statuses: ["rascunho"] },
];

/**
 * Página de listagem de um espaço (somente leitura) com filtros por status.
 * Os filtros só aparecem quando há variedade real de status (faz sentido).
 */
export function SpaceListPage() {
  const { spaceId } = useParams();
  const space = getSpaceById(spaceId ?? "");
  const [active, setActive] = useState("todos");

  // Itens do espaço atual (por tipo).
  const items = useMemo(
    () => (space ? elements.filter((item) => item.type === space.type) : []),
    [space]
  );

  // Filtros disponíveis = "Todos" + grupos cujos status existem nos itens.
  const available: FilterOption[] = useMemo(() => {
    const present = new Set(items.map((i) => i.status));
    return FILTERS.filter(
      (f) => f.value === "todos" || f.statuses.some((s) => present.has(s))
    ).map((f) => ({ value: f.value, label: f.label }));
  }, [items]);

  // Só mostra filtros quando há ao menos 2 grupos reais (além de "Todos").
  const showFilters = available.length > 2;

  const filtered = useMemo(() => {
    if (!showFilters || active === "todos") return items;
    const group = FILTERS.find((f) => f.value === active)?.statuses ?? [];
    return items.filter((i) => group.includes(i.status));
  }, [items, active, showFilters]);

  if (!space) {
    return (
      <EmptyState
        title="Espaço não encontrado"
        message="Volte ao Início e escolha um dos espaços."
      />
    );
  }

  return (
    <div>
      <SpacePageHeader space={space} count={items.length} />

      {showFilters && (
        <SpaceFilters options={available} active={active} onChange={setActive} />
      )}

      {filtered.length === 0 ? (
        <EmptyState
          title={`Nenhum item em ${space.title}`}
          message="Tente outro filtro ou, em breve, crie o primeiro item aqui."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <SpaceItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
