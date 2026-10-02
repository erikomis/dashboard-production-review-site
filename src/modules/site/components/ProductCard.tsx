import { Link } from "@tanstack/react-router";
import type { Product } from "@/shared/types/product";
import type { ReviewSummary } from "@/shared/types/review";
import { formatNote, pluralize } from "@/shared/utils/format";
import { StarRating } from "./StarRating";
import { ProductImage } from "./ProductImage";

interface Props {
  product: Product;
  summary?: ReviewSummary;
  headingLevel?: "h2" | "h3";
}

export const ProductCard = ({ product, summary, headingLevel: Heading = "h3" }: Props) => {
  const total = summary?.totalReviews ?? 0;
  const image = product.productImages?.[0]?.urlImage;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card transition-shadow focus-within:shadow-raised hover:shadow-raised">
      <ProductImage
        name={product.name}
        src={image}
        seed={product.id}
        caption={product.subCategorie?.name}
        className="aspect-[4/3] w-full"
      />
      <div className="flex flex-1 flex-col p-5">
        <Heading className="text-lg font-semibold leading-snug text-ink">
          {/* O link cobre o card inteiro (::after), mantendo um único ponto de foco */}
          <Link
            to="/products/$slug"
            params={{ slug: product.slug }}
            className="after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:outline-none group-hover:text-brand-700 focus-visible:after:outline focus-visible:after:outline-[3px] focus-visible:after:outline-offset-2 focus-visible:after:outline-brand-600"
          >
            {product.name}
          </Link>
        </Heading>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">{product.description}</p>
        <div className="mt-auto flex items-center gap-2 pt-4 text-sm">
          {!summary ? (
            <span className="skeleton h-4 w-32" aria-hidden="true" />
          ) : total > 0 ? (
            <>
              <StarRating value={summary.averageNote} size="sm" />
              <span className="font-semibold text-ink">{formatNote(summary.averageNote)}</span>
              <span className="text-muted">({pluralize(total, "avaliação", "avaliações")})</span>
            </>
          ) : (
            <span className="text-muted">Ainda sem avaliações</span>
          )}
        </div>
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
