import type { CoverStyle, CoverTheme } from "@/types";

/**
 * Motivos SVG das capas. Cada motivo é leve, em traço fino, e recebe a cor do
 * tema (theme.motif) — nunca uma cor fixa. Sem 3D, cartoon ou textura pesada.
 * O desenho ocupa a área superior da capa; a base fica livre para o rótulo.
 */
interface MotifProps {
  theme: CoverTheme;
}

const svgProps = {
  viewBox: "0 0 120 150",
  preserveAspectRatio: "xMidYMid meet",
  fill: "none",
  className: "h-full w-full",
  "aria-hidden": true as const,
};

/** Portfólios: troféu + coroa de louros + brilho (conquista, concluído). */
export function PortfolioMotif({ theme }: MotifProps) {
  const c = theme.motif;
  return (
    <svg {...svgProps}>
      <g
        stroke={c}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.9}
      >
        <path d="M62 24 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 z" fill={c} fillOpacity={0.25} stroke="none" />
        <path d="M47 50 h26 v8 a13 13 0 0 1 -26 0 z" fill={c} fillOpacity={0.14} />
        <path d="M47 51 c-9 0 -12 -12 0 -12" />
        <path d="M73 51 c9 0 12 -12 0 -12" />
        <path d="M60 71 v9" />
        <path d="M54 80 h12 v8 h-12 z" fill={c} fillOpacity={0.14} />
        <path d="M49 90 h22" />
        <path d="M41 92 c-12 -8 -14 -24 -7 -37" opacity={0.6} />
        <path d="M79 92 c12 -8 14 -24 7 -37" opacity={0.6} />
      </g>
    </svg>
  );
}

/** Projetos: fichário robusto com lombada, etiqueta, abas e checkpoints. */
export function ProjectMotif({ theme }: MotifProps) {
  const c = theme.motif;
  return (
    <svg {...svgProps}>
      <g stroke={c} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.9}>
        <rect x="28" y="26" width="64" height="98" rx="6" fill={c} fillOpacity={0.07} />
        <line x1="40" y1="26" x2="40" y2="124" />
        <rect x="90" y="42" width="11" height="13" rx="2" fill={c} fillOpacity={0.16} stroke="none" />
        <rect x="90" y="63" width="11" height="13" rx="2" fill={c} fillOpacity={0.16} stroke="none" />
        <rect x="90" y="84" width="11" height="13" rx="2" fill={c} fillOpacity={0.16} stroke="none" />
        <rect x="50" y="50" width="34" height="20" rx="3" />
        <circle cx="47" cy="86" r="1.6" fill={c} stroke="none" />
        <line x1="52" y1="86" x2="84" y2="86" />
        <circle cx="47" cy="96" r="1.6" fill={c} stroke="none" />
        <line x1="52" y1="96" x2="78" y2="96" />
        <circle cx="47" cy="106" r="1.6" fill={c} stroke="none" />
        <line x1="52" y1="106" x2="82" y2="106" />
      </g>
    </svg>
  );
}

/** Cadernos: caderno clássico com lombada dupla e etiqueta com "janelinha". */
export function NotebookMotif({ theme }: MotifProps) {
  const c = theme.motif;
  return (
    <svg {...svgProps}>
      <g stroke={c} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.9}>
        <rect x="30" y="24" width="62" height="102" rx="6" fill={c} fillOpacity={0.07} />
        <line x1="41" y1="24" x2="41" y2="126" />
        <line x1="45" y1="24" x2="45" y2="126" opacity={0.45} />
        <rect x="54" y="52" width="30" height="24" rx="3" />
        <line x1="59" y1="64" x2="79" y2="64" opacity={0.6} />
        <line x1="80" y1="24" x2="80" y2="126" opacity={0.35} />
      </g>
    </svg>
  );
}

/** Anotações: folha pautada, leve, com canto dobrado. */
export function NoteMotif({ theme }: MotifProps) {
  const c = theme.motif;
  const lines = [48, 60, 72, 84, 96, 108];
  return (
    <svg {...svgProps}>
      <g stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" opacity={0.85}>
        <path d="M30 26 h48 l12 12 v86 a4 4 0 0 1 -4 4 h-52 a4 4 0 0 1 -4 -4 z" fill={c} fillOpacity={0.05} />
        <path d="M78 26 v12 h12" opacity={0.7} />
        {lines.map((y) => (
          <line key={y} x1="38" y1={y} x2="82" y2={y} opacity={0.5} />
        ))}
      </g>
    </svg>
  );
}

/** Rascunhos: sketchbook com espiral no topo e wireframes leves intencionais. */
export function DraftMotif({ theme }: MotifProps) {
  const c = theme.motif;
  const spiral = [36, 48, 60, 72, 84];
  return (
    <svg {...svgProps}>
      <g stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" opacity={0.85}>
        {spiral.map((x) => (
          <circle key={x} cx={x} cy="28" r="3" />
        ))}
        <rect x="30" y="34" width="60" height="92" rx="4" fill={c} fillOpacity={0.04} />
        <rect x="40" y="48" width="40" height="22" rx="2" strokeDasharray="4 3" />
        <rect x="40" y="80" width="18" height="18" rx="2" strokeDasharray="4 3" />
        <line x1="40" y1="80" x2="58" y2="98" opacity={0.6} />
        <line x1="58" y1="80" x2="40" y2="98" opacity={0.6} />
        <line x1="64" y1="89" x2="80" y2="89" />
        <path d="M75 84 l6 5 -6 5" />
      </g>
    </svg>
  );
}

/** Cards: deck horizontal de cards sobrepostos + lâmpada (ideia). */
export function CardsDeckMotif({ theme }: MotifProps) {
  const c = theme.motif;
  return (
    <svg {...svgProps}>
      <g stroke={c} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.9}>
        <circle cx="60" cy="32" r="9" fill={c} fillOpacity={0.12} />
        <line x1="56" y1="45" x2="64" y2="45" />
        <line x1="57" y1="49" x2="63" y2="49" />
        <rect x="36" y="64" width="48" height="15" rx="3" fill={c} fillOpacity={0.16} />
        <rect x="30" y="83" width="60" height="15" rx="3" fill={c} fillOpacity={0.1} />
        <rect x="36" y="102" width="48" height="15" rx="3" fill={c} fillOpacity={0.06} />
        <line x1="42" y1="71" x2="70" y2="71" opacity={0.5} />
      </g>
    </svg>
  );
}

/** Mapa de motivo por estilo de capa. */
export const coverMotifs: Record<CoverStyle, (props: MotifProps) => JSX.Element> = {
  portfolio: PortfolioMotif,
  project: ProjectMotif,
  notebook: NotebookMotif,
  note: NoteMotif,
  draft: DraftMotif,
  "cards-deck": CardsDeckMotif,
};
