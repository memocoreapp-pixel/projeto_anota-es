import { getInitials, cn } from "@/utils/cn";

interface AvatarProps {
  name: string;
  color: string;
  size?: "sm" | "md";
  className?: string;
}

const sizeStyles = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
};

/** Avatar circular com iniciais e cor de fundo. */
export function Avatar({ name, color, size = "sm", className }: AvatarProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold text-white ring-2 ring-white",
        sizeStyles[size],
        className
      )}
      style={{ backgroundColor: color }}
      title={name}
      aria-label={name}
    >
      {getInitials(name)}
    </span>
  );
}
