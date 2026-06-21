import type { CoverStyle, CoverTheme } from "@/types";

/**
 * Faces "Experimental B — refinada". Usadas SÓ no CoverLab, em paralelo às
 * faces atuais (não substituem nada). Refinam selo, fichário, papel e rascunho.
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
  return (
    <div
      className="absolute inset-0"
      style={{ background: `linear-gradient(155deg, ${t.hi(0.16)}, transparent 40%, ${t.shadow(0.2)})` }}
    />
  );
}

/** Portfólios B: selo/medalha menor e aplicado, com fita goiaba; mais integrado. */
export function PortfolioFaceB({ theme }: FaceProps) {
  const t = tones(theme);
  return (
    <>
      <Depth theme={theme} />
      <div className="absolute inset-y-0 left-0 w-[10%]" style={{ background: t.shadow(0.2) }} />
      <div className="absolute inset-y-0 left-[10%] w-px" style={{ background: t.hi(0.28) }} />
      <div className="absolute rounded-sm" style={{ left: "15%", right: "9%", top: "9%", bottom: "27%", border: `1px solid ${t.detail(0.2)}` }} />

      {/* Fita goiaba (rosa goiaba) sob a medalha */}
      <svg viewBox="0 0 40 26" className="absolute left-1/2 top-[33%] h-[15%] w-[20%] -translate-x-1/2" fill="none" aria-hidden="true">
        <path d="M9 2 L3 24 L13 17 Z" fill="#e84a7f" fillOpacity="0.9" />
        <path d="M31 2 L37 24 L27 17 Z" fill="#e84a7f" fillOpacity="0.9" />
      </svg>

      {/* Medalha menor e aplicada */}
      <div className="absolute left-1/2 top-[27%] -translate-x-1/2 -translate-y-1/2" style={{ width: "25%", aspectRatio: "1 / 1" }}>
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle at 38% 30%, #f4dd97, #c69a3f)",
            boxShadow: "inset 0 1px 4px rgba(255,255,255,0.55), inset 0 -2px 6px rgba(0,0,0,0.28), 0 1px 3px rgba(0,0,0,0.25)",
            border: "1px solid rgba(122,84,20,0.5)",
          }}
        />
        <div className="absolute inset-[18%] rounded-full" style={{ border: "1px solid rgba(122,84,20,0.4)" }} />
        <svg viewBox="0 0 40 40" className="absolute inset-0 h-full w-full" fill="none" aria-hidden="true">
          <path d="M20 13 l2.2 5 5.4 .4 -4.1 3.6 1.3 5.3 -4.8 -2.9 -4.8 2.9 1.3 -5.3 -4.1 -3.6 5.4 -.4 z" fill="#7a5b1e" fillOpacity="0.85" />
        </svg>
      </div>
    </>
  );
}

/** Projetos B: fichário com lombada mais clara, abas com sombra, etiqueta menos chapada. */
export function ProjectFaceB({ theme }: FaceProps) {
  const t = tones(theme);
  return (
    <>
      <Depth theme={theme} />
      <div className="absolute inset-y-0 left-0 w-[14%]" style={{ background: t.shadow(0.24) }} />
      <div className="absolute inset-y-0 left-[14%] w-[2px]" style={{ background: t.hi(0.3) }} />
      {[26, 50, 74].map((top) => (
        <div key={top} className="absolute left-[7%] h-2 w-2 -translate-x-1/2 rounded-full" style={{ top: `${top}%`, border: `1.5px solid ${t.hi(0.5)}` }} />
      ))}
      {[31, 48, 65].map((top) => (
        <div
          key={top}
          className="absolute right-0 w-[6%] rounded-l-sm"
          style={{ top: `${top}%`, height: "9%", background: t.hi(0.18), boxShadow: "-2px 1px 3px rgba(0,0,0,0.18)" }}
        />
      ))}
      <div className="absolute inset-y-0 right-[14%]" style={{ width: "3px", background: t.shadow(0.22) }} />
      <div
        className="absolute rounded"
        style={{ left: "24%", right: "26%", top: "15%", height: "20%", background: `linear-gradient(180deg, ${t.hi(0.16)}, ${t.hi(0.04)})`, border: `1px solid ${t.detail(0.28)}`, boxShadow: "inset 0 1px 2px rgba(0,0,0,0.12)" }}
      >
        <div className="absolute left-[12%] right-[40%] top-[34%]" style={{ height: "2px", background: t.detail(0.3) }} />
        <div className="absolute left-[12%] right-[20%] top-[64%]" style={{ height: "2px", background: t.detail(0.18) }} />
      </div>
      {[60, 70].map((top) => (
        <div key={top} className="absolute" style={{ left: "24%", right: "32%", top: `${top}%`, height: "1.5px", background: t.detail(0.18) }} />
      ))}
    </>
  );
}

