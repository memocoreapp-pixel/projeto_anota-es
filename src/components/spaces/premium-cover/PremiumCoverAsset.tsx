type PremiumCoverAssetProps = {
  /** Caminho da imagem oficial da capa (PNG/WebP). */
  src: string;
  alt: string;
  title?: string;
  count?: number;
  countLabel?: string;
  themeName?: string;
  className?: string;
};

/**
 * Exibe uma capa premium a partir de um asset de imagem oficial.
 * Não recria a arte: apenas apresenta a imagem com proporção 2/3, cantos
 * arredondados, sombra premium e sem overlay pesado. Título/contador/tema
 * aparecem como legenda discreta abaixo (a arte aprovada é a fonte visual).
 */
export function PremiumCoverAsset({
  src,
  alt,
  title,
  count,
  countLabel = "itens",
  themeName,
  className = "",
}: PremiumCoverAssetProps) {
  const hasCaption = Boolean(title || themeName || count != null);

  return (
    <figure className={["flex flex-col items-center gap-3", className].join(" ")}>
      <div
        className="relative w-[200px] aspect-[2/3] overflow-hidden rounded-[22px]"
        style={{
          boxShadow:
            "0 18px 34px rgba(33, 13, 52, .28), 0 2px 6px rgba(0,0,0,.18), inset 0 1px 0 rgba(255,255,255,.18)",
        }}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {hasCaption && (
        <figcaption className="text-center">
          {title && (
            <div className="text-sm font-semibold text-zinc-800">
              {title}
              {count != null ? ` · ${count} ${countLabel}` : ""}
            </div>
          )}
          {themeName && (
            <div className="text-xs text-zinc-500">{themeName}</div>
          )}
        </figcaption>
      )}
    </figure>
  );
}
