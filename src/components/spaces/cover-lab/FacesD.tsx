import type { CoverStyle, CoverTheme } from "@/types";

/**
 * Faces "Experimental D — Manual". Implementam o Manual Visual de Capas:
 * cada capa é um OBJETO em camadas (lombada, moldura, textura, símbolo
 * integrado), com forte coesão de família via scaffolds compartilhados.
 * Cores sempre via token (theme). Só no CoverLab.
 */
interface FaceProps {
  theme: CoverTheme;
}

function tones(theme: CoverTheme) {
  const onDark = theme.onCover.toLowerCase() === "#ffffff";
  const rgb = onDark ? "255,255,255" : "30,41,59";
  return {
    detail: (a: number) => `rgba(${rgb},${a})`,
    hi: (a: number) => `rgba(255,255,255,${a})`,
    shadow: (a: number) => `rgba(0,0,0,${a})`,
  };
}

function Depth({ theme }: FaceProps) {
  const t = tones(theme);
  return <div className="absolute inset-0" style={{ background: `linear-gradient(155deg, ${t.hi(0.13)}, transparent 44%, ${t.shadow(0.2)})` }} />;
}

/** Scaffold de "livro": lombada + moldura + textura sutil. */
function BookScaffold({ theme, spine = "11%" }: FaceProps & { spine?: string }) {
  const t = tones(theme);
  return (
    <>
      <Depth theme={theme} />
      <div className="absolute inset-y-0 left-0" style={{ width: spine, background: t.shadow(0.22) }} />
      <div className="absolute inset-y-0" style={{ left: spine, width: "1px", background: t.hi(0.28) }} />
      <div className="absolute rounded-md" style={{ left: "16%", right: "8%", top: "8%", bottom: "26%", border: `1px solid ${t.detail(0.2)}`, boxShadow: `inset 0 0 0 3px ${t.hi(0.04)}` }} />
      <div className="absolute inset-0" style={{ backgroundImage: `repeating-linear-gradient(45deg, ${t.detail(0.045)} 0 1px, transparent 1px 7px)` }} />
    </>
  );
}

/** Scaffold de "papel": página clara com borda suave. */
function PaperScaffold({ theme, top = "6%" }: FaceProps & { top?: string }) {
  return (
    <div className="absolute rounded-md" style={{ left: "6%", right: "6%", top, bottom: "6%", background: theme.baseSoft, boxShadow: "inset 0 1px 3px rgba(0,0,0,0.09)" }} />
  );
}

/** Portfólios D: capa premium com emblema integrado (selo + louros pequenos). */
export function PortfolioCoverFace({ theme }: FaceProps) {
  const t = tones(theme);
  return (
    <>
      <BookScaffold theme={theme} />
      {/* halo que "assenta" o emblema na capa */}
      <div className="absolute left-1/2 top-[34%] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ width: "34%", aspectRatio: "1 / 1", background: `radial-gradient(circle, ${t.shadow(0.12)}, transparent 70%)` }} />
      {/* louros pequenos */}
      <svg viewBox="0 0 60 40" className="absolute left-1/2 top-[34%] h-[20%] w-[34%] -translate-x-1/2 -translate-y-1/2" fill="none" aria-hidden="true">
        <g stroke={t.detail(0.5)} strokeWidth="2" strokeLinecap="round">
          <path d="M22 8 c-7 4 -9 16 -4 26" />
          <path d="M38 8 c7 4 9 16 4 26" />
        </g>
      </svg>
      {/* selo aplicado pequeno */}
      <div className="absolute left-1/2 top-[34%] -translate-x-1/2 -translate-y-1/2" style={{ width: "15%", aspectRatio: "1 / 1" }}>
        <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle at 38% 30%, #f4dd97, #c69a3f)", boxShadow: "inset 0 1px 3px rgba(255,255,255,0.55), inset 0 -2px 4px rgba(0,0,0,0.28), 0 1px 2px rgba(0,0,0,0.3)", border: "1px solid rgba(122,84,20,0.5)" }} />
        <svg viewBox="0 0 40 40" className="absolute inset-0 h-full w-full" fill="none" aria-hidden="true">
          <path d="M20 14 l1.9 4.3 4.7 .4 -3.5 3.1 1.1 4.6 -4.2 -2.5 -4.2 2.5 1.1 -4.6 -3.5 -3.1 4.7 -.4 z" fill="#7a5b1e" fillOpacity="0.85" />
        </svg>
      </div>
      {/* detalhe goiaba muito discreto */}
      <div className="absolute" style={{ left: "24%", width: "16%", top: "52%", height: "2px", background: "#e84a7f", opacity: 0.55 }} />
      <div className="absolute" style={{ left: "24%", width: "30%", top: "57%", height: "2px", background: t.detail(0.2) }} />
    </>
  );
}

