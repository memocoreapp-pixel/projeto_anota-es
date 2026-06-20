import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface BadgeProps {
  children: ReactNode;
  tone?: "brand" | "neutral";
  className?: string;
}

export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tone === "brand"
          ? "bg-brand-50 text-brand-700"
          : "bg-slate-100 text-slate-600",
        className
      )}
    >
      {children}
    </span>
  );
}
