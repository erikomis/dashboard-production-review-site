import { Link } from "@tanstack/react-router";
import { ArrowRight, Layers, MessageSquareText, Quote, Trophy } from "lucide-react";
import { ProductCard, ProductCardSkeleton } from "@/modules/site/components/ProductCard";
import { ReviewCard, ReviewCardSkeleton } from "@/modules/site/components/ReviewCard";
import { RankedProduct, RankedProductSkeleton } from "@/modules/site/components/RankedProduct";
import type { ProductSummary } from "@/shared/types/product";
import { StarRating } from "@/modules/site/components/StarRating";
import { SearchForm } from "@/modules/site/layout/SearchForm";
import { buttonVariants } from "@/shared/components/button-variants";
import { EmptyState, ErrorState } from "@/shared/components/state";
import { formatDate, formatInteger, getInitials } from "@/shared/utils/format";
import { cn } from "@/shared/utils/utils";
import { FEATURED_SIZE, RECENT_REVIEWS_SIZE, TOP_SIZE, useHomeModel } from "./home.model";

type HomeViewProps = ReturnType<typeof useHomeModel>;

const SectionHeader = ({
  id,
  eyebrow,
  title,
  description,
  action,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) => (
  <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div className="max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-wider text-brand-700">{eyebrow}</p>
      <h2 id={id} className="mt-1 text-3xl font-bold text-ink sm:text-[2.1rem]">
        {title}
      </h2>
      {description && <p className="mt-2 text-muted">{description}</p>}
    </div>
    {action}
  </div>
);

const TopList = ({
  id,
  title,
  description,
  products,
  metric,
  isLoading,
  isError,
  onRetry,
}: {
  id: string;
  title: string;
  description: string;
  products: ProductSummary[];
  metric: "rating" | "reviews";
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}) => (
  <div className="rounded-3xl border border-line bg-surface p-5 shadow-card sm:p-6">
    <h3 id={id} className="text-xl font-bold text-ink">
      {title}
    </h3>
    <p className="mt-1 text-sm text-muted">{description}</p>
    <div className="mt-5">
      {isError ? (
        <ErrorState message="Não conseguimos carregar esta lista." onRetry={onRetry} />
      ) : isLoading ? (
        <div className="space-y-3" aria-hidden="true">
          {Array.from({ length: 3 }).map((_, i) => (
            <RankedProductSkeleton key={i} compact />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="rounded-2xl bg-canvas px-4 py-6 text-center text-sm text-muted">
          Ainda não há produtos avaliados. Que tal ser o primeiro?
        </p>
      ) : (
        <ol className="space-y-3" aria-labelledby={id}>
          {products.map((product, idx) => (
            <li key={product.id}>
              <RankedProduct product={product} position={idx + 1} variant="compact" metric={metric} headingLevel="h4" />
            </li>
          ))}
        </ol>
      )}
    </div>
  </div>
);

export const HomeView = (props: HomeViewProps) => {
  const {
    searchTerm,
    setSearchTerm,
    onSearchSubmit,
    isAuthenticated,
    products,
    totalProducts,
    isLoadingProducts,
    isErrorProducts,
    refetchProducts,
    categories,
    isLoadingCategories,
    isErrorCategories,
    refetchCategories,
    topRated,
    totalRated,
    isLoadingTopRated,
    isErrorTopRated,
    refetchTopRated,
    mostReviewed,
    isLoadingMostReviewed,
    isErrorMostReviewed,
    refetchMostReviewed,
    recentReviews,
    highlightReview,
    totalReviews,
    isLoadingReviews,
    isErrorReviews,
    refetchReviews,
  } = props;

  const stats = [
    { value: totalProducts, label: "produtos no catálogo" },
    { value: totalReviews, label: "avaliações publicadas" },
    { value: categories.length || undefined, label: "categorias" },
  ];

  return (
    <>
      {/* HERO */}
      <section aria-labelledby="hero-title" className="on-dark relative overflow-hidden bg-brand-950 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-brand-600/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-48 left-1/3 h-[24rem] w-[24rem] rounded-full bg-sky-400/15 blur-3xl"
        />
        <div className="container-page relative grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm font-medium text-brand-100">
              <StarRating value={5} size="sm" decorative />
              Avaliações de quem usou de verdade
            </p>
            <h1 id="hero-title" className="mt-5 text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
              Opiniões reais para <span className="text-brand-200">escolhas melhores.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-brand-100">
              Leia o que outras pessoas acharam antes de comprar e conte como foi a sua experiência.
            </p>
            <SearchForm
              id="hero-search"
              size="lg"
              tone="dark"
              value={searchTerm}
              onChange={setSearchTerm}
              onSubmit={onSearchSubmit}
              className="mt-8 max-w-xl"
            />
            <dl className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-white/10 pt-6">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col">
                  <dt className="text-sm text-brand-100">{s.label}</dt>
                  <dd className="order-first font-display text-3xl font-bold text-white">
                    {s.value === undefined ? "—" : formatInteger(s.value)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Destaque: a avaliação real mais recente bem avaliada */}
          <div className="relative hidden lg:block">
            {highlightReview ? (
              <figure className="relative rotate-[-1.5deg] rounded-3xl bg-surface p-7 text-ink shadow-raised">
                <Quote aria-hidden="true" className="absolute -top-5 right-8 h-10 w-10 fill-brand-200 text-brand-200" />
                <StarRating value={highlightReview.note} size="md" />
                <blockquote className="mt-4">
                  <p className="font-display text-2xl font-semibold leading-snug">“{highlightReview.title}”</p>
                  <p className="mt-3 line-clamp-3 leading-relaxed text-ink-soft">{highlightReview.description}</p>
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                  <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-800">
                    {getInitials(highlightReview.userName)}
                  </span>
                  <span className="text-sm">
                    <span className="block font-semibold">{highlightReview.userName ?? "Usuário"}</span>
                    <span className="text-muted">
                      sobre {highlightReview.productName} · {formatDate(highlightReview.createdAt)}
                    </span>
                  </span>
                </figcaption>
              </figure>
            ) : (
              <div aria-hidden="true" className="skeleton h-72 rounded-3xl bg-white/10" />
            )}
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section aria-labelledby="categorias-title" id="categorias" tabIndex={-1} className="container-page pt-16 focus:outline-none sm:pt-20">
        <SectionHeader
          id="categorias-title"
          eyebrow="Navegue por categoria"
          title="Encontre o que você procura"
          description="Escolha uma categoria ou subcategoria para ver os produtos e o que as pessoas estão dizendo."
        />
        {isErrorCategories ? (
          <ErrorState message="Não conseguimos carregar as categorias." onRetry={() => refetchCategories()} />
        ) : isLoadingCategories ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton h-40 rounded-2xl" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <EmptyState title="Nenhuma categoria por aqui ainda" icon={<Layers />} headingLevel="h3" />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, idx) => (
              <li
                key={category.id}
                className={cn(
                  "flex flex-col rounded-2xl border border-line p-6",
                  idx % 2 === 0 ? "bg-brand-50" : "bg-surface",
                )}
              >
                <h3 className="text-xl font-semibold text-ink">
                  <Link
                    to="/categorias/$slug"
                    params={{ slug: category.slug }}
                    className="inline-flex items-center gap-1.5 underline-offset-4 hover:text-brand-700 hover:underline"
                  >
                    {category.name}
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                </h3>
                {category.description && <p className="mt-1 text-sm text-muted">{category.description}</p>}
                {category.subCategories.length > 0 ? (
                  <ul className="mt-5 flex flex-wrap gap-2" aria-label={`Subcategorias de ${category.name}`}>
                    {category.subCategories.map((sub) => (
                      <li key={sub.id}>
                        <Link
                          to="/categorias/$slug"
                          params={{ slug: category.slug }}
                          search={{ sub: sub.id }}
                          className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line-strong/40 bg-surface px-4 text-sm font-semibold text-ink transition-colors hover:border-brand-600 hover:text-brand-700"
                        >
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-5 text-sm text-muted">Sem subcategorias no momento.</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* RANKING */}
      <section aria-labelledby="ranking-title" className="container-page pt-16 sm:pt-20">
        <SectionHeader
          id="ranking-title"
          eyebrow="Ranking da comunidade"
          title="Os favoritos de quem avalia"
          description="Produtos com as melhores notas e os que mais geraram conversa."
          action={
            <Link to="/ranking" className={cn(buttonVariants({ color: "outline" }), "self-start sm:self-auto")}>
              <Trophy aria-hidden="true" className="h-4 w-4" />
              Ver ranking completo
              {totalRated !== undefined && totalRated > TOP_SIZE && (
                <span className="text-muted">({formatInteger(totalRated)})</span>
              )}
            </Link>
          }
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <TopList
            id="top-nota-title"
            title="Mais bem avaliados"
            description="Maior nota média. No empate, vence quem tem mais avaliações."
            products={topRated}
            metric="rating"
            isLoading={isLoadingTopRated}
            isError={isErrorTopRated}
            onRetry={() => refetchTopRated()}
          />
          <TopList
            id="top-total-title"
            title="Mais avaliados"
            description="Os produtos com mais avaliações publicadas."
            products={mostReviewed}
            metric="reviews"
            isLoading={isLoadingMostReviewed}
            isError={isErrorMostReviewed}
            onRetry={() => refetchMostReviewed()}
          />
        </div>
      </section>

      {/* DESTAQUES */}
      <section aria-labelledby="destaques-title" className="container-page pt-16 sm:pt-20">
        <SectionHeader
          id="destaques-title"
          eyebrow="Em destaque"
          title="Produtos recém-chegados"
          description="Os últimos produtos adicionados, com a nota média da comunidade."
          action={
            <Link to="/products" className={cn(buttonVariants({ color: "outline" }), "self-start sm:self-auto")}>
              Ver todos os produtos
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          }
        />
        {isErrorProducts ? (
          <ErrorState message="Não conseguimos carregar os produtos." onRetry={() => refetchProducts()} />
        ) : isLoadingProducts ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
            {Array.from({ length: FEATURED_SIZE }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
            <span className="sr-only" role="status">Carregando produtos…</span>
          </div>
        ) : products.length === 0 ? (
          <EmptyState title="Nenhum produto cadastrado ainda" headingLevel="h3" />
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* AVALIAÇÕES RECENTES */}
      <section aria-labelledby="recentes-title" id="avaliacoes-recentes" tabIndex={-1} className="container-page pt-16 focus:outline-none sm:pt-20">
        <SectionHeader
          id="recentes-title"
          eyebrow="Da comunidade"
          title="Avaliações recentes"
          description="O que as pessoas estão dizendo agora."
        />
        {isErrorReviews ? (
          <ErrorState message="Não conseguimos carregar as avaliações." onRetry={() => refetchReviews()} />
        ) : isLoadingReviews ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" aria-busy="true">
            {Array.from({ length: 3 }).map((_, i) => (
              <ReviewCardSkeleton key={i} />
            ))}
          </div>
        ) : recentReviews.length === 0 ? (
          <EmptyState
            title="Ainda não há avaliações"
            description="Seja a primeira pessoa a avaliar um produto."
            icon={<MessageSquareText />}
            headingLevel="h3"
          />
        ) : (
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {recentReviews.slice(0, RECENT_REVIEWS_SIZE).map((review) => (
              <li key={review.id}>
                <ReviewCard review={review} showProduct />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* CTA */}
      <section aria-labelledby="cta-title" className="container-page pt-16 sm:pt-20">
        <div className="relative overflow-hidden rounded-3xl bg-brand-50 px-6 py-12 sm:px-12">
          <div aria-hidden="true" className="absolute -right-6 -top-10 hidden font-display text-[14rem] font-bold leading-none text-brand-600/10 md:block">
            ★
          </div>
          <div className="relative max-w-2xl">
            <h2 id="cta-title" className="text-3xl font-bold text-ink sm:text-4xl">
              Já usou algum desses produtos?
            </h2>
            <p className="mt-3 text-lg text-ink-soft">
              Sua avaliação ajuda outras pessoas a decidir com mais segurança. Leva menos de um minuto.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/products" className={buttonVariants({ size: "lg" })}>
                Avaliar um produto
              </Link>
              {!isAuthenticated && (
                <Link to="/sign-up" className={buttonVariants({ color: "outline", size: "lg" })}>
                  Criar conta grátis
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
