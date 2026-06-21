import { Clock, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CollaboratorAvatars } from "@/components/collaborators/CollaboratorAvatars";
import { collaborators } from "@/data/collaborators";

/**
 * Card de destaque "Continue de onde parou".
 * Conteúdo no topo e um rodapé que integra colaboradores, metadados e a ação,
 * evitando espaço morto e mantendo a sensação de retomada útil.
 */
export function ContinueCard() {
  return (
    <Card>
      <div className="p-6 sm:p-7">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="brand">Projeto</Badge>
          <span className="inline-flex items-center gap-1 text-xs text-slate-400">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            Última edição há 3 horas
          </span>
        </div>

        <h2 className="mt-3 text-lg font-semibold text-slate-900">
          Redesign da experiência do usuário
        </h2>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">
          Reúne as decisões de fluxo, referências visuais e próximos passos do
          redesign. Retome do ponto em que você parou.
        </p>

        {/* Rodapé: colaboradores + ação, alinhados e sem espaço morto */}
        <div className="mt-5 flex flex-col gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <CollaboratorAvatars collaborators={collaborators} />
            <span className="text-xs text-slate-500">
              {collaborators.length} colaboradores
            </span>
          </div>
          <Button icon={ArrowRight} className="w-full sm:w-auto">
            Continuar
          </Button>
        </div>
      </div>
    </Card>
  );
}
