import type { CoverStyle, CoverTheme } from "@/types";

/**
 * "Faces" de capa montadas em CAMADAS (CSS/HTML + SVG só como detalhe).
 * Cada face preenche a capa como um objeto físico: lombada, profundidade,
 * textura, etiqueta e um símbolo pequeno/médio. A cor base vem do tema;
 * sombras/brilhos usam rgba neutro (não alteram a identidade de cor).
 */
interface FaceProps {
  theme: CoverTheme;
}

/** Deriva tons de detalhe conforme a capa é escura ou clara. */
function tones(theme: CoverTheme) {
  const onDark = theme.onCover.toLowerCase() === "#ffffff";
  const rgb = onDark ? "255,255,255" : "30,41,59";
  return {
    /** Linha/borda de detalhe legível sobre a capa. */
    detail: (a: number) => `rgba(${rgb},${a})`,
    hi: (a: number) => `rgba(255,255,255,${a})`,
    shadow: (a: number) => `rgba(0,0,0,${a})`,
  };
}

function Depth({ theme }: FaceProps) {
  return (
    <div
      className="absolute inset-0"
      style={{
        background: `linear-gradient(155deg, ${tones(theme).hi(
          0.14
        )}, transparent 38%, ${tones(theme).shadow(0.2)})`,
      }}
    />
  );
}

/** Portfólios: moldura + selo/medalha dourado com troféu pequeno. */
export function PortfolioFace({ theme }: FaceProps) {
  const t = tones(theme);
  return (
    <>
      <Depth theme={theme} />
      <div className="absolute inset-y-0 left-0 w-[11%]" style={{ background: t.shadow(0.22) }} />
      <div className="absolute inset-y-0 left-[11%] w-px" style={{ background: t.hi(0.25) }} />
      <div
        className="absolute rounded-sm"
        style={{ left: "16%", right: "8%", top: "8%", bottom: "27%", border: `1px solid ${t.detail(0.22)}` }}
      />
      <div className="absolute left-[55%] top-[35%] -translate-x-1/2 -translate-y-1/2" style={{ width: "42%", aspectRatio: "1 / 1" }}>
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle at 38% 30%, #f4dd97, #c69a3f)",
            boxShadow: "inset 0 2px 6px rgba(255,255,255,0.5), inset 0 -3px 8px rgba(0,0,0,0.25)",
            border: "1px solid rgba(122,84,20,0.5)",
          }}
        />
        <div className="absolute inset-[15%] rounded-full" style={{ border: "1px solid rgba(122,84,20,0.4)" }} />
        <svg viewBox="0 0 40 40" className="absolute inset-0 h-full w-full" fill="none" aria-hidden="true">
          <g stroke="#7a5b1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 14 h10 v3 a5 5 0 0 1 -10 0 z" fill="#7a5b1e" fillOpacity="0.25" />
            <path d="M15 15 c-3 0 -4 -4 0 -4" />
            <path d="M25 15 c3 0 4 -4 0 -4" />
            <path d="M20 22 v3 M17 27 h6" />
          </g>
        </svg>
      </div>
    </>
  );
}

/** Projetos: fichário com lombada/argolas, abas, elástico e etiqueta. */
export function ProjectFace({ theme }: FaceProps) {
  const t = tones(theme);
  return (
    <>
      <Depth theme={theme} />
      <div className="absolute inset-y-0 left-0 w-[14%]" style={{ background: t.shadow(0.25) }} />
      <div className="absolute inset-y-0 left-[14%] w-px" style={{ background: t.hi(0.2) }} />
      {[26, 50, 74].map((top) => (
        <div key={top} className="absolute left-[7%] h-2 w-2 -translate-x-1/2 rounded-full" style={{ top: `${top}%`, border: `1.5px solid ${t.hi(0.45)}` }} />
      ))}
      {[30, 47, 64].map((top) => (
        <div key={top} className="absolute right-0 w-[6%] rounded-l-sm" style={{ top: `${top}%`, height: "9%", background: t.hi(0.16) }} />
      ))}
      <div className="absolute inset-y-0 right-[14%]" style={{ width: "3px", background: t.shadow(0.25) }} />
      <div className="absolute rounded-sm" style={{ left: "24%", right: "26%", top: "15%", height: "19%", background: t.hi(0.1), border: `1px solid ${t.detail(0.3)}` }} />
      {[58, 67, 76].map((top) => (
        <div key={top} className="absolute" style={{ left: "24%", right: "30%", top: `${top}%`, height: "2px", background: t.detail(0.22) }} />
      ))}
    </>
  );
}

