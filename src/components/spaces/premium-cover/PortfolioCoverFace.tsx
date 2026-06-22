type PortfolioThemeId =
  | "purple"
  | "blue"
  | "green"
  | "guava"
  | "black"
  | "brown"
  | "beige"
  | "gray"
  | "white";

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
    base: "#2A123F",
    base2: "#6D2AD7",
    spine: "#1A0B2B",
    spine2: "#5A21A8",
    frame: "#D9A94D",
    frameSoft: "rgba(217,169,77,.42)",
    text: "#F4D38A",
    mutedText: "#F7E8C2",
    ribbon: "#9F55B8",
    ribbon2: "#5C237C",
    plate: "#24102F",
    plateBorder: "#C99946",
    shadow: "rgba(33, 13, 52, .45)",
  },
  blue: {
    name: "Azul Sábio",
    base: "#10283E",
    base2: "#1F4A68",
    spine: "#061522",
    spine2: "#12334A",
    frame: "#D9A94D",
    frameSoft: "rgba(217,169,77,.40)",
    text: "#F4D38A",
    mutedText: "#F7E8C2",
    ribbon: "#365A78",
    ribbon2: "#102C46",
    plate: "#091723",
    plateBorder: "#C99946",
    shadow: "rgba(6, 21, 34, .45)",
  },
  green: {
    name: "Verde Floresta",
    base: "#163522",
    base2: "#246640",
    spine: "#0C2114",
    spine2: "#1A4C2D",
    frame: "#D9A94D",
    frameSoft: "rgba(217,169,77,.38)",
    text: "#F4D38A",
    mutedText: "#F7E8C2",
    ribbon: "#2C7048",
    ribbon2: "#12351F",
    plate: "#0E2416",
    plateBorder: "#C99946",
    shadow: "rgba(12, 33, 20, .45)",
  },
  guava: {
    name: "Goiaba",
    base: "#662638",
    base2: "#A84262",
    spine: "#3A1420",
    spine2: "#842F4C",
    frame: "#D9A94D",
    frameSoft: "rgba(217,169,77,.40)",
    text: "#F4D38A",
    mutedText: "#F7E8C2",
    ribbon: "#C26A7F",
    ribbon2: "#8E314D",
    plate: "#3D1724",
    plateBorder: "#C99946",
    shadow: "rgba(58, 20, 32, .45)",
  },
  black: {
    name: "Preto Carvão",
    base: "#111111",
    base2: "#2A2A28",
    spine: "#050505",
    spine2: "#1A1A18",
    frame: "#D9A94D",
    frameSoft: "rgba(217,169,77,.38)",
    text: "#F4D38A",
    mutedText: "#F7E8C2",
    ribbon: "#2B2B2A",
    ribbon2: "#101010",
    plate: "#090909",
    plateBorder: "#C99946",
    shadow: "rgba(0,0,0,.50)",
  },
  brown: {
    name: "Marrom Café",
    base: "#3A2519",
    base2: "#6B4328",
    spine: "#24150E",
    spine2: "#4B2B1A",
    frame: "#D9A94D",
    frameSoft: "rgba(217,169,77,.38)",
    text: "#F4D38A",
    mutedText: "#F7E8C2",
    ribbon: "#6E432C",
    ribbon2: "#341D12",
    plate: "#22130D",
    plateBorder: "#C99946",
    shadow: "rgba(36, 21, 14, .48)",
  },
  beige: {
    name: "Bege Areia",
    base: "#E9DDC3",
    base2: "#F7EEDB",
    spine: "#D2BE96",
    spine2: "#F1E2C0",
    frame: "#B88938",
    frameSoft: "rgba(184,137,56,.34)",
    text: "#7B5523",
    mutedText: "#5B3D18",
    ribbon: "#E6C887",
    ribbon2: "#C89A45",
    plate: "#F5E9D0",
    plateBorder: "#B88938",
    shadow: "rgba(87, 61, 27, .22)",
  },
  gray: {
    name: "Cinza Neblina",
    base: "#8C8980",
    base2: "#B9B4A8",
    spine: "#6C6962",
    spine2: "#A29C90",
    frame: "#C8AD6D",
    frameSoft: "rgba(200,173,109,.34)",
    text: "#59452A",
    mutedText: "#463929",
    ribbon: "#B9B4AA",
    ribbon2: "#7B776F",
    plate: "#A7A198",
    plateBorder: "#9C7A3C",
    shadow: "rgba(54, 51, 47, .28)",
  },
  white: {
    name: "Branco",
    base: "#F6F1E6",
    base2: "#FFFDF8",
    spine: "#E5D8C0",
    spine2: "#FFF7E7",
    frame: "#CBA45A",
    frameSoft: "rgba(203,164,90,.32)",
    text: "#8A6428",
    mutedText: "#5A4320",
    ribbon: "#F0D89F",
    ribbon2: "#D4A64F",
    plate: "#FFF7E7",
    plateBorder: "#B98D3E",
    shadow: "rgba(87, 61, 27, .18)",
  },
};

