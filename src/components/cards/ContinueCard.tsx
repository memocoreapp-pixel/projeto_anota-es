import { Clock, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CollaboratorAvatars } from "@/components/collaborators/CollaboratorAvatars";
import { collaborators } from "@/data/collaborators";

/** Card de destaque "Continue de onde parou" na página Início. */
export function ContinueCard() {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Badge tone="brand">Projeto</Badge>
            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              Última edição há 3 horas
            </span>
          </div>

          <h2 className="mt-3 text-lg font-semibold text-slate-900">
            Redesign da experiência do usuário
          </h2>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-500">
            Reúne as decisões de fluxo, referências visuais e próximos passos do
            redesign. Retome do ponto em que você parou.
          </p>

          <div className="mt-4">
            <Button icon={ArrowRight}>Continuar</Button>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:flex-col sm:items-end">
          <span className="text-xs text-slate-400">Colaboradores</span>
          <CollaboratorAvatars collaborators={collaborators} />
        </div>
      </div>
    </Card>
  );
}