/** Cadernos B: textura de material um pouco mais visível; demais aprovado. */
export function NotebookFaceB({ theme }: FaceProps) {
  const t = tones(theme);
  return (
    <>
      <Depth theme={theme} />
      <div className="absolute inset-y-0 left-0 w-[12%]" style={{ background: t.shadow(0.18) }} />
      <div className="absolute inset-y-[6%] left-[6%] w-0 border-l border-dashed" style={{ borderColor: t.hi(0.5) }} />
      <div className="absolute inset-y-0 left-[12%] w-px" style={{ background: t.hi(0.22) }} />
      <div className="absolute inset-0" style={{ backgroundImage: `repeating-linear-gradient(45deg, ${t.detail(0.08)} 0 1px, transparent 1px 6px)` }} />
      <div className="absolute inset-y-0 right-[12%]" style={{ width: "2px", background: t.shadow(0.2) }} />
      <div className="absolute rounded-sm" style={{ left: "30%", right: "22%", top: "34%", height: "26%", background: t.hi(0.1), border: `1px solid ${t.detail(0.38)}`, boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1)" }}>
        <div className="absolute left-[14%] right-[14%] top-1/2" style={{ height: "1px", background: t.detail(0.4) }} />
      </div>
    </>
  );
}

/** Anotações B: mais papel/bloco — sombra interna, pauta com variação e cabeçalho. */
export function NoteFaceB({ theme }: FaceProps) {
  const t = tones(theme);
  const lines = [
    { top: "36%", right: "14%" },
    { top: "45%", right: "30%" },
    { top: "54%", right: "12%" },
    { top: "63%", right: "24%" },
    { top: "72%", right: "12%" },
    { top: "81%", right: "38%" },
  ];
  return (
    <>
      <div className="absolute inset-[6%] rounded-md" style={{ background: theme.baseSoft, boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1), inset 0 -1px 0 rgba(0,0,0,0.05)" }} />
      <div className="absolute rounded-t-md" style={{ left: "6%", right: "6%", top: "6%", height: "9%", background: theme.base }} />
      {/* cabeçalho: duas linhas curtas */}
      <div className="absolute" style={{ left: "16%", width: "32%", top: "24%", height: "2px", background: t.detail(0.32) }} />
      <div className="absolute" style={{ left: "16%", width: "22%", top: "29%", height: "2px", background: t.detail(0.22) }} />
      {/* pauta com variação */}
      {lines.map((l) => (
        <div key={l.top} className="absolute" style={{ left: "16%", right: l.right, top: l.top, height: "1.5px", background: t.detail(0.18) }} />
      ))}
      {/* margem */}
      <div className="absolute" style={{ left: "22%", top: "20%", bottom: "14%", width: "1px", background: t.detail(0.3) }} />
      {/* canto dobrado mais natural */}
      <div className="absolute" style={{ right: "6%", top: "6%", width: 0, height: 0, borderTop: "18px solid rgba(0,0,0,0.12)", borderLeft: "18px solid transparent" }} />
      <div className="absolute" style={{ right: "6%", top: "6%", width: "18px", height: "18px", boxShadow: "-1px 1px 2px rgba(0,0,0,0.12)" }} />
    </>
  );
}

/** Rascunhos B: esboço orgânico controlado — linhas irregulares, caixa suave, seta. */
export function DraftFaceB({ theme }: FaceProps) {
  const t = tones(theme);
  const loops = [22, 33, 44, 55, 66, 77, 88];
  return (
    <>
      <div className="absolute inset-x-[6%] bottom-[6%] top-[11%] rounded-md" style={{ background: theme.baseSoft, boxShadow: "inset 0 1px 3px rgba(0,0,0,0.08)" }} />
      <div className="absolute left-[6%] right-[6%] top-[10%]" style={{ height: "1px", background: t.detail(0.25) }} />
      <svg viewBox="0 0 100 14" preserveAspectRatio="none" className="absolute left-[6%] right-[6%] top-[3%] h-[10%] w-[88%]" fill="none" aria-hidden="true">
        <g stroke={t.detail(0.5)} strokeWidth="1.6" strokeLinecap="round">
          {loops.map((x) => (
            <path key={x} d={`M${x} 1 q4 7 0 12`} />
          ))}
        </g>
      </svg>
      <svg viewBox="0 0 100 120" preserveAspectRatio="none" className="absolute inset-x-[14%] top-[24%] h-[56%]" fill="none" aria-hidden="true">
        <g stroke={t.detail(0.34)} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 16 q14 -5 28 -1 t26 2" />
          <path d="M4 30 q12 -4 24 -1 t22 2" />
          <rect x="4" y="48" width="42" height="28" rx="9" stroke={t.detail(0.3)} />
          <path d="M56 60 q10 -3 22 0" />
          <path d="M72 53 l8 7 -9 5" />
        </g>
      </svg>
    </>
  );
}

/** Cards B: deck horizontal (mantido como aprovado). */
export function CardsDeckFaceB({ theme }: FaceProps) {
  const t = tones(theme);
  return (
    <>
      <Depth theme={theme} />
      <div className="absolute rounded-md" style={{ left: "22%", right: "14%", top: "30%", height: "16%", background: t.hi(0.22), transform: "rotate(-5deg)" }} />
      <div className="absolute rounded-md" style={{ left: "15%", right: "17%", top: "40%", height: "18%", background: t.hi(0.4), transform: "rotate(2.5deg)" }} />
      <div className="absolute rounded-md bg-white" style={{ left: "13%", right: "15%", top: "50%", height: "24%", boxShadow: "0 4px 10px rgba(0,0,0,0.18)" }}>
        <div className="absolute left-[12%] right-[20%] top-[34%]" style={{ height: "2px", background: "rgba(15,23,42,0.22)" }} />
        <div className="absolute left-[12%] right-[40%] top-[60%]" style={{ height: "2px", background: "rgba(15,23,42,0.15)" }} />
      </div>
    </>
  );
}

export const coverFacesB: Record<CoverStyle, (props: FaceProps) => JSX.Element> = {
  portfolio: PortfolioFaceB,
  project: ProjectFaceB,
  notebook: NotebookFaceB,
  note: NoteFaceB,
  draft: DraftFaceB,
  "cards-deck": CardsDeckFaceB,
};
