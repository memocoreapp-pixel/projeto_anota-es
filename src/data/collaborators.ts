import type { Collaborator } from "@/types";

/** Colaboradores mockados usados nos avatares e no popover. */
export const collaborators: Collaborator[] = [
  {
    id: "ana-silva",
    name: "Ana Silva",
    permission: "Administrador",
    activity: "Editando agora",
    color: "#7c3aed",
  },
  {
    id: "carlos-lima",
    name: "Carlos Lima",
    permission: "Pode editar",
    activity: "Online",
    color: "#2563eb",
  },
  {
    id: "marina-costa",
    name: "Marina Costa",
    permission: "Pode comentar",
    activity: "Visualizou recentemente",
    color: "#db2777",
  },
  {
    id: "joao-pedro",
    name: "João Pedro",
    permission: "Pode visualizar",
    activity: "Sem atividade recente",
    color: "#0d9488",
  },
];
