import type { LucideIcon } from "lucide-react";
import type { ColorThemeId, CoverStyle } from "./spaces";

/** Tipos possíveis de um elemento dentro dos espaços. */
export type ElementType =
  | "portfolio"
  | "project"
  | "notebook"
  | "note"
  | "draft"
  | "card";

/** Estado de trabalho do elemento (mockado). */
export type ElementStatus =
  | "finalizado"
  | "em_andamento"
  | "planejado"
  | "ativo"
  | "rascunho"
  | "arquivado";

/** Nível de maturidade inferido (dado inteligente, invisível na vitrine). */
export type MaturityLevel = "inicial" | "em_desenvolvimento" | "consolidado";

/**
 * Um elemento é qualquer unidade conectável do produto (portfólio, projeto,
 * caderno, anotação, rascunho ou card). Reúne dados visíveis e dados
 * "inteligentes" usados para sugerir conexões e retomada de contexto.
 */
export interface Element {
  // ----- Dados visíveis -----
  id: string;
  type: ElementType;
  title: string;
  description: string;
  status: ElementStatus;
  /** Tema de cor do elemento (token), reutiliza a mesma lógica das capas. */
  color: ColorThemeId;
  coverStyle: CoverStyle;
  icon: LucideIcon;
  itemCount: number;
  /** Texto amigável de última atualização (ex.: "Há 2 horas"). */
  updatedAt: string;
  tags: string[];
  /** Ids de elementos relacionados (atalho de leitura; a verdade está em Connection). */
  relatedIds: string[];
  /** Ids de colaboradores (referenciam data/collaborators). */
  collaborators: string[];

  // ----- Dados inteligentes / invisíveis -----
  inferredTopics?: string[];
  suggestedConnections?: string[];
  connectionScore?: number;
  /** Elemento de origem (ex.: rascunho derivado de um projeto). */
  sourceElement?: string;
  maturityLevel?: MaturityLevel;
  lastOpenedAt?: string;
  continuationHint?: string;
  nextSuggestedAction?: string;
}
