import { useId } from "react";

type PortfolioThemeId =
  | "purple"
  | "blue"
  | "green"
  | "wine"
  | "black"
  | "brown"
  | "beige"
  | "gray";

type PortfolioCoverFaceProps = {
  title?: string;
  count?: number;
  countLabel?: string;
  theme?: PortfolioThemeId;
  className?: string;
};

const portfolioThemes: Record<
  PortfolioThemeId,
  {
    name: string;
    base: string;
    base2: string;
    spine: string;
    spine2: string;
    frame: string;
    frameSoft: string;
    text: string;
    mutedText: string;
    ribbon: string;
    ribbon2: string;
    plate: string;
    plateBorder: string;
    shadow: string;
  }
> = {
  purple: {
    name: "Púrpura Real",
    base: "#2E1248",
    base2: "#6A2BCB",
    spine: "#1B0A30",
    spine2: "#4E1F95",
    frame: "#E0B85C",
    frameSoft: "rgba(224,184,92,.42)",
    text: "#F6D88E",
    mutedText: "#F8EAC6",
    ribbon: "#8A45B0",
    ribbon2: "#4E1F86",
    plate: "#251036",
    plateBorder: "#C99946",
    shadow: "rgba(28, 10, 48, .45)",
  },
  blue: {
    name: "Azul Sábio",
    base: "#102A44",
    base2: "#234E72",
    spine: "#0A1B2D",
    spine2: "#143653",
    frame: "#E0B85C",
    frameSoft: "rgba(224,184,92,.40)",
    text: "#F6D88E",
    mutedText: "#F8EAC6",
    ribbon: "#2E5170",
    ribbon2: "#0F2942",
    plate: "#0B1B2A",
    plateBorder: "#C99946",
    shadow: "rgba(8, 20, 34, .45)",
  },
  green: {
    name: "Verde Floresta",
    base: "#14361F",
    base2: "#235C36",
    spine: "#0C2114",
    spine2: "#1A4427",
    frame: "#E0B85C",
    frameSoft: "rgba(224,184,92,.38)",
    text: "#F6D88E",
    mutedText: "#F8EAC6",
    ribbon: "#2A6A44",
    ribbon2: "#123420",
    plate: "#0F2616",
    plateBorder: "#C99946",
    shadow: "rgba(10, 30, 18, .45)",
  },
  wine: {
    name: "Vinho Clássico",
    base: "#491522",
    base2: "#7C2433",
    spine: "#2F0D15",
    spine2: "#5E1B28",
    frame: "#E0B85C",
    frameSoft: "rgba(224,184,92,.40)",
    text: "#F6D88E",
    mutedText: "#F8EAC6",
    ribbon: "#8E3140",
    ribbon2: "#4A141F",
    plate: "#350F17",
    plateBorder: "#C99946",
    shadow: "rgba(40, 12, 20, .46)",
  },
  black: {
    name: "Preto Carvão",
    base: "#16161B",
    base2: "#2E2E34",
    spine: "#0A0A0D",
    spine2: "#1C1C20",
    frame: "#E0B85C",
    frameSoft: "rgba(224,184,92,.38)",
    text: "#F6D88E",
    mutedText: "#F8EAC6",
    ribbon: "#2C2C30",
    ribbon2: "#111114",
    plate: "#0C0C10",
    plateBorder: "#C99946",
    shadow: "rgba(0,0,0,.50)",
  },
  brown: {
    name: "Marrom Café",
    base: "#3A2418",
    base2: "#654129",
    spine: "#241509",
    spine2: "#46291A",
    frame: "#E0B85C",
    frameSoft: "rgba(224,184,92,.38)",
    text: "#F6D88E",
    mutedText: "#F8EAC6",
    ribbon: "#6E432C",
    ribbon2: "#341D12",
    plate: "#20130C",
    plateBorder: "#C99946",
    shadow: "rgba(36, 21, 14, .48)",
  },
  beige: {
    name: "Bege Areia",
    base: "#E7DCC4",
    base2: "#F6EEDB",
    spine: "#CDBA94",
    spine2: "#EFE0BE",
    frame: "#A9802F",
    frameSoft: "rgba(169,128,47,.40)",
    text: "#6B4E22",
    mutedText: "#5A4018",
    ribbon: "#DCC288",
    ribbon2: "#B98F3F",
    plate: "#F3E8CF",
    plateBorder: "#A9802F",
    shadow: "rgba(80, 58, 26, .22)",
  },
  gray: {
    name: "Cinza Neblina",
    base: "#8B8880",
    base2: "#BAB5AA",
    spine: "#6B685F",
    spine2: "#A19B8F",
    frame: "#9C7A3C",
    frameSoft: "rgba(156,122,60,.40)",
    text: "#4A3D29",
    mutedText: "#3C3122",
    ribbon: "#B7B2A8",
    ribbon2: "#7A766E",
    plate: "#A6A097",
    plateBorder: "#9C7A3C",
    shadow: "rgba(54, 51, 47, .28)",
  },
};

