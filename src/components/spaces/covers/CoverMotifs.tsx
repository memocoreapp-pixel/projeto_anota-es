import type { CoverStyle, CoverTheme } from "@/types";

/**
 * Composições de capa (não ícones centrais). Cada estilo preenche o quadro
 * como um objeto: lombada/espessura, moldura, detalhe interno e padrão sutil.
 * A cor vem sempre do tema (theme.motif) — nunca hardcodada. Sem 3D/cartoon.
 * O viewBox 120x160 (proporção 3:4) cobre toda a capa; a base é reservada
 * para o rótulo (aplicado pelo SpaceCover com um leve esmaecido).
 */
interface MotifProps {
  theme: CoverTheme;
}

const svg = {
  viewBox: "0 0 120 160",
  preserveAspectRatio: "xMidYMid meet",
  fill: "none",
  className: "h-full w-full",
  "aria-hidden": true as const,
};

/** Portfólios: capa premium com lombada, moldura e medalha (troféu + louros). */
export function PortfolioMotif({ theme }: MotifProps) {
  const c = theme.motif;
  return (
    <svg {...svg}>
      <rect x="0" y="0" width="13" height="160" fill={c} fillOpacity={0.14} />
      <line x1="13" y1="0" x2="13" y2="160" stroke={c} strokeOpacity={0.25} strokeWidth={1.5} />
      <rect x="24" y="14" width="84" height="116" rx="4" stroke={c} strokeOpacity={0.3} strokeWidth={1.5} />
      <path d="M32 22 h9 M32 22 v9" stroke={c} strokeOpacity={0.45} strokeWidth={1.5} strokeLinecap="round" />
      <path d="M100 22 h-9 M100 22 v9" stroke={c} strokeOpacity={0.45} strokeWidth={1.5} strokeLinecap="round" />
      <g stroke={c} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="66" cy="58" r="22" strokeOpacity={0.9} />
        <circle cx="66" cy="58" r="14" strokeOpacity={0.45} />
        <path d="M59 50 h14 v4 a7 7 0 0 1 -14 0 z" fill={c} fillOpacity={0.22} />
        <path d="M59 51 c-5 0 -7 -7 0 -7" strokeOpacity={0.8} />
        <path d="M73 51 c5 0 7 -7 0 -7" strokeOpacity={0.8} />
        <path d="M66 65 v5 M61 71 h10" />
        <path d="M58 86 l-4 16 12 -6 12 6 -4 -16" strokeOpacity={0.7} fill={c} fillOpacity={0.08} />
        <path d="M40 100 c-7 -9 -7 -22 0 -31" strokeOpacity={0.45} />
        <path d="M92 100 c7 -9 7 -22 0 -31" strokeOpacity={0.45} />
      </g>
    </svg>
  );
}