function TrophyLaurel({ frame }: { frame: string }) {
  return (
    <svg
      viewBox="0 0 220 170"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="portfolioGold" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#FFF1B8" />
          <stop offset="38%" stopColor={frame} />
          <stop offset="72%" stopColor="#9F6B1D" />
          <stop offset="100%" stopColor="#FFE49A" />
        </linearGradient>

        <filter id="portfolioEmboss" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.2" floodOpacity=".45" />
          <feDropShadow
            dx="0"
            dy="-1"
            stdDeviation=".6"
            floodColor="#fff"
            floodOpacity=".22"
          />
        </filter>
      </defs>

      <circle cx="110" cy="84" r="60" fill="none" stroke={frame} strokeWidth="1.5" opacity=".5" />
      <circle cx="110" cy="84" r="52" fill="rgba(0,0,0,.12)" stroke={frame} strokeWidth="2" opacity=".6" />
      <circle cx="110" cy="84" r="45" fill="none" stroke={frame} strokeWidth="1" opacity=".35" />

      <path
        d="M110 12l4.5 9.2 10.1 1.5-7.3 7.1 1.7 10-9-4.8-9 4.8 1.7-10-7.3-7.1 10.1-1.5L110 12z"
        fill="url(#portfolioGold)"
        filter="url(#portfolioEmboss)"
      />
      <path
        d="M76 30l2.5 5.1 5.6.8-4 3.9.9 5.5-5-2.6-5 2.6.9-5.5-4-3.9 5.6-.8L76 30z"
        fill="url(#portfolioGold)"
        opacity=".9"
      />
      <path
        d="M144 30l2.5 5.1 5.6.8-4 3.9.9 5.5-5-2.6-5 2.6.9-5.5-4-3.9 5.6-.8L144 30z"
        fill="url(#portfolioGold)"
        opacity=".9"
      />

      <path d="M110 142 C133 135 147 110 150 60" fill="none" stroke="url(#portfolioGold)" strokeWidth="2.4" strokeLinecap="round" opacity=".85" />
      <path d="M110 142 C87 135 73 110 70 60" fill="none" stroke="url(#portfolioGold)" strokeWidth="2.4" strokeLinecap="round" opacity=".85" />

      <ellipse cx="151" cy="122" rx="4" ry="9" fill="url(#portfolioGold)" opacity=".95" transform="rotate(-16 151 122)" filter="url(#portfolioEmboss)" />
      <ellipse cx="156" cy="108" rx="4" ry="9" fill="url(#portfolioGold)" opacity=".95" transform="rotate(-26 156 108)" filter="url(#portfolioEmboss)" />
      <ellipse cx="160" cy="94" rx="4" ry="9" fill="url(#portfolioGold)" opacity=".95" transform="rotate(-36 160 94)" filter="url(#portfolioEmboss)" />
      <ellipse cx="161" cy="80" rx="4" ry="9" fill="url(#portfolioGold)" opacity=".95" transform="rotate(-48 161 80)" filter="url(#portfolioEmboss)" />
      <ellipse cx="159" cy="66" rx="4" ry="9" fill="url(#portfolioGold)" opacity=".95" transform="rotate(-58 159 66)" filter="url(#portfolioEmboss)" />
      <ellipse cx="154" cy="53" rx="3.6" ry="8" fill="url(#portfolioGold)" opacity=".95" transform="rotate(-70 154 53)" filter="url(#portfolioEmboss)" />

      <ellipse cx="69" cy="122" rx="4" ry="9" fill="url(#portfolioGold)" opacity=".95" transform="rotate(16 69 122)" filter="url(#portfolioEmboss)" />
      <ellipse cx="64" cy="108" rx="4" ry="9" fill="url(#portfolioGold)" opacity=".95" transform="rotate(26 64 108)" filter="url(#portfolioEmboss)" />
      <ellipse cx="60" cy="94" rx="4" ry="9" fill="url(#portfolioGold)" opacity=".95" transform="rotate(36 60 94)" filter="url(#portfolioEmboss)" />
      <ellipse cx="59" cy="80" rx="4" ry="9" fill="url(#portfolioGold)" opacity=".95" transform="rotate(48 59 80)" filter="url(#portfolioEmboss)" />
      <ellipse cx="61" cy="66" rx="4" ry="9" fill="url(#portfolioGold)" opacity=".95" transform="rotate(58 61 66)" filter="url(#portfolioEmboss)" />
      <ellipse cx="66" cy="53" rx="3.6" ry="8" fill="url(#portfolioGold)" opacity=".95" transform="rotate(70 66 53)" filter="url(#portfolioEmboss)" />

      <g filter="url(#portfolioEmboss)">
        <path
          d="M82 66c-13 0-21 7-21 18 0 12 9 21 23 23"
          fill="none"
          stroke="url(#portfolioGold)"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M138 66c13 0 21 7 21 18 0 12-9 21-23 23"
          fill="none"
          stroke="url(#portfolioGold)"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M83 58h54c-1 35-10 54-27 54S84 93 83 58z"
          fill="url(#portfolioGold)"
          stroke="#8C5A18"
          strokeWidth="1.2"
        />
        <path d="M102 112h16v18h-16z" fill="url(#portfolioGold)" />
        <path d="M89 132h42v10H89z" fill="url(#portfolioGold)" rx="3" />
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
      <div
        className="absolute inset-0 opacity-[.10] mix-blend-overlay"
        style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, rgba(255,255,255,.06) 0 1px, transparent 1px 4px),
            repeating-linear-gradient(-45deg, rgba(0,0,0,.05) 0 1px, transparent 1px 5px)
          `,
        }}
      />

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
    "guava",
    "black",
    "brown",
    "beige",
    "gray",
    "white",
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
