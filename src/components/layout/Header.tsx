import { Plus, Sparkles, CloudUpload, Menu } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";

interface HeaderProps {
  /** Abre o drawer da sidebar no mobile. */
  onOpenSidebar: () => void;
}

/**
 * Header superior da área principal: botão de menu (mobile), saudação,
 * subtexto, busca global e ações.
 */
export function Header({ onOpenSidebar }: HeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="flex flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-6">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="-ml-1 mt-0.5 rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
              Boa noite
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Continue de onde parou e organize suas ideias com calma.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput placeholder="Buscar em tudo" containerClassName="sm:w-56" />
          <div className="flex flex-wrap items-center gap-2">
            <Button icon={Plus}>Nova nota</Button>
            <Button variant="secondary" icon={Sparkles}>
              Insights
            </Button>
            <Button variant="secondary" icon={CloudUpload}>
              Backup
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
