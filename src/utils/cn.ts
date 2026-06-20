/**
 * Une classes condicionais em uma única string, ignorando valores falsy.
 * Mantém o uso de Tailwind simples, sem dependências extras.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Retorna as iniciais de um nome (até 2 letras). */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
