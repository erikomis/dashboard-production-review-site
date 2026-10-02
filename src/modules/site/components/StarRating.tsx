import { Star } from "lucide-react";
import { cn } from "@/shared/utils/utils";
import { formatNote } from "@/shared/utils/format";

interface StarRatingProps {
  /** Nota de 0 a 5 (aceita decimais: 4,3 preenche 4 estrelas e 30% da quinta) */
  value: number;
  size?: "sm" | "md" | "lg";
  /** Texto para leitor de tela. Padrão: "Nota 4,0 de 5 estrelas" */
  label?: string;
  /** Apenas ornamento: escondido de leitores de tela */
  decorative?: boolean;
  className?: string;
}

const sizes = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-7 w-7" };

/** Exibição (somente leitura) de nota em estrelas. */
export const StarRating = ({ value, size = "md", label, decorative, className }: StarRatingProps) => {
  const safe = Math.max(0, Math.min(5, value || 0));
  return (
    <span
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : (label ?? `Nota ${formatNote(safe)} de 5 estrelas`)}
      className={cn("inline-flex items-center gap-0.5", className)}
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, safe - i));
        return (
          <span key={i} aria-hidden="true" className={cn("relative inline-block", sizes[size])}>
            <Star className={cn("absolute inset-0 fill-star-empty text-star-empty", sizes[size])} strokeWidth={1.5} />
            {fill > 0 && (
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className={cn("fill-star text-star", sizes[size])} strokeWidth={1.5} />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
};
