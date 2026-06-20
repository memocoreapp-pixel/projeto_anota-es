import { useParams } from "react-router-dom";
import { spaces } from "@/data/spaces";
import { Card } from "@/components/ui/Card";

interface SpacePlaceholderProps {
  /** Id do espaço (quando a rota é fixa, sem parâmetro). */
  spaceId?: string;
}

/**
 * Placeholder simples para os espaços ainda não implementados.
 * Mantém a identidade visual e indica que a área existe.
 */
export function SpacePlaceholder({ spaceId }: SpacePlaceholderProps) {
  const params = useParams();
  const id = spaceId ?? params.spaceId;
  const space = spaces.find((item) => item.id === id);

  const title = space?.title ?? "Espaço";
  const description =
    space?.description ?? "Esta área estará disponível em breve.";
  const Icon = space?.icon;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        {Icon && (
          <span
            className="flex h-11 w-11 items-center justify-center rounded-xl"
            style={{
              backgroundColor: `${space?.accent ?? "#7c3aed"}14`,
              color: space?.accent ?? "#7c3aed",
            }}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
        )}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
      </div>

      <Card className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
        <p className="text-sm font-medium text-slate-700">
          Esta área está em construção
        </p>
        <p className="max-w-sm text-sm text-slate-500">
          Em breve você poderá organizar e visualizar seus conteúdos de{" "}
          {title.toLowerCase()} aqui.
        </p>
      </Card>
    </div>
  );
}
