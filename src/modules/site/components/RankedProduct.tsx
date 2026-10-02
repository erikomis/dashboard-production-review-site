import { Link } from "@tanstack/react-router";
import type { ProductSummary } from "@/shared/types/product";
import { formatNote, pluralize } from "@/shared/utils/format";
import { cn } from "@/shared/utils/utils";
import { ProductImage } from "./ProductImage";
import { StarRating } from "./StarRating";

interface RankedProductProps {
  product: ProductSummary;
  /** Posição no ranking, base 1 */
  position: number;
  /** "compact" para listas da home */
  variant?: "default" | "compact";
  /** Destaca o número usado na ordenação (nota ou total de avaliações) */
  metric?: "rating" | "reviews";
  headingLevel?: "h2" | "h3" | "h4";
}

// Pódio em tons suaves (texto com contraste AA sobre o fundo)
const PODIUM = [
  "bg-cream text-[#92400E] ring-2 ring-star/60", // 1º — âmbar das estrelas
  "bg-[#E2E8F0] text-ink", // 2º — prata
  "bg-[#FFEDD5] text-[#9A3412]", // 3º — bronze
];

/** Linha do ranking: posição, foto, nome, categoria e nota. O link cobre a linha inteira. */
export const RankedProduct = ({
  product,
  position,
  variant = "default",
  metric = "rating",
  headingLevel: Heading = "h3",
}: RankedProductProps) => {
  const compact = variant === "compact";
  const note = product.averageNote ?? 0;
  return (
    <article
      className={cn(
        "group relative flex items-center gap-3 rounded-2xl border border-line bg-surface shadow-card transition-shadow focus-within:shadow-raised hover:shadow-raised sm:gap-4",
        compact ? "p-3" : "p-3 sm:p-4",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full font-display font-bold tabular-nums",
          compact ? "h-8 w-8 text-sm" : "h-10 w-10 text-base sm:h-12 sm:w-12 sm:text-lg",
          PODIUM[position - 1] ?? "bg-brand-50 text-brand-800",
        )}
      >
        {position}
      </span>
      <ProductImage
        name={product.name}
        src={product.imageUrl}
        alt=""
        seed={product.id}
        size="thumb"
        className={cn("shrink-0 rounded-xl border border-line", compact ? "h-14 w-14" : "h-16 w-16 sm:h-20 sm:w-20")}
      />
      <div className="min-w-0 flex-1">
        <Heading className={cn("font-sans font-semibold leading-snug text-ink", compact ? "text-sm" : "text-base sm:text-lg")}>
          <Link
            to="/products/$slug"
            params={{ slug: product.slug }}
            className="line-clamp-2 after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:outline-none group-hover:text-brand-700 focus-visible:after:outline focus-visible:after:outline-[3px] focus-visible:after:outline-offset-2 focus-visible:after:outline-brand-600"
          >
            <span className="sr-only">{position}º lugar: </span>
            {product.name}
          </Link>
        </Heading>
        {!compact && (product.categoryName || product.subCategorieName) && (
          <p className="mt-0.5 truncate text-sm text-muted">
            {[product.categoryName, product.subCategorieName].filter(Boolean).join(" › ")}
          </p>
        )}
        <p className={cn("flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm", compact ? "mt-1" : "mt-1.5")}>
          <StarRating value={note} size="sm" />
          <span className={cn("font-semibold text-ink", metric === "rating" && !compact && "text-base")} aria-hidden="true">
            {formatNote(note)}
          </span>
          <span className={cn(metric === "reviews" ? "font-semibold text-ink" : "text-muted")}>
            {metric === "reviews"
              ? pluralize(product.totalReviews, "avaliação", "avaliações")
              : `(${pluralize(product.totalReviews, "avaliação", "avaliações")})`}
          </span>
        </p>
      </div>
      {!compact && (
        <p className="hidden shrink-0 text-right sm:block" aria-hidden="true">
          <span className="block font-display text-3xl font-bold leading-none text-ink">{formatNote(note)}</span>
          <span className="text-xs text-muted">de 5</span>
        </p>
      )}
    </article>
  );
};

export const RankedProductSkeleton = ({ compact }: { compact?: boolean }) => (
  <div aria-hidden="true" className={cn("flex items-center gap-4 rounded-2xl border border-line bg-surface", compact ? "p-3" : "p-4")}>
    <div className={cn("skeleton shrink-0 rounded-full", compact ? "h-8 w-8" : "h-12 w-12")} />
    <div className={cn("skeleton shrink-0 rounded-xl", compact ? "h-14 w-14" : "h-20 w-20")} />
    <div className="flex-1 space-y-2">
      <div className="skeleton h-4 w-3/4" />
      <div className="skeleton h-3.5 w-1/2" />
    </div>
  </div>
);
