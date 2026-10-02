import { Link } from "@tanstack/react-router";
import type { ProductSummary } from "@/shared/types/product";
import { ProductImage } from "./ProductImage";
import { ProductRating } from "./ProductRating";

interface Props {
  product: ProductSummary;
  headingLevel?: "h2" | "h3";
}

export const ProductCard = ({ product, headingLevel: Heading = "h3" }: Props) => (
  <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card transition-shadow focus-within:shadow-raised hover:shadow-raised">
    <ProductImage
      name={product.name}
      src={product.imageUrl}
      seed={product.id}
      className="aspect-[4/3] w-full border-b border-line"
    />
    <div className="flex flex-1 flex-col p-5">
      {product.subCategorieName && (
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted">{product.subCategorieName}</p>
      )}
      <Heading className="text-lg font-semibold leading-snug text-ink">
        {/* O link cobre o card inteiro (::after), mantendo um único ponto de foco */}
        <Link
          to="/products/$slug"
          params={{ slug: product.slug }}
          className="line-clamp-2 after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:outline-none group-hover:text-brand-700 focus-visible:after:outline focus-visible:after:outline-[3px] focus-visible:after:outline-offset-2 focus-visible:after:outline-brand-600"
        >
          {product.name}
        </Link>
      </Heading>
      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">{product.description}</p>
      <div className="mt-auto pt-4">
        <ProductRating averageNote={product.averageNote} totalReviews={product.totalReviews} />
      </div>
    </div>
  </article>
);

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
