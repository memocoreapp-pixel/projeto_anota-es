import type { CoverStyle, CoverTheme } from "@/types";

/**
 * Faces "Experimental C". Símbolos centrais reduzidos; sensação de capa real
 * por moldura, lombada, etiqueta, textura e microelementos. Família coesa,
 * usando Cadernos como referência de maturidade. Só no CoverLab.
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
    <div className="absolute inset-0" style={{ background: `linear-gradient(155deg, ${t.hi(0.14)}, transparent 42%, ${t.shadow(0.2)})` }} />
  );
}

function Spine({ theme, width = "11%" }: FaceProps & { width?: string }) {
  const t = tones(theme);
  return (
    <>
      <div className="absolute inset-y-0 left-0" style={{ width, background: t.shadow(0.22) }} />
      <div className="absolute inset-y-0" style={{ left: width, width: "1px", background: t.hi(0.28) }} />
    </>
  );
}

function Frame({ theme }: FaceProps) {
  const t = tones(theme);
  return (
    <div
      className="absolute rounded-md"
      style={{ left: "16%", right: "8%", top: "8%", bottom: "26%", border: `1px solid ${t.detail(0.22)}`, boxShadow: `inset 0 0 0 3px ${t.hi(0.04)}` }}
    />
  );
}

/** Portfólios C: capa premium emoldurada, marcador goiaba discreto, selo pequeno. */
export function PortfolioFaceC({ theme }: FaceProps) {
  const t = tones(theme);
  return (
    <>
      <Depth theme={theme} />
      <Spine theme={theme} />
      <Frame theme={theme} />
      {/* marcador (bookmark) goiaba discreto */}
      <div className="absolute" style={{ right: "20%", top: "8%", width: "8px", height: "26%", background: "#e84a7f", opacity: 0.8, clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 86%, 0 100%)" }} />
      {/* selo pequeno aplicado, centro-superior */}
      <div className="absolute left-[44%] top-[33%] -translate-x-1/2 -translate-y-1/2" style={{ width: "16%", aspectRatio: "1 / 1" }}>
        <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle at 38% 30%, #f4dd97, #c69a3f)", boxShadow: "inset 0 1px 3px rgba(255,255,255,0.55), inset 0 -2px 4px rgba(0,0,0,0.28), 0 1px 2px rgba(0,0,0,0.25)", border: "1px solid rgba(122,84,20,0.5)" }} />
        <svg viewBox="0 0 40 40" className="absolute inset-0 h-full w-full" fill="none" aria-hidden="true">
          <path d="M20 14 l2 4.5 5 .4 -3.7 3.3 1.2 4.8 -4.5 -2.6 -4.5 2.6 1.2 -4.8 -3.7 -3.3 5 -.4 z" fill="#7a5b1e" fillOpacity="0.85" />
        </svg>
      </div>
      {/* linhas finas de acabamento (título do portfólio) */}
      <div className="absolute" style={{ left: "24%", width: "30%", top: "52%", height: "2px", background: t.detail(0.28) }} />
      <div className="absolute" style={{ left: "24%", width: "20%", top: "57%", height: "2px", background: t.detail(0.16) }} />
    </>
  );
}

/** Projetos C: fichário robusto com abas realistas, etiqueta, módulos e progresso. */
export function ProjectFaceC({ theme }: FaceProps) {
  const t = tones(theme);
  return (
    <>
      <Depth theme={theme} />
      <Spine theme={theme} width="14%" />
      {[26, 50, 74].map((top) => (
        <div key={top} className="absolute left-[7%] h-2 w-2 -translate-x-1/2 rounded-full" style={{ top: `${top}%`, border: `1.5px solid ${t.hi(0.5)}` }} />
      ))}
      {/* abas realistas */}
      {[30, 47, 64].map((top, i) => (
        <div key={top} className="absolute right-0 rounded-l-md" style={{ top: `${top}%`, height: "9%", width: `${7 - i}%`, background: t.hi(0.18), boxShadow: "-2px 1px 3px rgba(0,0,0,0.2)" }} />
      ))}
      {/* etiqueta superior discreta */}
      <div className="absolute rounded" style={{ left: "24%", right: "26%", top: "14%", height: "13%", background: `linear-gradient(180deg, ${t.hi(0.16)}, ${t.hi(0.04)})`, border: `1px solid ${t.detail(0.28)}` }}>
        <div className="absolute left-[12%] right-[45%] top-[40%]" style={{ height: "2px", background: t.detail(0.3) }} />
      </div>
      {/* módulos de planejamento (pequenos) */}
      {[34, 44, 54].map((top) => (
        <div key={top} className="absolute" style={{ left: "24%", top: `${top}%` }}>
          <div className="absolute" style={{ width: "6px", height: "6px", borderRadius: "1px", border: `1.4px solid ${t.detail(0.4)}` }} />
        </div>
      ))}
      {[34, 44, 54].map((top) => (
        <div key={top} className="absolute" style={{ left: "33%", right: "30%", top: `${top + 1.4}%`, height: "1.6px", background: t.detail(0.22) }} />
      ))}
      {/* barra de progresso sutil */}
      <div className="absolute rounded-full" style={{ left: "24%", right: "26%", top: "66%", height: "4px", background: t.detail(0.12) }}>
        <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: "55%", background: t.detail(0.4) }} />
      </div>
    </>
  );
}

/** Cadernos C: referência de maturidade (mantido), textura leve. */
export function NotebookFaceC({ theme }: FaceProps) {
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

/** Anotações C: bloco/página leve com pauta orgânica, margem, bullets e dobra. */
export function NoteFaceC({ theme }: FaceProps) {
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
      <div className="absolute inset-[6%] rounded-md" style={{ background: theme.baseSoft, boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)" }} />
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

/** Rascunhos C: sketchbook profissional — microtraços distribuídos, sutis. */
export function DraftFaceC({ theme }: FaceProps) {
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
      {/* microtraços distribuídos, opacidade baixa */}
      <svg viewBox="0 0 100 130" preserveAspectRatio="none" className="absolute inset-x-[12%] top-[20%] h-[64%]" fill="none" aria-hidden="true">
        <g stroke={t.detail(0.26)} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <rect x="6" y="8" width="22" height="14" rx="2" />
          <path d="M34 12 q8 -2 18 0" />
          <path d="M34 18 q6 -1 12 0" />
          <rect x="60" y="6" width="16" height="12" rx="2" />
          <path d="M10 40 q14 -3 26 0" />
          <path d="M44 44 l8 5 -8 5" />
          <rect x="64" y="40" width="20" height="16" rx="2" />
          <path d="M12 66 q10 -2 20 0" />
          <path d="M40 70 q8 -2 16 0" />
        </g>
      </svg>
    </>
  );
}

/** Cards C: deck horizontal mais integrado; frontal mais leve. */
export function CardsDeckFaceC({ theme }: FaceProps) {
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

export const coverFacesC: Record<CoverStyle, (props: FaceProps) => JSX.Element> = {
  portfolio: PortfolioFaceC,
  project: ProjectFaceC,
  notebook: NotebookFaceC,
  note: NoteFaceC,
  draft: DraftFaceC,
  "cards-deck": CardsDeckFaceC,
};
