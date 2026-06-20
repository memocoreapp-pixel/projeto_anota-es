import type { LucideIcon } from "lucide-react";

/** Identificadores das áreas de organização do app. */
export type SpaceId =
  | "portfolios"
  | "projetos"
  | "cadernos"
  | "anotacoes"
  | "rascunhos"
  | "cards";

/** Um "espaço" representa uma área de organização (Portfólios, Projetos, etc.). */
export interface Space {
  id: SpaceId;
  /** Código exibido no card, ex.: "00", "01". */
  code: string;
  title: string;
  description: string;
  itemCount: number;
  icon: LucideIcon;
  /** Cor de apoio discreta usada no ícone do card. */
  accent: string;
  route: string;
}

/** Nível de permissão de um colaborador (mockado). */
export type Permission =
  | "Administrador"
  | "Pode editar"
  | "Pode comentar"
  | "Pode visualizar";

/** Estado de atividade de um colaborador (mockado). */
export type CollaboratorActivity =
  | "Editando agora"
  | "Online"
  | "Visualizou recentemente"
  | "Sem atividade recente";

export interface Collaborator {
  id: string;
  name: string;
  permission: Permission;
  activity: CollaboratorActivity;
  /** Cor de fundo do avatar quando não há imagem. */
  color: string;
}

/** Uma nota recente exibida na lista da página Início. */
export interface RecentNote {
  id: string;
  title: string;
  space: string;
  updatedAt: string;
}

/** Usuário mockado exibido no rodapé da sidebar. */
export interface CurrentUser {
  name: string;
  plan: string;
  color: string;
}