/** Projetos D: fichário com abas, elástico, etiqueta e planejamento discreto. */
export function ProjectCoverFace({ theme }: FaceProps) {
  const t = tones(theme);
  return (
    <>
      <BookScaffold theme={theme} spine="14%" />
      {[26, 50, 74].map((top) => (
        <div key={top} className="absolute left-[7%] h-2 w-2 -translate-x-1/2 rounded-full" style={{ top: `${top}%`, border: `1.5px solid ${t.hi(0.5)}` }} />
      ))}
      {[31, 49].map((top, i) => (
        <div key={top} className="absolute right-0 rounded-l-md" style={{ top: `${top}%`, height: "10%", width: `${7 - i}%`, background: t.hi(0.18), boxShadow: "-2px 1px 3px rgba(0,0,0,0.2)" }} />
      ))}
      <div className="absolute inset-y-0 right-[14%]" style={{ width: "3px", background: t.shadow(0.22) }} />
      <div className="absolute rounded" style={{ left: "23%", right: "26%", top: "14%", height: "13%", background: `linear-gradient(180deg, ${t.hi(0.16)}, ${t.hi(0.04)})`, border: `1px solid ${t.detail(0.26)}` }}>
        <div className="absolute left-[12%] right-[46%] top-[42%]" style={{ height: "2px", background: t.detail(0.3) }} />
      </div>
      {[40, 50].map((top) => (
        <div key={top} className="absolute" style={{ left: "23%", top: `${top}%`, width: "6px", height: "6px", borderRadius: "1px", border: `1.4px solid ${t.detail(0.4)}` }} />
      ))}
      {[40, 50].map((top) => (
        <div key={top} className="absolute" style={{ left: "31%", right: "30%", top: `${top + 1.6}%`, height: "1.6px", background: t.detail(0.2) }} />
      ))}
      <div className="absolute rounded-full" style={{ left: "23%", right: "26%", top: "62%", height: "4px", background: t.detail(0.12) }}>
        <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: "55%", background: t.detail(0.38) }} />
      </div>
    </>
  );
}

