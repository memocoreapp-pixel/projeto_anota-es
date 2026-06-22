import { cn } from "@/utils/cn";

export interface FilterOption {
  value: string;
  label: string;
}

interface SpaceFiltersProps {
  options: FilterOption[];
  active: string;
  onChange: (value: string) => void;
}

/** Filtros simples em "chips". Visual limpo e discreto. */
export function SpaceFilters({ options, active, onChange }: SpaceFiltersProps) {
  return (
    <div className="mb-5 flex flex-wrap gap-2">
      {options.map((opt) => {
        const isActive = opt.value === active;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              isActive
                ? "border-brand-200 bg-brand-50 text-brand-700"
                : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