/** Cadernos: lombada costurada, textura de tecido e etiqueta/janela. */
export function NotebookFace({ theme }: FaceProps) {
  const t = tones(theme);
  return (
    <>
      <Depth theme={theme} />
      <div className="absolute inset-y-0 left-0 w-[12%]" style={{ background: t.shadow(0.18) }} />
      <div className="absolute inset-y-[6%] left-[6%] w-0 border-l border-dashed" style={{ borderColor: t.hi(0.45) }} />
      <div className="absolute inset-y-0 left-[12%] w-px" style={{ background: t.hi(0.2) }} />
      <div
        className="absolute inset-0"
        style={{ backgroundImage: `repeating-linear-gradient(45deg, ${t.detail(0.05)} 0 1px, transparent 1px 6px)` }}
      />
      <div className="absolute inset-y-0 right-[12%]" style={{ width: "2px", background: t.shadow(0.2) }} />
      <div className="absolute rounded-sm" style={{ left: "30%", right: "22%", top: "34%", height: "26%", background: t.hi(0.08), border: `1px solid ${t.detail(0.35)}` }}>
        <div className="absolute left-[14%] right-[14%] top-1/2" style={{ height: "1px", background: t.detail(0.4) }} />
      </div>
    </>
  );
}

/** Anotações: papel claro com tira de bloco, linhas pautadas e canto dobrado. */
export function NoteFace({ theme }: FaceProps) {
  const t = tones(theme);
  return (
    <>
      <div className="absolute inset-[6%] rounded-md" style={{ background: theme.baseSoft, boxShadow: "inset 0 1px 2px rgba(0,0,0,0.06)" }} />
      <div className="absolute rounded-t-md" style={{ left: "6%", right: "6%", top: "6%", height: "9%", background: theme.base }} />
      <div
        className="absolute"
        style={{
          left: "16%",
          right: "12%",
          top: "26%",
          bottom: "16%",
          backgroundImage: `repeating-linear-gradient(to bottom, transparent 0 10px, ${t.detail(0.18)} 10px 11px)`,
        }}
      />
      <div className="absolute" style={{ left: "22%", top: "20%", bottom: "14%", width: "1px", background: t.detail(0.35) }} />
      <div className="absolute" style={{ right: "6%", top: "6%", width: 0, height: 0, borderTop: "16px solid rgba(0,0,0,0.12)", borderLeft: "16px solid transparent" }} />
    </>
  );
}

/** Rascunhos: papel cinza, espiral no topo e traços de rascunho sutis. */
export function DraftFace({ theme }: FaceProps) {
  const t = tones(theme);
  const loops = [22, 33, 44, 55, 66, 77, 88];
  return (
    <>
      <div className="absolute inset-x-[6%] bottom-[6%] top-[11%] rounded-md" style={{ background: theme.baseSoft, boxShadow: "inset 0 1px 2px rgba(0,0,0,0.06)" }} />
      <div className="absolute left-[6%] right-[6%] top-[10%]" style={{ height: "1px", background: t.detail(0.25) }} />
      <svg viewBox="0 0 100 14" preserveAspectRatio="none" className="absolute left-[6%] right-[6%] top-[3%] h-[10%] w-[88%]" fill="none" aria-hidden="true">
        <g stroke={t.detail(0.5)} strokeWidth="1.6" strokeLinecap="round">
          {loops.map((x) => (
            <path key={x} d={`M${x} 1 q4 7 0 12`} />
          ))}
        </g>
      </svg>
      <svg viewBox="0 0 100 120" preserveAspectRatio="none" className="absolute inset-x-[14%] top-[26%] h-[52%]" fill="none" aria-hidden="true">
        <g stroke={t.detail(0.3)} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="62" height="22" rx="3" strokeDasharray="5 4" />
          <line x1="6" y1="44" x2="70" y2="44" />
          <line x1="6" y1="58" x2="52" y2="58" />
          <rect x="70" y="40" width="24" height="24" rx="2" strokeDasharray="5 4" />
        </g>
      </svg>
    </>
  );
}

/** Cards: pilha real de cards horizontais; o frontal é branco com 2 linhas. */
export function CardsDeckFace({ theme }: FaceProps) {
  const t = tones(theme);
  return (
    <>
      <Depth theme={theme} />
      <div
        className="absolute rounded-md"
        style={{ left: "22%", right: "14%", top: "30%", height: "16%", background: t.hi(0.22), transform: "rotate(-5deg)" }}
      />
      <div
        className="absolute rounded-md"
        style={{ left: "15%", right: "17%", top: "40%", height: "18%", background: t.hi(0.4), transform: "rotate(2.5deg)" }}
      />
      <div
        className="absolute rounded-md bg-white"
        style={{ left: "13%", right: "15%", top: "50%", height: "24%", boxShadow: "0 4px 10px rgba(0,0,0,0.18)" }}
      >
        <div className="absolute left-[12%] right-[20%] top-[34%]" style={{ height: "2px", background: "rgba(15,23,42,0.22)" }} />
        <div className="absolute left-[12%] right-[40%] top-[60%]" style={{ height: "2px", background: "rgba(15,23,42,0.15)" }} />
      </div>
    </>
  );
}

/** Mapa de face por estilo de capa. */
export const coverFaces: Record<CoverStyle, (props: FaceProps) => JSX.Element> = {
  portfolio: PortfolioFace,
  project: ProjectFace,
  notebook: NotebookFace,
  note: NoteFace,
  draft: DraftFace,
  "cards-deck": CardsDeckFace,
};
