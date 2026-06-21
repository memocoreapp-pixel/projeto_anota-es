import { Clock, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CollaboratorAvatars } from "@/components/collaborators/CollaboratorAvatars";
import { collaborators } from "@/data/collaborators";

/** Card de destaque "Continue de onde parou" na página Início. */
export function ContinueCard() {
  return (
    <Card>
      <div className="flex flex-col gap-6 p-6 sm:p-7 lg:flex-row lg:items-stretch lg:gap-8">
        <div className="min-w-0 lg:flex-1">
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

          <div className="mt-5">
            <Button icon={ArrowRight}>Continuar</Button>
          </div>
        </div>

        {/* Painel de colaboradores: separado por divisória em telas grandes */}
        <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-5 lg:w-52 lg:shrink-0 lg:flex-col lg:items-end lg:justify-center lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <span className="text-xs font-medium text-slate-400">Colaboradores</span>
          <CollaboratorAvatars collaborators={collaborators} />
        </div>
      </div>
    </Card>
  );
}