function TrophyLaurel({ frame }: { frame: string }) {
  const rawId = useId().replace(/:/g, "");
  const goldId = `portfolioGold-${rawId}`;
  const softGoldId = `portfolioSoftGold-${rawId}`;
  const embossId = `portfolioEmboss-${rawId}`;
  const darkEmbossId = `portfolioDarkEmboss-${rawId}`;

  const leftLeaves = [
    { x: 54, y: 103, r: -46, s: 0.86 },
    { x: 49, y: 92, r: -55, s: 0.92 },
    { x: 47, y: 80, r: -65, s: 1 },
    { x: 49, y: 68, r: -76, s: 1.05 },
    { x: 54, y: 57, r: -87, s: 1.02 },
    { x: 62, y: 47, r: -100, s: 0.96 },
    { x: 73, y: 39, r: -114, s: 0.88 },
  ];

  const rightLeaves = [
    { x: 166, y: 103, r: 46, s: 0.86 },
    { x: 171, y: 92, r: 55, s: 0.92 },
    { x: 173, y: 80, r: 65, s: 1 },
    { x: 171, y: 68, r: 76, s: 1.05 },
    { x: 166, y: 57, r: 87, s: 1.02 },
    { x: 158, y: 47, r: 100, s: 0.96 },
    { x: 147, y: 39, r: 114, s: 0.88 },
  ];

  return (
    <svg
      viewBox="0 0 220 170"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={goldId} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#FFF3BF" />
          <stop offset="26%" stopColor="#E5BD61" />
          <stop offset="52%" stopColor={frame} />
          <stop offset="76%" stopColor="#9B671F" />
          <stop offset="100%" stopColor="#FFE8A3" />
        </linearGradient>

        <linearGradient id={softGoldId} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#FFF6CC" />
          <stop offset="48%" stopColor={frame} />
          <stop offset="100%" stopColor="#8F5E1D" />
        </linearGradient>

        <filter id={embossId} x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="1.1"
            floodColor="#000"
            floodOpacity=".42"
          />
          <feDropShadow
            dx="0"
            dy="-0.8"
            stdDeviation=".5"
            floodColor="#fff"
            floodOpacity=".20"
          />
        </filter>

        <filter id={darkEmbossId} x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow
            dx="0"
            dy="2.2"
            stdDeviation="1.4"
            floodColor="#000"
            floodOpacity=".48"
          />
        </filter>
      </defs>

      <circle
        cx="110"
        cy="82"
        r="60"
        fill="rgba(0,0,0,.08)"
        stroke={`url(#${goldId})`}
        strokeWidth="1.7"
        opacity=".88"
        filter={`url(#${darkEmbossId})`}
      />

      <circle
        cx="110"
        cy="82"
        r="49"
        fill="rgba(255,255,255,.025)"
        stroke={`url(#${softGoldId})`}
        strokeWidth="1"
        opacity=".55"
      />

      <g filter={`url(#${embossId})`}>
        <path
          d="M110 13.5l4.4 8.8 9.7 1.4-7 6.8 1.7 9.6-8.8-4.6-8.8 4.6 1.7-9.6-7-6.8 9.7-1.4 4.4-8.8z"
          fill={`url(#${goldId})`}
        />
        <path
          d="M78.5 33.5l2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.5 5-.7 2.2-4.5z"
          fill={`url(#${goldId})`}
          opacity=".88"
        />
        <path
          d="M141.5 33.5l2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.5 5-.7 2.2-4.5z"
          fill={`url(#${goldId})`}
          opacity=".88"
        />
      </g>

      <path
        d="M83 128C55 116 39 90 45 62"
        fill="none"
        stroke={`url(#${softGoldId})`}
        strokeWidth="2"
        strokeLinecap="round"
        opacity=".9"
      />
      <path
        d="M137 128c28-12 44-38 38-66"
        fill="none"
        stroke={`url(#${softGoldId})`}
        strokeWidth="2"
        strokeLinecap="round"
        opacity=".9"
      />

      <g filter={`url(#${embossId})`}>
        {leftLeaves.map((leaf, index) => (
          <path
            key={`left-leaf-${index}`}
            d="M0 0C8-5 16-4 21 1C14 5 7 7 0 0Z"
            fill={`url(#${goldId})`}
            opacity=".96"
            transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.r}) scale(${leaf.s})`}
          />
        ))}
      </g>

      <g filter={`url(#${embossId})`}>
        {rightLeaves.map((leaf, index) => (
          <path
            key={`right-leaf-${index}`}
            d="M0 0C-8-5-16-4-21 1C-14 5-7 7 0 0Z"
            fill={`url(#${goldId})`}
            opacity=".96"
            transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.r}) scale(${leaf.s})`}
          />
        ))}
      </g>

      <path
        d="M88 128c10 8 34 8 44 0"
        fill="none"
        stroke={`url(#${softGoldId})`}
        strokeWidth="2"
        strokeLinecap="round"
        opacity=".82"
      />

      <g filter={`url(#${embossId})`}>
        <path
          d="M83 66c-12.5 0-20.5 7.5-20.5 18.2 0 12.4 9.2 22 23.4 24.5"
          fill="none"
          stroke={`url(#${goldId})`}
          strokeWidth="6.4"
          strokeLinecap="round"
        />
        <path
          d="M137 66c12.5 0 20.5 7.5 20.5 18.2 0 12.4-9.2 22-23.4 24.5"
          fill="none"
          stroke={`url(#${goldId})`}
          strokeWidth="6.4"
          strokeLinecap="round"
        />
        <path
          d="M83.8 58.5h52.4c-.8 17.4-4.1 31.2-9.8 40.2-4.3 6.8-9.7 10.2-16.4 10.2s-12.1-3.4-16.4-10.2c-5.7-9-9-22.8-9.8-40.2z"
          fill={`url(#${goldId})`}
          stroke="#7A4A13"
          strokeWidth="1.2"
        />
        <path
          d="M91 65.5c2.5 18.8 8.6 31.5 18.8 36.2"
          fill="none"
          stroke="rgba(255,255,255,.34)"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <path d="M102.5 109h15v18h-15z" fill={`url(#${goldId})`} />
        <path
          d="M88.5 128.5h43c2 0 3.5 1.5 3.5 3.5v6.5h-50V132c0-2 1.5-3.5 3.5-3.5z"
          fill={`url(#${goldId})`}
          stroke="#7A4A13"
          strokeWidth="1"
        />
      </g>
    </svg>
  );
}

export function PortfolioCoverFace({
  title = "Portfólios",
  count = 8,
  countLabel = "itens",
  theme = "purple",
  className = "",
}: PortfolioCoverFaceProps) {
  const t = portfolioThemes[theme];
  const rawId = useId().replace(/:/g, "");
  const grainId = `leather-${rawId}`;

  return (
    <div
      className={[
        "relative isolate overflow-hidden rounded-[22px]",
        "w-[200px] aspect-[2/3]",
        "select-none",
        className,
      ].join(" ")}
      style={{
        color: t.text,
        boxShadow: `0 18px 34px ${t.shadow}, inset 0 1px 0 rgba(255,255,255,.18)`,
        background: `
          radial-gradient(circle at 68% 14%, rgba(255,255,255,.20), transparent 24%),
          radial-gradient(circle at 18% 72%, rgba(255,255,255,.07), transparent 28%),
          linear-gradient(135deg, ${t.base2} 0%, ${t.base} 42%, ${t.base} 100%)
        `,
      }}
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[.22] mix-blend-soft-light"
        aria-hidden="true"
      >
        <filter id={grainId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${grainId})`} />
      </svg>

      <div
        className="absolute left-0 top-0 h-full w-[34px]"
        style={{
          background: `linear-gradient(90deg, ${t.spine} 0%, ${t.spine2} 48%, rgba(255,255,255,.12) 52%, ${t.spine} 100%)`,
          boxShadow:
            "inset -6px 0 10px rgba(0,0,0,.22), inset 3px 0 5px rgba(255,255,255,.12)",
        }}
      />
      <div
        className="absolute left-[30px] top-0 h-full w-px"
        style={{ background: t.frameSoft }}
      />
      <div
        className="absolute left-[9px] top-8 h-px w-16"
        style={{ background: t.frame }}
      />
      <div
        className="absolute left-[9px] bottom-8 h-px w-16"
        style={{ background: t.frame }}
      />

      <div
        className="absolute inset-[18px] rounded-[14px]"
        style={{
          border: `1px solid ${t.frame}`,
          boxShadow:
            "inset 0 0 0 1px rgba(0,0,0,.18), 0 0 0 1px rgba(255,255,255,.07)",
        }}
      />
      <div
        className="absolute inset-[23px] rounded-[11px] opacity-50"
        style={{ border: `1px solid ${t.frameSoft}` }}
      />

      <div
        className="absolute right-[30px] top-0 h-[58px] w-[25px]"
        style={{
          background: `linear-gradient(90deg, ${t.ribbon2}, ${t.ribbon}, ${t.ribbon2})`,
          boxShadow:
            "0 5px 10px rgba(0,0,0,.28), inset 0 0 0 1px rgba(255,255,255,.18)",
        }}
      >
        <div
          className="absolute inset-x-0 bottom-[-12px] h-[14px]"
          style={{
            background: `linear-gradient(135deg, ${t.ribbon2} 0 48%, transparent 49% 51%, ${t.ribbon2} 52% 100%)`,
            clipPath: "polygon(0 0, 50% 65%, 100% 0, 100% 100%, 0 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            borderLeft: `1px solid ${t.frame}`,
            borderRight: `1px solid ${t.frame}`,
          }}
        />
      </div>

      <div
        className="absolute left-1/2 top-[38px] z-10 -translate-x-1/2 rounded-[4px] px-3 py-1 text-[5.8px] font-semibold uppercase tracking-[.18em] opacity-80"
        style={{
          background: `linear-gradient(180deg, ${t.plate}, rgba(0,0,0,.12))`,
          border: `1px solid ${t.frameSoft}`,
          color: t.mutedText,
          boxShadow: "0 2px 5px rgba(0,0,0,.18)",
        }}
      >
        Plano · Execução · Excelência
      </div>

      <div className="absolute left-1/2 top-[84px] h-[108px] w-[142px] -translate-x-1/2">
        <TrophyLaurel frame={t.frame} />
      </div>

      <div className="absolute inset-x-0 bottom-[40px] z-10 px-6 text-center">
        <div
          className="font-serif text-[28px] leading-none tracking-[-.03em]"
          style={{
            color: t.text,
            textShadow: "0 2px 6px rgba(0,0,0,.35)",
          }}
        >
          {title}
        </div>

        <div className="mt-2 flex items-center justify-center gap-2">
          <span className="h-px w-8" style={{ background: t.frame }} />
          <span className="text-[8px]" style={{ color: t.frame }}>
            ◆
          </span>
          <span className="h-px w-8" style={{ background: t.frame }} />
        </div>

        <div
          className="mt-1 text-[12px] font-medium"
          style={{
            color: t.mutedText,
            textShadow: "0 1px 4px rgba(0,0,0,.25)",
          }}
        >
          {count} {countLabel}
        </div>
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,.08), transparent 24%, rgba(0,0,0,.18) 100%)",
        }}
      />
    </div>
  );
}

export function PortfolioCoverColorGrid() {
  const themes: PortfolioThemeId[] = [
    "purple",
    "blue",
    "green",
    "wine",
    "black",
    "brown",
    "beige",
    "gray",
  ];

  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
      {themes.map((theme) => (
        <div key={theme} className="flex flex-col items-center gap-3">
          <PortfolioCoverFace theme={theme} />
          <div className="text-center">
            <div className="text-sm font-semibold text-zinc-800">
              {portfolioThemes[theme].name}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
