import type { LucideIcon } from "lucide-react";

/** Identificadores dos 6 espaços principais. */
export type SpaceId =
  | "portfolios"
  | "projetos"
  | "cadernos"
  | "anotacoes"
  | "rascunhos"
  | "cards";

/** Tipo conceitual de um espaço (alinhado ao tipo dos elementos). */
export type SpaceType =
  | "portfolio"
  | "project"
  | "notebook"
  | "note"
  | "draft"
  | "card";

/** Estilo visual da capa. "cards-deck" é o único formato horizontal. */
export type CoverStyle =
  | "portfolio"
  | "project"
  | "notebook"
  | "note"
  | "draft"
  | "cards-deck";

/**
 * Identificador de tema de cor da capa. A capa nunca depende de uma cor fixa:
 * ela lê um token de tema, permitindo troca futura (inclusive branco).
 */
export type ColorThemeId =
  | "white"
  | "purple"
  | "guava"
  | "green"
  | "blue"
  | "beige"
  | "gray";

/** Rótulo da contagem exibida no rodapé da capa. */
export type CountLabel = "itens" | "cards";

/**
 * Token de tema visual da capa. Mantém o desenho (motivo) desacoplado da cor,
 * de modo que trocar de tema reaproveita o mesmo motivo com outra paleta.
 */
export interface CoverTheme {
  id: ColorThemeId;
  label: string;
  /** Cor base da capa (fundo principal). */
  base: string;
  /** Variação suave da base (fundos claros, realces). */
  baseSoft: string;
  /** Cor de texto sobre fundos claros (uso geral). */
  ink: string;
  /** Cor de texto/ícone legível sobre a própria capa colorida. */
  onCover: string;
  /** Cor das linhas/formas do motivo desenhado na capa. */
  motif: string;
}

/**
 * Um "espaço" é uma área de organização (Portfólios, Projetos, etc.).
 * Campos legados (code, title, accent) são preservados para compatibilidade
 * com a Home atual; os novos campos preparam a vitrine de capas.
 */
export interface Space {
  id: SpaceId;
  type: SpaceType;
  /** Nome curto exibido na UI (ex.: "Portfólios"). */
  title: string;
  /** Hierarquia interna preservada (ex.: "Meus Portfólios"). */
  fullTitle: string;
  description: string;
  itemCount: number;
  /** Rótulo da contagem ("itens" ou "cards"). */
  countLabel: CountLabel;
  /** Estilo visual da capa. */
  coverStyle: CoverStyle;
  /** Tema de cor da capa (token, não cor fixa). */
  colorTheme: ColorThemeId;
  icon: LucideIcon;
  route: string;
  /** Legado: código curto ("00".."05"). Não usado nas novas capas. */
  code: string;
  /** Legado: cor de apoio do card atual. */
  accent: string;
}
