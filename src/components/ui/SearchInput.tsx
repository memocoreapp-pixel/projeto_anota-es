import type { InputHTMLAttributes } from "react";
import { Search } from "lucide-react";
import { cn } from "@/utils/cn";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

export function SearchInput({
  placeholder = "Buscar...",
  className,
  containerClassName,
  ...props
}: SearchInputProps) {
  return (
    <div className={cn("relative", containerClassName)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        aria-hidden="true"
      />
      <input
        type="search"
        placeholder={placeholder}
        className={cn(
          "h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 transition-colors hover:border-slate-300 focus:border-brand-400",
          className
        )}
        {...props}
      />
    </div>
  );
}
