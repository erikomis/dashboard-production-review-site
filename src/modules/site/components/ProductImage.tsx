import { useState } from "react";
import { Package } from "lucide-react";
import { cn } from "@/shared/utils/utils";

type ImageSize = "thumb" | "card" | "hero";

interface ProductImageProps {
  name: string;
  src?: string | null;
  /** Texto alternativo. Padrão: "Foto do produto {name}". Use "" quando a imagem só repete o texto ao lado. */
  alt?: string;
  /** Usado para variar o tom do placeholder de forma estável */
  seed?: number;
  /** Rótulo pequeno do placeholder (ex.: subcategoria) */
  caption?: string | null;
  className?: string;
  size?: ImageSize;
  /** "eager" para a imagem principal da página (acima da dobra) */
  loading?: "lazy" | "eager";
}

const TONES = [
  "from-brand-100 via-brand-50 to-[#F5F7FB]",
  "from-[#E0F2FE] via-[#F0F9FF] to-brand-50",
  "from-[#EDE9FE] via-[#F5F3FF] to-brand-50",
  "from-[#FEF3C7] via-[#FFFBEB] to-brand-50",
];

const PHOTO_PADDING: Record<ImageSize, string> = {
  thumb: "p-1.5",
  card: "p-5",
  hero: "p-8 sm:p-12",
};

/**
 * Foto do produto ou placeholder quando não há imagem.
 * As fotos são de embalagens (Open Food Facts) em proporções variadas: mostramos a
 * imagem inteira (object-contain) sobre um fundo neutro; o mix-blend-multiply faz o
 * fundo branco das fotos se fundir ao fundo do card.
 */
export const ProductImage = ({
  name,
  src,
  alt,
  seed = 0,
  caption,
  className,
  size = "card",
  loading = "lazy",
}: ProductImageProps) => {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (src && failedSrc !== src) {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_40%,#FFFFFF_0%,#F1F4F9_100%)]",
          className,
        )}
      >
        <img
          src={src}
          alt={alt ?? `Foto do produto ${name}`}
          loading={loading}
          decoding="async"
          onError={() => setFailedSrc(src)}
          className={cn("h-full w-full object-contain mix-blend-multiply", PHOTO_PADDING[size])}
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br",
        TONES[Math.abs(seed) % TONES.length],
        className,
      )}
    >
      <span
        className="absolute inset-0 opacity-60 [background-image:radial-gradient(rgba(40,53,144,0.12)_1px,transparent_1px)] [background-size:14px_14px]"
      />
      <span
        className={cn(
          "absolute flex items-center justify-center bg-surface/80 text-brand-700 shadow-card backdrop-blur",
          size === "hero" ? "h-20 w-20 rounded-2xl" : size === "card" ? "h-12 w-12 rounded-2xl" : "h-8 w-8 rounded-lg",
        )}
      >
        <Package
          className={size === "hero" ? "h-9 w-9" : size === "card" ? "h-6 w-6" : "h-4 w-4"}
          strokeWidth={1.5}
        />
      </span>
      {caption && size !== "thumb" && (
        <span className="absolute bottom-3 left-3 rounded-full bg-surface/85 px-2.5 py-1 text-xs font-semibold text-ink-soft">
          {caption}
        </span>
      )}
    </div>
  );
};
