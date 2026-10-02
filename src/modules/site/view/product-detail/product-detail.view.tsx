import { Link } from "@tanstack/react-router";
import { MessageSquareText, PackageX, PenLine } from "lucide-react";
import { Breadcrumb, type BreadcrumbItem } from "@/modules/site/components/Breadcrumb";
import { Pagination } from "@/modules/site/components/Pagination";
import { ProductImage } from "@/modules/site/components/ProductImage";
import { RatingBreakdown } from "@/modules/site/components/RatingBreakdown";
import { ReviewCard, ReviewCardSkeleton } from "@/modules/site/components/ReviewCard";
import { StarRating } from "@/modules/site/components/StarRating";
import { buttonVariants } from "@/shared/components/button-variants";
import { EmptyState, ErrorState } from "@/shared/components/state";
import { formatInteger, formatNote, pluralize } from "@/shared/utils/format";
import { cn } from "@/shared/utils/utils";
import { CreateReview } from "./create-review/CreateReview";
import { DISTRIBUTION_SAMPLE_SIZE, REVIEWS_PAGE_SIZE, useProductDetailModel } from "./product-detail.model";

type ProductDetailViewProps = ReturnType<typeof useProductDetailModel>;

const DetailSkeleton = () => (
  <div className="container-page py-8 sm:py-10" aria-busy="true">
    <span role="status" className="sr-only">
      Carregando produto…
    </span>
    <div aria-hidden="true">
      <div className="skeleton h-4 w-64" />
      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="skeleton aspect-[4/3] w-full rounded-3xl" />
        <div className="space-y-4">
          <div className="skeleton h-6 w-28 rounded-full" />
          <div className="skeleton h-12 w-3/4" />
          <div className="skeleton h-5 w-48" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-5/6" />
          <div className="skeleton mt-6 h-12 w-48" />
        </div>
      </div>
    </div>
  </div>
);

