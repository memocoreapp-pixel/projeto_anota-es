import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Adiciona realce de hover quando o card é clicável. */
  interactive?: boolean;
}

export function Card({ children, interactive, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white shadow-card",
        interactive && "transition-shadow transition-colors hover:border-brand-200 hover:shadow-soft",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
