import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronDown, MessageSquareText, PackageX, PenLine, X } from "lucide-react";
import { Breadcrumb, type BreadcrumbItem } from "@/modules/site/components/Breadcrumb";
import { Pagination } from "@/modules/site/components/Pagination";
import { ProductCard, ProductCardSkeleton } from "@/modules/site/components/ProductCard";
import { ProductImage } from "@/modules/site/components/ProductImage";
import { RatingBreakdown } from "@/modules/site/components/RatingBreakdown";
import { ReviewCard, ReviewCardSkeleton } from "@/modules/site/components/ReviewCard";
import { StarRating } from "@/modules/site/components/StarRating";
import { Button } from "@/shared/components/button";
import { buttonVariants } from "@/shared/components/button-variants";
import { EmptyState, ErrorState } from "@/shared/components/state";
import { formatInteger, formatNote, pluralize } from "@/shared/utils/format";
import { cn } from "@/shared/utils/utils";
import { CreateReview } from "./create-review/CreateReview";
import { RELATED_SIZE, REVIEWS_PAGE_SIZE, useProductDetailModel } from "./product-detail.model";

type ProductDetailViewProps = ReturnType<typeof useProductDetailModel>;

const REVIEWS_LIST_ID = "lista-avaliacoes";

const selectClass =
  "h-11 w-full appearance-none rounded-lg border border-line-strong bg-surface pl-3.5 pr-10 text-sm font-medium text-ink hover:border-ink focus:border-brand-600 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-600/35";

