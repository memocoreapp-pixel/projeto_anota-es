import { useParams } from "react-router-dom";
import { getSpaceById } from "@/data/spaces";
import { elements } from "@/data/elements";
import { SpacePageHeader } from "@/components/spaces/list/SpacePageHeader";
import { SpaceItemCard } from "@/components/spaces/list/SpaceItemCard";
import { EmptyState } from "@/components/spaces/list/EmptyState";

/**
 * Página de listagem de um espaço (somente leitura).
 * Lê o :spaceId da rota, encontra o espaço e lista os itens mockados do tipo
 * correspondente (de data/elements.ts). Sem criação/edição/detalhe ainda.
 */
export function SpaceListPage() {
  const { spaceId } = useParams();
  const space = getSpaceById(spaceId ?? "");

  if (!space) {
    return (
      <EmptyState
        title="Espaço não encontrado"
        message="Volte ao Início e escolha um dos espaços."
      />
    );
  }

  const items = elements.filter((item) => item.type === space.type);

  return (
    <div>
      <SpacePageHeader space={space} count={items.length} />

      {items.length === 0 ? (
        <EmptyState
          title={`Nenhum item em ${space.title}`}
          message="Em breve você poderá criar o primeiro item aqui."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <SpaceItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
