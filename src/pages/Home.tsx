import { spaces } from "@/data/spaces";
import { recentNotes } from "@/data/notes";
import { ContinueCard } from "@/components/cards/ContinueCard";
import { SpaceCard } from "@/components/cards/SpaceCard";
import { RecentNoteItem } from "@/components/cards/RecentNoteItem";
import { Card } from "@/components/ui/Card";

/** Página Início: ponto de partida para retomar e organizar o trabalho. */
export function Home() {
  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Continue de onde parou */}
      <section>
        <ContinueCard />
      </section>

      {/* Seus espaços */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Seus espaços</h2>
          <p className="mt-1 text-sm text-slate-500">
            Organize ideias, projetos e referências do seu jeito.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {spaces.map((space) => (
            <SpaceCard key={space.id} space={space} />
          ))}
        </div>
      </section>

      {/* Notas recentes */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Notas recentes</h2>
          <p className="mt-1 text-sm text-slate-500">
            O que você abriu ou editou por último.
          </p>
        </div>

        <Card className="p-2">
          <div className="divide-y divide-slate-100">
            {recentNotes.map((note) => (
              <RecentNoteItem key={note.id} note={note} />
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