export const ProductDetailView = ({
  product,
  isLoadingProduct,
  isErrorProduct,
  productError,
  refetchProduct,
  category,
  subCategory,
  totalReviews,
  averageNote,
  isLoadingSummary,
  reviews,
  reviewsPage,
  reviewsTotalPages,
  isLoadingReviews,
  isFetchingReviews,
  isErrorReviews,
  refetchReviews,
  onReviewsPageChange,
  reviewsHeadingRef,
  distribution,
  isLoadingDistribution,
  isAuthenticated,
  loginRedirect,
  onReviewCreated,
}: ProductDetailViewProps) => {
  if (isLoadingProduct) return <DetailSkeleton />;

  if (isErrorProduct) {
    return (
      <div className="container-page py-16">
        <h1 className="sr-only">Erro ao carregar o produto</h1>
        <ErrorState message={productError?.message} onRetry={() => refetchProduct()} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={<PackageX />}
          headingLevel="h1"
          title="Produto não encontrado"
          description="O produto que você procura pode ter sido removido ou o endereço está incorreto."
          action={
            <Link to="/products" className={buttonVariants()}>
              Ver todos os produtos
            </Link>
          }
        />
      </div>
    );
  }

  const breadcrumb: BreadcrumbItem[] = [
    {
      label: "Produtos",
      link: (children, className) => (
        <Link to="/products" className={className}>
          {children}
        </Link>
      ),
    },
  ];
  if (subCategory) {
    breadcrumb.push({
      label: subCategory.name,
      link: (children, className) => (
        <Link to="/products" search={{ sub: subCategory.id }} className={className}>
          {children}
        </Link>
      ),
    });
  }
  breadcrumb.push({ label: product.name });

  const hasReviews = totalReviews > 0;
  const firstReviewIndex = reviewsPage * REVIEWS_PAGE_SIZE + 1;

  return (
    <div className="container-page py-8 sm:py-10">
      <Breadcrumb items={breadcrumb} />

      {/* Produto */}
      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductImage
          name={product.name}
          src={product.imageUrl}
          seed={product.id}
          size="hero"
          className="aspect-[4/3] w-full rounded-3xl border border-line"
        />

        <div className="flex flex-col">
          {(category || subCategory) && (
            <p className="flex flex-wrap items-center gap-2 text-sm">
              {category && <span className="font-semibold text-muted">{category.name}</span>}
              {category && subCategory && <span aria-hidden="true" className="text-muted">·</span>}
              {subCategory && (
                <Link
                  to="/products"
                  search={{ sub: subCategory.id }}
                  className="rounded-full bg-brand-50 px-3 py-1 font-semibold text-brand-800 hover:bg-brand-100"
                >
                  {subCategory.name}
                </Link>
              )}
            </p>
          )}
          <h1 className="mt-3 text-4xl font-bold leading-tight text-ink sm:text-5xl">{product.name}</h1>

          <div className="mt-4 flex min-h-[1.75rem] flex-wrap items-center gap-x-3 gap-y-1">
            {isLoadingSummary ? (
              <span className="skeleton h-5 w-56" aria-hidden="true" />
            ) : hasReviews ? (
              <>
                <StarRating value={averageNote} size="md" />
                <span className="font-display text-xl font-bold text-ink">{formatNote(averageNote)}</span>
                <a href="#avaliacoes" className="link text-sm">
                  {pluralize(totalReviews, "avaliação", "avaliações")}
                </a>
              </>
            ) : (
              <span className="text-sm text-muted">Este produto ainda não tem avaliações.</span>
            )}
          </div>

          <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-ink-soft">{product.description}</p>

          <div className="mt-8 flex flex-wrap gap-3 border-t border-line pt-6">
            <a href="#avaliar" className={buttonVariants({ size: "lg" })}>
              <PenLine aria-hidden="true" className="h-5 w-5" />
              Escrever avaliação
            </a>
            {hasReviews && (
              <a href="#avaliacoes" className={buttonVariants({ size: "lg", color: "outline" })}>
                Ler avaliações
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Avaliações */}
      <section aria-labelledby="avaliacoes-title" id="avaliacoes" className="mt-16 border-t border-line pt-12 sm:mt-20">
        <div className="grid gap-10 lg:grid-cols-[20rem_1fr] lg:gap-14">
          <aside aria-label="Resumo das notas" className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-line bg-surface p-6 shadow-card">
              <p className="text-sm font-semibold uppercase tracking-wider text-muted">Nota média</p>
              {isLoadingSummary ? (
                <div className="skeleton mt-3 h-16 w-32" aria-hidden="true" />
              ) : (
                <div className="mt-2 flex items-end gap-3">
                  <span className="font-display text-6xl font-bold leading-none text-ink" aria-hidden="true">
                    {hasReviews ? formatNote(averageNote) : "–"}
                  </span>
                  <div className="pb-1">
                    <StarRating
                      value={averageNote}
                      size="md"
                      label={hasReviews ? `Nota média ${formatNote(averageNote)} de 5 estrelas` : "Sem avaliações"}
                    />
                    <p className="mt-1 text-sm text-muted">{pluralize(totalReviews, "avaliação", "avaliações")}</p>
                  </div>
                </div>
              )}

              {hasReviews && (
                <div className="mt-6">
                  {isLoadingDistribution ? (
                    <div className="space-y-2" aria-hidden="true">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div key={i} className="skeleton h-4 w-full" />
                      ))}
                    </div>
                  ) : (
                    <>
                      <RatingBreakdown counts={distribution.counts} sampleSize={distribution.sampleSize} />
                      {totalReviews > distribution.sampleSize && (
                        <p className="mt-3 text-xs text-muted">
                          Distribuição calculada com as {formatInteger(DISTRIBUTION_SAMPLE_SIZE)} avaliações mais recentes.
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}

              <a href="#avaliar" className={cn(buttonVariants({ color: "outline" }), "mt-6 w-full")}>
                Avaliar este produto
              </a>
            </div>
          </aside>

          <div>
            <h2
              id="avaliacoes-title"
              ref={reviewsHeadingRef}
              tabIndex={-1}
              className="text-3xl font-bold text-ink focus:outline-none"
            >
              Avaliações
              {hasReviews && <span className="ml-2 font-sans text-lg font-medium text-muted">({formatInteger(totalReviews)})</span>}
            </h2>
            <p className="sr-only" aria-live="polite">
              {!isLoadingReviews && reviewsTotalPages > 1
                ? `Mostrando avaliações a partir da ${firstReviewIndex}ª, página ${reviewsPage + 1} de ${reviewsTotalPages}`
                : ""}
            </p>

            <div className="mt-6">
              {isErrorReviews ? (
                <ErrorState message="Não conseguimos carregar as avaliações." onRetry={() => refetchReviews()} />
              ) : isLoadingReviews ? (
                <div className="space-y-4" aria-hidden="true">
                  <ReviewCardSkeleton />
                  <ReviewCardSkeleton />
                </div>
              ) : reviews.length === 0 ? (
                <EmptyState
                  icon={<MessageSquareText />}
                  title="Ninguém avaliou este produto ainda"
                  description="Conte como foi sua experiência e ajude quem está pesquisando."
                  headingLevel="h3"
                  action={
                    <a href="#avaliar" className={buttonVariants()}>
                      Ser o primeiro a avaliar
                    </a>
                  }
                />
              ) : (
                <ul className={cn("space-y-4 transition-opacity", isFetchingReviews && "opacity-60")}>
                  {reviews.map((review) => (
                    <li key={review.id}>
                      <ReviewCard review={review} />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Pagination
              page={reviewsPage}
              totalPages={reviewsTotalPages}
              onPageChange={onReviewsPageChange}
              label="Paginação das avaliações"
              className="mt-8"
            />
          </div>
        </div>
      </section>

      {/* Nova avaliação */}
      <section
        aria-labelledby="avaliar-title"
        id="avaliar"
        tabIndex={-1}
        className="mt-16 scroll-mt-24 focus:outline-none sm:mt-20"
      >
        <div className="mx-auto max-w-3xl">
          <h2 id="avaliar-title" className="text-3xl font-bold text-ink">
            Escreva sua avaliação
          </h2>
          <p className="mb-6 mt-2 text-muted">Conte para a comunidade o que você achou de {product.name}.</p>
          <CreateReview
            productId={product.id}
            productName={product.name}
            isAuthenticated={isAuthenticated}
            loginRedirect={loginRedirect}
            onCreated={onReviewCreated}
          />
        </div>
      </section>
    </div>
  );
};
