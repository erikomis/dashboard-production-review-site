import { useState } from "react";
import { Package } from "lucide-react";
import { cn } from "@/shared/utils/utils";

interface ProductImageProps {
  name: string;
  src?: string | null;
  /** Usado para variar o tom do placeholder de forma estável */
  seed?: number;
  /** Rótulo pequeno do placeholder (ex.: subcategoria) */
  caption?: string;
  className?: string;
  size?: "card" | "hero";
}

const TONES = [
  "from-brand-100 via-brand-50 to-[#F5F7FB]",
  "from-[#E0F2FE] via-[#F0F9FF] to-brand-50",
  "from-[#EDE9FE] via-[#F5F3FF] to-brand-50",
  "from-[#FEF3C7] via-[#FFFBEB] to-brand-50",
];

/** Imagem do produto ou placeholder elegante quando não há imagem. */
export const ProductImage = ({ name, src, seed = 0, caption, className, size = "card" }: ProductImageProps) => {
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return (
      <div className={cn("overflow-hidden bg-surface", className)}>
        <img
          src={src}
          alt={name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
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
          "absolute flex items-center justify-center rounded-2xl bg-surface/80 text-brand-700 shadow-card backdrop-blur",
          size === "hero" ? "h-20 w-20" : "h-12 w-12",
        )}
      >
        <Package className={size === "hero" ? "h-9 w-9" : "h-6 w-6"} strokeWidth={1.5} />
      </span>
      {caption && (
        <span className="absolute bottom-3 left-3 rounded-full bg-surface/85 px-2.5 py-1 text-xs font-semibold text-ink-soft">
          {caption}
        </span>
      )}
    </div>
  );
};
