import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { MessageSquareText, Star } from "lucide-react";
import type { ProductSummary } from "@/shared/types/product";
import { formatNote, pluralize } from "@/shared/utils/format";
import { ProductImage } from "./ProductImage";
import { StarRating } from "./StarRating";

interface Props {
  product: ProductSummary;
  headingLevel?: "h2" | "h3";
  /** Ação extra no rodapé do card (ex.: "Deixar de seguir"); fica acima do link que cobre o card */
  action?: ReactNode;
}

export const ProductCard = ({ product, headingLevel: Heading = "h3", action }: Props) => {
  const rated = product.totalReviews > 0 && product.averageNote !== null;
  return (
    <article className="lift group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card focus-within:shadow-raised hover:border-brand-300/60 hover:shadow-raised">
      <div className="relative">
        <ProductImage
          name={product.name}
          src={product.imageUrl}
          seed={product.id}
          className="aspect-[4/3] w-full border-b border-line"
        />
        {rated && (
          <span
            aria-hidden="true"
            className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-sm font-bold text-[#1C2434] shadow-card ring-1 ring-black/5"
          >
            <Star className="h-3.5 w-3.5 fill-star text-star" strokeWidth={1.5} />
            {formatNote(product.averageNote!)}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {(product.categoryName || product.subCategorieName) && (
          <p className="mb-1.5 truncate text-xs font-semibold uppercase tracking-wider text-muted">
            {product.subCategorieName ?? product.categoryName}
          </p>
        )}
        <Heading className="text-lg font-semibold leading-snug text-ink">
          {/* O link cobre o card inteiro (::after), mantendo um único ponto de foco */}
          <Link
            to="/products/$slug"
            params={{ slug: product.slug }}
            className="line-clamp-2 after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:outline-none group-hover:text-brand-700 focus-visible:after:outline focus-visible:after:outline-[3px] focus-visible:after:outline-offset-2 focus-visible:after:outline-[var(--focus-ring)]"
          >
            {product.name}
          </Link>
        </Heading>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">{product.description}</p>
        <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-4 text-sm">
          {rated ? (
            <>
              <StarRating value={product.averageNote!} size="sm" />
              <span className="font-semibold text-ink" aria-hidden="true">
                {formatNote(product.averageNote!)}
              </span>
              <span className="inline-flex items-center gap-1 text-muted">
                <MessageSquareText aria-hidden="true" className="h-3.5 w-3.5" />
                {pluralize(product.totalReviews, "avaliação", "avaliações")}
              </span>
            </>
          ) : (
            <span className="text-muted">Ainda sem avaliações · seja o primeiro</span>
          )}
        </div>
        {action && <div className="relative z-10 mt-4 border-t border-line pt-4">{action}</div>}
      </div>
    </article>
  );
};

export const ProductCardSkeleton = () => (
  <div aria-hidden="true" className="overflow-hidden rounded-2xl border border-line bg-surface">
    <div className="skeleton aspect-[4/3] w-full rounded-none" />
    <div className="space-y-3 p-5">
      <div className="skeleton h-5 w-3/4" />
      <div className="skeleton h-3.5 w-full" />
      <div className="skeleton h-3.5 w-2/3" />
      <div className="skeleton mt-4 h-4 w-32" />
    </div>
  </div>
);
