// Barrel de tipos do app.
export * from "./spaces";
export * from "./elements";
export * from "./connections";

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