/** Cadernos D: caderno clássico (referência) — lombada costurada e etiqueta/janela. */
export function NotebookCoverFace({ theme }: FaceProps) {
  const t = tones(theme);
  return (
    <>
      <Depth theme={theme} />
      <div className="absolute inset-y-0 left-0 w-[12%]" style={{ background: t.shadow(0.18) }} />
      <div className="absolute inset-y-[6%] left-[6%] w-0 border-l border-dashed" style={{ borderColor: t.hi(0.5) }} />
      <div className="absolute inset-y-0 left-[12%] w-px" style={{ background: t.hi(0.22) }} />
      <div className="absolute inset-0" style={{ backgroundImage: `repeating-linear-gradient(45deg, ${t.detail(0.07)} 0 1px, transparent 1px 6px)` }} />
      <div className="absolute inset-y-0 right-[12%]" style={{ width: "2px", background: t.shadow(0.2) }} />
      <div className="absolute rounded-sm" style={{ left: "30%", right: "22%", top: "34%", height: "26%", background: t.hi(0.1), border: `1px solid ${t.detail(0.38)}`, boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1)" }}>
        <div className="absolute left-[14%] right-[14%] top-1/2" style={{ height: "1px", background: t.detail(0.4) }} />
      </div>
    </>
  );
}

/** Anotações D: bloco/página com pauta orgânica, margem, bullets e dobra. */
export function NoteCoverFace({ theme }: FaceProps) {
  const t = tones(theme);
  const lines = [
    { top: "38%", right: "16%" },
    { top: "47%", right: "32%" },
    { top: "56%", right: "14%" },
    { top: "65%", right: "26%" },
    { top: "74%", right: "16%" },
    { top: "83%", right: "40%" },
  ];
  return (
    <>
      <PaperScaffold theme={theme} />
      <div className="absolute rounded-t-md" style={{ left: "6%", right: "6%", top: "6%", height: "8%", background: theme.base }} />
      <div className="absolute" style={{ left: "16%", width: "30%", top: "26%", height: "2px", background: t.detail(0.32) }} />
      <div className="absolute" style={{ left: "16%", width: "20%", top: "31%", height: "2px", background: t.detail(0.2) }} />
      {lines.map((l) => (
        <div key={l.top}>
          <div className="absolute rounded-full" style={{ left: "13%", top: l.top, width: "3px", height: "3px", background: t.detail(0.3) }} />
          <div className="absolute" style={{ left: "18%", right: l.right, top: `calc(${l.top} + 1px)`, height: "1.5px", background: t.detail(0.18) }} />
        </div>
      ))}
      <div className="absolute" style={{ left: "23%", top: "22%", bottom: "14%", width: "1px", background: t.detail(0.28) }} />
      <div className="absolute" style={{ right: "6%", top: "6%", width: 0, height: 0, borderTop: "16px solid rgba(0,0,0,0.12)", borderLeft: "16px solid transparent" }} />
    </>
  );
}

/** Rascunhos D: sketchbook controlado — espiral, poucas marcas leves. */
export function DraftCoverFace({ theme }: FaceProps) {
  const t = tones(theme);
  const loops = [22, 33, 44, 55, 66, 77, 88];
  return (
    <>
      <PaperScaffold theme={theme} top="11%" />
      <div className="absolute left-[6%] right-[6%] top-[10%]" style={{ height: "1px", background: t.detail(0.25) }} />
      <svg viewBox="0 0 100 14" preserveAspectRatio="none" className="absolute left-[6%] right-[6%] top-[3%] h-[10%] w-[88%]" fill="none" aria-hidden="true">
        <g stroke={t.detail(0.5)} strokeWidth="1.6" strokeLinecap="round">
          {loops.map((x) => (
            <path key={x} d={`M${x} 1 q4 7 0 12`} />
          ))}
        </g>
      </svg>
      <svg viewBox="0 0 100 130" preserveAspectRatio="none" className="absolute inset-x-[12%] top-[22%] h-[60%]" fill="none" aria-hidden="true">
        <g stroke={t.detail(0.24)} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <rect x="6" y="8" width="24" height="15" rx="2" />
          <path d="M36 12 q9 -2 18 0" />
          <path d="M36 18 q6 -1 12 0" />
          <path d="M10 44 q14 -3 26 0" />
          <path d="M44 48 l8 5 -8 5" />
          <path d="M14 70 q10 -2 20 0" />
        </g>
      </svg>
    </>
  );
}

/** Cards D: deck horizontal integrado; frontal claro com 2 linhas. */
export function CardsDeckCoverFace({ theme }: FaceProps) {
  const t = tones(theme);
  return (
    <>
      <Depth theme={theme} />
      <div className="absolute rounded-md" style={{ left: "24%", right: "16%", top: "32%", height: "15%", background: t.hi(0.2), transform: "rotate(-4deg)" }} />
      <div className="absolute rounded-md" style={{ left: "17%", right: "19%", top: "42%", height: "17%", background: t.hi(0.34), transform: "rotate(2deg)" }} />
      <div className="absolute rounded-md" style={{ left: "15%", right: "17%", top: "52%", height: "22%", background: "rgba(255,255,255,0.92)", boxShadow: "0 3px 8px rgba(0,0,0,0.16)" }}>
        <div className="absolute left-[12%] right-[24%] top-[34%]" style={{ height: "2px", background: "rgba(15,23,42,0.2)" }} />
        <div className="absolute left-[12%] right-[44%] top-[62%]" style={{ height: "2px", background: "rgba(15,23,42,0.13)" }} />
      </div>
    </>
  );
}

export const coverFacesD: Record<CoverStyle, (props: FaceProps) => JSX.Element> = {
  portfolio: PortfolioCoverFace,
  project: ProjectCoverFace,
  notebook: NotebookCoverFace,
  note: NoteCoverFace,
  draft: DraftCoverFace,
  "cards-deck": CardsDeckCoverFace,
};
