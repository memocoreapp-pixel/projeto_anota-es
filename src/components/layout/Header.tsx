import { Plus, Sparkles, CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";

/**
 * Header superior da área principal: saudação, subtexto, busca global e ações.
 */
export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="flex flex-col gap-4 px-8 py-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Boa noite</h1>
          <p className="mt-1 text-sm text-slate-500">
            Continue de onde parou e organize suas ideias com calma.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput
            placeholder="Buscar em tudo"
            containerClassName="sm:w-56"
          />
          <div className="flex items-center gap-2">
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
