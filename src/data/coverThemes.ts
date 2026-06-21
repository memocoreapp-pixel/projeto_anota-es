import type { ColorThemeId, CoverTheme } from "@/types";

/**
 * Temas de cor das capas. O motivo desenhado é o mesmo; só a paleta muda.
 * Capas claras (white, beige, gray) usam texto/motivo escuros; capas escuras
 * usam texto/motivo claros. Isso garante legibilidade em qualquer tema.
 */
export const coverThemes: Record<ColorThemeId, CoverTheme> = {
  white: {
    id: "white",
    label: "Branco",
    base: "#ffffff",
    baseSoft: "#f8fafc",
    ink: "#334155",
    onCover: "#334155",
    motif: "#cbd5e1",
  },
  purple: {
    id: "purple",
    label: "Roxo",
    base: "#6d28d9",
    baseSoft: "#ede9fe",
    ink: "#4c1d95",
    onCover: "#ffffff",
    motif: "#ffffff",
  },
  guava: {
    id: "guava",
    label: "Rosa goiaba",
    base: "#e84a7f",
    baseSoft: "#fde7ef",
    ink: "#9d174d",
    onCover: "#ffffff",
    motif: "#ffffff",
  },
  green: {
    id: "green",
    label: "Verde",
    base: "#15803d",
    baseSoft: "#dcfce7",
    ink: "#14532d",
    onCover: "#ffffff",
    motif: "#ffffff",
  },
  blue: {
    id: "blue",
    label: "Azul",
    base: "#1e3a8a",
    baseSoft: "#dbeafe",
    ink: "#1e3a8a",
    onCover: "#ffffff",
    motif: "#ffffff",
  },
  beige: {
    id: "beige",
    label: "Bege",
    base: "#e7ddc9",
    baseSoft: "#f5f0e6",
    ink: "#5b4f3a",
    onCover: "#44403c",
    motif: "#a8957a",
  },
  gray: {
    id: "gray",
    label: "Cinza",
    base: "#cbd5e1",
    baseSoft: "#f1f5f9",
    ink: "#334155",
    onCover: "#334155",
    motif: "#94a3b8",
  },
};

/** Retorna o tema de cor pelo id, com fallback para roxo (cor da identidade). */
export function getCoverTheme(id: ColorThemeId): CoverTheme {
  return coverThemes[id] ?? coverThemes.purple;
}