/** Projetos: fichário robusto com lombada/argolas, elástico, abas e planejamento. */
export function ProjectMotif({ theme }: MotifProps) {
  const c = theme.motif;
  const rings = [40, 80, 120];
  const rows = [62, 78, 94, 110];
  return (
    <svg {...svg}>
      <rect x="0" y="0" width="18" height="160" fill={c} fillOpacity={0.16} />
      <line x1="18" y1="0" x2="18" y2="160" stroke={c} strokeOpacity={0.3} strokeWidth={1.5} />
      {rings.map((y) => (
        <circle key={y} cx="9" cy={y} r="3.4" stroke={c} strokeOpacity={0.6} strokeWidth={1.6} />
      ))}
      <rect x="26" y="14" width="82" height="116" rx="4" stroke={c} strokeOpacity={0.28} strokeWidth={1.5} />
      <line x1="98" y1="14" x2="98" y2="130" stroke={c} strokeOpacity={0.4} strokeWidth={2} />
      <rect x="36" y="24" width="46" height="18" rx="3" stroke={c} strokeOpacity={0.7} strokeWidth={1.8} />
      {[44, 64, 84].map((y) => (
        <rect key={y} x="104" y={y} width="14" height="13" rx="2" fill={c} fillOpacity={0.16} />
      ))}
      <g strokeWidth={1.6}>
        {rows.map((y) => (
          <g key={y}>
            <rect x="34" y={y} width="8" height="8" rx="1.5" stroke={c} strokeOpacity={0.6} />
            <line x1="48" y1={y + 4} x2="88" y2={y + 4} stroke={c} strokeOpacity={0.45} strokeLinecap="round" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Cadernos: caderno clássico com lombada costurada, textura e etiqueta/janela. */
export function NotebookMotif({ theme }: MotifProps) {
  const c = theme.motif;
  const texture = [26, 34, 42, 50, 58, 66, 74, 82, 90, 98, 106, 114, 122];
  return (
    <svg {...svg}>
      <rect x="0" y="0" width="15" height="160" fill={c} fillOpacity={0.14} />
      <line x1="9" y1="8" x2="9" y2="152" stroke={c} strokeOpacity={0.4} strokeWidth={1.4} strokeDasharray="3 4" />
      <line x1="15" y1="0" x2="15" y2="160" stroke={c} strokeOpacity={0.25} strokeWidth={1.5} />
      <rect x="24" y="14" width="84" height="116" rx="4" stroke={c} strokeOpacity={0.25} strokeWidth={1.5} />
      {texture.map((y) => (
        <line key={y} x1="24" y1={y} x2="108" y2={y} stroke={c} strokeOpacity={0.06} strokeWidth={1} />
      ))}
      <rect x="44" y="48" width="44" height="32" rx="3" stroke={c} strokeOpacity={0.7} strokeWidth={1.8} fill={c} fillOpacity={0.06} />
      <line x1="50" y1="64" x2="82" y2="64" stroke={c} strokeOpacity={0.5} strokeWidth={1.5} />
      <line x1="99" y1="14" x2="99" y2="130" stroke={c} strokeOpacity={0.35} strokeWidth={2} />
    </svg>
  );
}

/** Anotações: página pautada leve, com margem e canto dobrado. */
export function NoteMotif({ theme }: MotifProps) {
  const c = theme.motif;
  const lines = [30, 42, 54, 66, 78, 90, 102, 114];
  return (
    <svg {...svg}>
      <path d="M18 12 h70 l14 14 v106 a3 3 0 0 1 -3 3 h-81 a3 3 0 0 1 -3 -3 z" stroke={c} strokeOpacity={0.22} strokeWidth={1.5} fill={c} fillOpacity={0.04} />
      <path d="M88 12 v14 h14" stroke={c} strokeOpacity={0.35} strokeWidth={1.5} fill={c} fillOpacity={0.08} />
      <line x1="34" y1="14" x2="34" y2="132" stroke={c} strokeOpacity={0.35} strokeWidth={1.4} />
      <g stroke={c} strokeOpacity={0.4} strokeWidth={1.4} strokeLinecap="round">
        {lines.map((y) => (
          <line key={y} x1="40" y1={y} x2="96" y2={y} />
        ))}
      </g>
    </svg>
  );
}

/** Rascunhos: sketchbook com espiral no topo e wireframe controlado. */
export function DraftMotif({ theme }: MotifProps) {
  const c = theme.motif;
  const loops = [28, 39, 50, 61, 72, 83, 94];
  return (
    <svg {...svg}>
      <rect x="20" y="24" width="80" height="110" rx="3" stroke={c} strokeOpacity={0.2} strokeWidth={1.5} fill={c} fillOpacity={0.03} />
      <line x1="20" y1="20" x2="100" y2="20" stroke={c} strokeOpacity={0.3} strokeWidth={1.4} />
      <g stroke={c} strokeOpacity={0.6} strokeWidth={1.6} strokeLinecap="round">
        {loops.map((x) => (
          <path key={x} d={`M${x} 12 q5 9 0 17`} />
        ))}
      </g>
      <g stroke={c} strokeLinecap="round" strokeLinejoin="round">
        <rect x="32" y="40" width="56" height="16" rx="2" strokeDasharray="4 3" strokeOpacity={0.55} strokeWidth={1.6} />
        <rect x="32" y="66" width="24" height="24" rx="2" strokeDasharray="4 3" strokeOpacity={0.5} strokeWidth={1.6} />
        <rect x="64" y="66" width="24" height="24" rx="2" strokeDasharray="4 3" strokeOpacity={0.5} strokeWidth={1.6} />
        <line x1="40" y1="106" x2="80" y2="106" strokeOpacity={0.55} strokeWidth={1.6} />
        <path d="M74 101 l6 5 -6 5" strokeOpacity={0.55} strokeWidth={1.6} />
      </g>
    </svg>
  );
}

/** Cards: deck de cards horizontais sobrepostos + lâmpada discreta no topo. */
export function CardsDeckMotif({ theme }: MotifProps) {
  const c = theme.motif;
  return (
    <svg {...svg}>
      <g stroke={c} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="60" cy="28" r="8" strokeWidth={2} strokeOpacity={0.85} fill={c} fillOpacity={0.12} />
        <line x1="56" y1="39" x2="64" y2="39" strokeWidth={2} strokeOpacity={0.85} />
        <line x1="57" y1="43" x2="63" y2="43" strokeWidth={2} strokeOpacity={0.85} />
        <rect x="32" y="56" width="56" height="20" rx="4" fill={c} fillOpacity={0.07} stroke={c} strokeOpacity={0.35} strokeWidth={1.6} />
        <rect x="24" y="72" width="72" height="22" rx="4" fill={c} fillOpacity={0.12} stroke={c} strokeOpacity={0.5} strokeWidth={1.8} />
        <rect x="30" y="92" width="60" height="26" rx="4" fill={c} fillOpacity={0.18} stroke={c} strokeOpacity={0.85} strokeWidth={2} />
        <line x1="38" y1="103" x2="80" y2="103" strokeOpacity={0.5} strokeWidth={1.5} />
        <line x1="38" y1="110" x2="66" y2="110" strokeOpacity={0.4} strokeWidth={1.5} />
      </g>
    </svg>
  );
}

/** Mapa de composição por estilo de capa. */
export const coverMotifs: Record<CoverStyle, (props: MotifProps) => JSX.Element> = {
  portfolio: PortfolioMotif,
  project: ProjectMotif,
  notebook: NotebookMotif,
  note: NoteMotif,
  draft: DraftMotif,
  "cards-deck": CardsDeckMotif,
};
