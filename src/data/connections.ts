import type { Connection } from "@/types";

/**
 * Conexões mockadas entre elementos.
 * Contém a trilha completa de exemplo (uma aresta por nível):
 * Portfólio A -> Projeto X -> Caderno Y -> Anotação Z -> Rascunho 1 -> Card 1,
 * além de algumas conexões sugeridas para enriquecer as colunas de relacionados.
 */
export const connections: Connection[] = [
  // ----- Trilha principal -----
  {
    sourceId: "portfolio-a",
    targetId: "project-x",
    relationType: "contains",
    score: 0.92,
    createdBy: "system",
    reason: "O portfólio reúne entregas deste projeto.",
  },
  {
    sourceId: "project-x",
    targetId: "notebook-y",
    relationType: "references",
    score: 0.84,
    createdBy: "system",
    reason: "O projeto se apoia nas pesquisas deste caderno.",
  },
  {
    sourceId: "notebook-y",
    targetId: "note-z",
    relationType: "contains",
    score: 0.8,
    createdBy: "user",
    reason: "A anotação faz parte deste caderno.",
  },
  {
    sourceId: "note-z",
    targetId: "draft-1",
    relationType: "references",
    score: 0.74,
    createdBy: "system",
    reason: "A anotação originou este rascunho.",
  },
  {
    sourceId: "draft-1",
    targetId: "card-1",
    relationType: "supports",
    score: 0.78,
    createdBy: "system",
    reason: "O rascunho deu origem a este card de ideia.",
  },

  // ----- Conexões sugeridas / complementares -----
  {
    sourceId: "portfolio-a",
    targetId: "notebook-y",
    relationType: "references",
    score: 0.6,
    createdBy: "system",
    reason: "Mesmo tema e uso recorrente nas últimas anotações.",
  },
  {
    sourceId: "project-x",
    targetId: "draft-1",
    relationType: "contains",
    score: 0.82,
    createdBy: "user",
    reason: "O rascunho foi criado dentro deste projeto.",
  },
  {
    sourceId: "project-x",
    targetId: "card-2",
    relationType: "suggested",
    score: 0.55,
    createdBy: "system",
    reason: "Resumo de pesquisa relacionado ao tema do projeto.",
  },
  {
    sourceId: "notebook-y",
    targetId: "card-1",
    relationType: "supports",
    score: 0.66,
    createdBy: "system",
    reason: "O card sintetiza um achado deste caderno.",
  },
  {
    sourceId: "note-z",
    targetId: "card-1",
    relationType: "derived_from",
    score: 0.69,
    createdBy: "system",
    reason: "O card foi derivado desta anotação.",
  },
];

/** Conexões que partem de um elemento (arestas de saída). */
export function getConnectionsFrom(sourceId: string): Connection[] {
  return connections.filter((connection) => connection.sourceId === sourceId);
}

/** Conexões que chegam a um elemento (arestas de entrada). */
export function getConnectionsTo(targetId: string): Connection[] {
  return connections.filter((connection) => connection.targetId === targetId);
}

/**
 * Ids de elementos relacionados a um elemento (saída), ordenados por score
 * decrescente. Usado pela navegação em cascata para montar a próxima coluna.
 */
export function getRelatedElementIds(sourceId: string): string[] {
  return getConnectionsFrom(sourceId)
    .slice()
    .sort((a, b) => b.score - a.score)
    .map((connection) => connection.targetId);
}
