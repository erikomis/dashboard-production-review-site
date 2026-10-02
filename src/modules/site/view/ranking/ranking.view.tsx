import { Link } from "@tanstack/react-router";
import { Trophy } from "lucide-react";
import { Breadcrumb } from "@/modules/site/components/Breadcrumb";
import { FilterChips } from "@/modules/site/components/FilterChips";
import { Pagination } from "@/modules/site/components/Pagination";
import { RankedProduct, RankedProductSkeleton } from "@/modules/site/components/RankedProduct";
import { buttonVariants } from "@/shared/components/button-variants";
import { EmptyState, ErrorState } from "@/shared/components/state";
import { pluralize } from "@/shared/utils/format";
import { cn } from "@/shared/utils/utils";
import { useRankingModel } from "./ranking.model";

type RankingViewProps = ReturnType<typeof useRankingModel>;

const RESULTS_ID = "ranking-resultados";

export const RankingView = ({
  page,
  categoryId,
  categories,
  activeCategory,
  onCategoryChange,
  onPageChange,
  products,
  firstPosition,
  totalPages,
  totalElements,
  isLoading,
  isFetching,
  isError,
  error,
  refetch,
  resultsHeadingRef,
}: RankingViewProps) => {
  const resultText = isLoading
    ? "Carregando ranking…"
    : isError
      ? ""
      : totalElements === 0
        ? "Nenhum produto avaliado"
        : `${pluralize(totalElements, "produto avaliado", "produtos avaliados")}${
            activeCategory ? ` em ${activeCategory.name}` : ""
          }${totalPages > 1 ? ` · página ${page + 1} de ${totalPages}` : ""}`;

  return (
    <div className="container-page py-8 sm:py-10">
      <Breadcrumb items={[{ label: "Mais bem avaliados" }]} />

      <header className="mt-5 flex flex-col gap-4 rounded-3xl bg-brand-950 px-6 py-8 text-white on-dark sm:flex-row sm:items-center sm:px-10 sm:py-10">
        <span aria-hidden="true" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-brand-200">
          <Trophy className="h-7 w-7" />
        </span>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-200">Ranking da comunidade</p>
          <h1 className="mt-1 text-3xl font-bold sm:text-4xl">
            Mais bem avaliados{activeCategory && <span className="text-brand-200"> em {activeCategory.name}</span>}
          </h1>
          <p className="mt-2 max-w-2xl text-brand-100">
            Ordenados pela nota média das avaliações publicadas. Em caso de empate, aparece primeiro quem tem mais
            avaliações. Só entram produtos com pelo menos uma avaliação.
          </p>
        </div>
      </header>

      {categories.length > 0 && (
        <FilterChips
          label="Filtrar ranking por categoria"
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
          value={categoryId}
          onChange={onCategoryChange}
          allLabel="Todas as categorias"
          controls={RESULTS_ID}
          className="mt-6"
        />
      )}

      <section aria-labelledby="ranking-results-title" className="mt-8">
        <h2
          id="ranking-results-title"
          ref={resultsHeadingRef}
          tabIndex={-1}
          className="mb-5 font-sans text-base font-semibold text-ink focus:outline-none"
        >
          <span role="status" aria-live="polite">
            {resultText}
          </span>
        </h2>

        <div id={RESULTS_ID}>
          {isError ? (
            <ErrorState message={error?.message ?? "Não conseguimos carregar o ranking."} onRetry={() => refetch()} />
          ) : isLoading ? (
            <div className="space-y-3" aria-hidden="true">
              {Array.from({ length: 6 }).map((_, i) => (
                <RankedProductSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              icon={<Trophy />}
              title={activeCategory ? `Nenhum produto avaliado em ${activeCategory.name}` : "Nenhum produto avaliado ainda"}
              description="Assim que as primeiras avaliações forem publicadas, os produtos aparecem aqui."
              headingLevel="h3"
              action={
                activeCategory ? (
                  <Link to="/categorias/$slug" params={{ slug: activeCategory.slug }} className={buttonVariants()}>
                    Ver produtos de {activeCategory.name}
                  </Link>
                ) : (
                  <Link to="/products" className={buttonVariants()}>
                    Avaliar um produto
                  </Link>
                )
              }
            />
          ) : (
            <ol
              className={cn("space-y-3 transition-opacity", isFetching && "opacity-60")}
              aria-busy={isFetching}
              aria-label="Ranking de produtos"
            >
              {products.map((product, idx) => (
                <li key={product.id}>
                  <RankedProduct product={product} position={firstPosition + idx} />
                </li>
              ))}
            </ol>
          )}
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          label="Paginação do ranking"
          className="mt-10"
        />
      </section>
    </div>
  );
};
