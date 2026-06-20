import { NavLink } from "react-router-dom";
import { Home, NotebookPen } from "lucide-react";
import { spaces } from "@/data/spaces";
import { currentUser } from "@/data/user";
import { SearchInput } from "@/components/ui/SearchInput";
import { Avatar } from "@/components/collaborators/Avatar";
import { cn } from "@/utils/cn";

export function Sidebar() {
  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-slate-200 bg-white">
      {/* Topo: marca */}
      <div className="px-5 pb-4 pt-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
            <NotebookPen className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-900">Note Pulse</p>
            <p className="text-xs text-slate-500">Suas ideias, organizadas.</p>
          </div>
        </div>

        <div className="mt-4">
          <SearchInput placeholder="Buscar no Note Pulse" />
        </div>
      </div>

      {/* Navegação principal */}
      <nav className="flex-1 overflow-y-auto px-3">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-brand-50 text-brand-700"
                : "text-slate-600 hover:bg-slate-50"
            )
          }
        >
          <Home className="h-4 w-4" aria-hidden="true" />
          Início
        </NavLink>

        {/* Grupo: ESPAÇOS */}
        <p className="px-3 pb-1 pt-5 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Espaços
        </p>
        <div className="space-y-0.5">
          {spaces.map((space) => {
            const Icon = space.icon;
            return (
              <NavLink
                key={space.id}
                to={space.route}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-brand-50 text-brand-700"
                      : "text-slate-600 hover:bg-slate-50"
                  )
                }
              >
                <span className="w-6 text-xs font-medium text-slate-400">
                  {space.code}
                </span>
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span className="flex-1">{space.title}</span>
                <span className="text-xs text-slate-400">{space.itemCount}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Rodapé: usuário mockado */}
      <div className="border-t border-slate-100 p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-slate-50">
          <Avatar name={currentUser.name} color={currentUser.color} size="md" />
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-medium text-slate-800">
              {currentUser.name}
            </p>
            <p className="truncate text-xs text-slate-500">{currentUser.plan}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
