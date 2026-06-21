import {
  Briefcase,
  FolderKanban,
  BookOpen,
  StickyNote,
  PencilLine,
  LayoutGrid,
} from "lucide-react";
import type { Space } from "@/types";

/**
 * Os 6 espaços principais exibidos na sidebar e na vitrine da Home.
 * Campos legados (code, title, accent) preservados para a Home atual;
 * campos novos (type, fullTitle, countLabel, coverStyle, colorTheme)
 * preparam a vitrine de capas e a troca futura de cor.
 */
export const spaces: Space[] = [
  {
    id: "portfolios",
    type: "portfolio",
    title: "Portfólios",
    fullTitle: "Meus Portfólios",
    description: "Trabalhos finalizados, apresentações e entregas.",
    itemCount: 8,
    countLabel: "itens",
    coverStyle: "portfolio",
    colorTheme: "purple",
    icon: Briefcase,
    route: "/portfolios",
    code: "00",
    accent: "#7c3aed",
  },
  {
    id: "projetos",
    type: "project",
    title: "Projetos",
    fullTitle: "Meus Projetos",
    description: "Ideias estruturadas, objetivos ativos e trabalhos em andamento.",
    itemCount: 12,
    countLabel: "itens",
    coverStyle: "project",
    colorTheme: "blue",
    icon: FolderKanban,
    route: "/projetos",
    code: "01",
    accent: "#2563eb",
  },
  {
    id: "cadernos",
    type: "notebook",
    title: "Cadernos",
    fullTitle: "Meus Cadernos",
    description: "Conhecimento organizado por temas e áreas de estudo.",
    itemCount: 6,
    countLabel: "itens",
    coverStyle: "notebook",
    colorTheme: "green",
    icon: BookOpen,
    route: "/cadernos",
    code: "02",
    accent: "#0d9488",
  },
  {
    id: "anotacoes",
    type: "note",
    title: "Anotações",
    fullTitle: "Minhas Anotações",
    description: "Registros, ideias, observações e conteúdos escritos.",
    itemCount: 24,
    countLabel: "itens",
    coverStyle: "note",
    colorTheme: "beige",
    icon: StickyNote,
    route: "/anotacoes",
    code: "03",
    accent: "#d97706",
  },
  {
    id: "rascunhos",
    type: "draft",
    title: "Rascunhos",
    fullTitle: "Meus Rascunhos",
    description: "Conteúdos incompletos, temporários ou em construção.",
    itemCount: 5,
    countLabel: "itens",
    coverStyle: "draft",
    colorTheme: "gray",
    icon: PencilLine,
    route: "/rascunhos",
    code: "04",
    accent: "#db2777",
  },
  {
    id: "cards",
    type: "card",
    title: "Cards",
    fullTitle: "Meus Cards",
    description: "Blocos curtos, resumos, insights e unidades rápidas de informação.",
    itemCount: 17,
    countLabel: "cards",
    coverStyle: "cards-deck",
    colorTheme: "purple",
    icon: LayoutGrid,
    route: "/cards",
    code: "05",
    accent: "#4f46e5",
  },
];

/** Retorna um espaço pelo seu id. */
export function getSpaceById(id: string): Space | undefined {
  return spaces.find((space) => space.id === id);
}
