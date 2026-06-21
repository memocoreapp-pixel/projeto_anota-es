/** Natureza da relação entre dois elementos. */
export type RelationType =
  | "contains"
  | "references"
  | "suggested"
  | "derived_from"
  | "supports";

/** Origem da conexão: criada pelo sistema (inferida) ou pelo usuário. */
export type ConnectionCreatedBy = "system" | "user";

/**
 * Aresta direcionada entre dois elementos. O "score" indica força/confiança
 * da relação e "reason" explica, em linguagem simples, por que ela existe.
 */
export interface Connection {
  sourceId: string;
  targetId: string;
  relationType: RelationType;
  /** Força/confiança da conexão (0 a 1). */
  score: number;
  createdBy: ConnectionCreatedBy;
  reason: string;
}