const starsLabel = (note: number) => `${note} ${note === 1 ? "estrela" : "estrelas"}`;

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
  categorySlug,
  images,
  currentImage,
  selectedImage,
  setSelectedImage,
  totalReviews,
  averageNote,
  distribution,
  isLoadingSummary,
  reviews,
  reviewsPage,
  reviewsTotalPages,
  reviewsTotalElements,
  isLoadingReviews,
  isFetchingReviews,
  isErrorReviews,
  refetchReviews,
  onReviewsPageChange,
  reviewsHeadingRef,
  noteFilter,
  reviewSort,
  reviewSortOptions,
  onNoteFilterChange,
  onReviewSortChange,
  clearReviewFilters,
  isReviewFiltered,
  helpful,
  helpfulAnnouncement,
  relatedProducts,
  isLoadingRelated,
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

  const breadcrumb: BreadcrumbItem[] = [];
  if (product.categoryName) {
    breadcrumb.push({
      label: product.categoryName,
      link: categorySlug
        ? (children, className) => (
            <Link to="/categorias/$slug" params={{ slug: categorySlug }} className={className}>
              {children}
            </Link>
          )
        : undefined,
    });
  }
  if (product.subCategorieName) {
    breadcrumb.push({
      label: product.subCategorieName,
      link: (children, className) =>
        categorySlug ? (
          <Link
            to="/categorias/$slug"
            params={{ slug: categorySlug }}
            search={{ sub: product.subCategorieId }}
            className={className}
          >
            {children}
          </Link>
        ) : (
          <Link to="/products" search={{ sub: product.subCategorieId }} className={className}>
            {children}
          </Link>
        ),
    });
  }
  breadcrumb.push({ label: product.name });

  const hasReviews = totalReviews > 0;
  const firstReviewIndex = reviewsPage * REVIEWS_PAGE_SIZE + 1;

  const reviewsStatus = isLoadingReviews
    ? ""
    : noteFilter
      ? `${pluralize(reviewsTotalElements, "avaliação", "avaliações")} com ${starsLabel(noteFilter)}`
      : reviewsTotalPages > 1
        ? `Mostrando avaliações a partir da ${firstReviewIndex}ª, página ${reviewsPage + 1} de ${reviewsTotalPages}`
        : "";

  return (
    <div className="container-page py-8 sm:py-10">
      <Breadcrumb items={breadcrumb} />

      {/* Produto */}
      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <ProductImage
            name={product.name}
            src={currentImage?.urlImage}
            seed={product.id}
            size="hero"
            loading="eager"
            className="aspect-[4/3] w-full rounded-3xl border border-line"
          />
          {images.length > 1 && (
            <ul className="mt-3 flex flex-wrap gap-2" aria-label="Fotos do produto">
              {images.map((image, idx) => (
                <li key={image.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    aria-pressed={selectedImage === idx}
                    className={cn(
                      "block overflow-hidden rounded-xl border-2 transition-colors",
                      selectedImage === idx ? "border-brand-600" : "border-line hover:border-line-strong",
                    )}
                  >
                    <ProductImage
                      name={product.name}
                      src={image.urlImage}
                      alt={`Foto ${idx + 1} de ${images.length}`}
                      size="thumb"
                      className="h-16 w-16"
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col">
          {(product.categoryName || product.subCategorieName) && (
            <p className="flex flex-wrap items-center gap-2 text-sm">
              {product.categoryName &&
                (categorySlug ? (
                  <Link
                    to="/categorias/$slug"
                    params={{ slug: categorySlug }}
                    className="font-semibold text-muted underline-offset-4 hover:text-ink hover:underline"
                  >
                    {product.categoryName}
                  </Link>
                ) : (
                  <span className="font-semibold text-muted">{product.categoryName}</span>
                ))}
              {product.categoryName && product.subCategorieName && (
                <span aria-hidden="true" className="text-muted">
                  ·
                </span>
              )}
              {product.subCategorieName &&
                (categorySlug ? (
                  <Link
                    to="/categorias/$slug"
                    params={{ slug: categorySlug }}
                    search={{ sub: product.subCategorieId }}
                    className="rounded-full bg-brand-50 px-3 py-1 font-semibold text-brand-800 hover:bg-brand-100"
                  >
                    {product.subCategorieName}
                  </Link>
                ) : (
                  <span className="rounded-full bg-brand-50 px-3 py-1 font-semibold text-brand-800">
                    {product.subCategorieName}
                  </span>
                ))}
            </p>
          )}
          <h1 className="mt-3 text-4xl font-bold leading-tight text-ink sm:text-5xl">{product.name}</h1>

          <div className="mt-4 flex min-h-[1.75rem] flex-wrap items-center gap-x-3 gap-y-1">
            {isLoadingSummary ? (
              <span className="skeleton h-5 w-56" aria-hidden="true" />
            ) : hasReviews ? (
              <>
                <StarRating value={averageNote} size="md" />
                <span className="font-display text-xl font-bold text-ink" aria-hidden="true">
                  {formatNote(averageNote)}
                </span>
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
      <section
        aria-labelledby="avaliacoes-title"
        id="avaliacoes"
        tabIndex={-1}
        className="mt-16 border-t border-line pt-12 focus:outline-none sm:mt-20"
      >
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
                  {isLoadingSummary ? (
                    <div className="space-y-2" aria-hidden="true">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div key={i} className="skeleton h-4 w-full" />
                      ))}
                    </div>
                  ) : (
                    <>
                      <p className="mb-2 text-xs text-muted">Escolha uma nota para filtrar as avaliações.</p>
                      <RatingBreakdown
                        distribution={distribution}
                        total={totalReviews}
                        selected={noteFilter}
                        onSelect={onNoteFilterChange}
                        controls={REVIEWS_LIST_ID}
                      />
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
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <h2
                id="avaliacoes-title"
                ref={reviewsHeadingRef}
                tabIndex={-1}
                className="text-3xl font-bold text-ink focus:outline-none"
              >
                Avaliações
                {hasReviews && (
                  <span className="ml-2 font-sans text-lg font-medium text-muted">({formatInteger(totalReviews)})</span>
                )}
              </h2>
              {hasReviews && (
                <div className="sm:w-52">
                  <label htmlFor="review-sort" className="mb-1.5 block text-sm font-semibold text-ink">
                    Ordenar avaliações
                  </label>
                  <div className="relative">
                    <select
                      id="review-sort"
                      value={reviewSort}
                      onChange={(e) => onReviewSortChange(e.target.value)}
                      aria-controls={REVIEWS_LIST_ID}
                      className={selectClass}
                    >
                      {reviewSortOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      aria-hidden="true"
                      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                    />
                  </div>
                </div>
              )}
            </div>

            {noteFilter && (
              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-muted">Filtro ativo:</span>
                <button
                  type="button"
                  onClick={() => onNoteFilterChange(undefined)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-brand-300 bg-brand-50 px-3 font-semibold text-brand-800 hover:border-brand-600"
                >
                  Somente {starsLabel(noteFilter)}
                  <X aria-hidden="true" className="h-4 w-4" />
                  <span className="sr-only">(remover filtro)</span>
                </button>
              </div>
            )}

            <p className="sr-only" role="status" aria-live="polite">
              {reviewsStatus}
            </p>
            <p className="sr-only" aria-live="polite">
              {helpfulAnnouncement}
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
                isReviewFiltered ? (
                  <EmptyState
                    icon={<MessageSquareText />}
                    title={`Nenhuma avaliação com ${starsLabel(noteFilter ?? 0)}`}
                    description="Tente outra nota ou veja todas as avaliações deste produto."
                    headingLevel="h3"
                    action={
                      <Button color="outline" onClick={clearReviewFilters}>
                        Ver todas as avaliações
                      </Button>
                    }
                  />
                ) : (
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
                )
              ) : (
                <ul
                  id={REVIEWS_LIST_ID}
                  aria-label={noteFilter ? `Avaliações com ${starsLabel(noteFilter)}` : "Avaliações"}
                  aria-busy={isFetchingReviews}
                  className={cn("space-y-4 transition-opacity", isFetchingReviews && "opacity-60")}
                >
                  {reviews.map((review) => (
                    <li key={review.id}>
                      <ReviewCard review={review} helpful={helpful} />
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

      {/* Mesma subcategoria */}
      {product.subCategorieName && (isLoadingRelated || relatedProducts.length > 0) && (
        <section aria-labelledby="relacionados-title" className="mt-16 border-t border-line pt-12 sm:mt-20">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-700">Continue explorando</p>
              <h2 id="relacionados-title" className="mt-1 text-2xl font-bold text-ink sm:text-3xl">
                Outros produtos em {product.subCategorieName}
              </h2>
            </div>
            {categorySlug && (
              <Link
                to="/categorias/$slug"
                params={{ slug: categorySlug }}
                search={{ sub: product.subCategorieId }}
                className={cn(buttonVariants({ color: "outline" }), "self-start sm:self-auto")}
              >
                Ver todos em {product.subCategorieName}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            )}
          </div>
          {isLoadingRelated ? (
            <div className="grid gap-6 xs:grid-cols-2 lg:grid-cols-4" aria-hidden="true">
              {Array.from({ length: RELATED_SIZE }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <ul className="grid gap-6 xs:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
};
