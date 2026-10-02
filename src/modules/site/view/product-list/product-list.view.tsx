import { Link } from "@tanstack/react-router";
import { ChevronDown, PackageSearch, Search, X } from "lucide-react";
import { Breadcrumb } from "@/modules/site/components/Breadcrumb";
import { Pagination } from "@/modules/site/components/Pagination";
import { ProductCard, ProductCardSkeleton } from "@/modules/site/components/ProductCard";
import { Button } from "@/shared/components/button";
import { EmptyState, ErrorState } from "@/shared/components/state";
import { pluralize } from "@/shared/utils/format";
import { cn } from "@/shared/utils/utils";
import { PAGE_SIZE, SORT_OPTIONS, useProductListModel } from "./product-list.model";

type ProductListViewProps = ReturnType<typeof useProductListModel>;

const selectClass =
  "h-11 w-full appearance-none rounded-lg border border-line-strong bg-surface pl-3.5 pr-10 text-sm font-medium text-ink hover:border-ink focus:border-brand-600 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-600/35";

export const ProductListView = ({
  q,
  page,
  sort,
  subCategorieId,
  searchTerm,
  setSearchTerm,
  onSearchSubmit,
  onSortChange,
  onSubCategoryChange,
  onPageChange,
  clearFilters,
  isFiltered,
  subCategories,
  activeSubCategory,
  products,
  summaries,
  totalPages,
  totalElements,
  isLoading,
  isFetching,
  isError,
  error,
  refetch,
  resultsHeadingRef,
}: ProductListViewProps) => {
  const title = q ? `Resultados para “${q}”` : activeSubCategory ? activeSubCategory.name : "Todos os produtos";

  const resultText = isLoading
    ? "Carregando produtos…"
    : isError
      ? ""
      : totalElements === 0
        ? "Nenhum produto encontrado"
        : `${pluralize(totalElements, "produto encontrado", "produtos encontrados")}${
            totalPages > 1 ? ` · página ${page + 1} de ${totalPages}` : ""
          }`;

  return (
    <div className="container-page py-8 sm:py-10">
      <Breadcrumb
        items={
          activeSubCategory
            ? [
                {
                  label: "Produtos",
                  link: (children, className) => (
                    <Link to="/products" className={className}>
                      {children}
                    </Link>
                  ),
                },
                { label: activeSubCategory.name },
              ]
            : [{ label: "Produtos" }]
        }
      />

      <div className="mt-5 flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-ink sm:text-4xl">{title}</h1>
        {activeSubCategory && !q && (
          <p className="text-muted">
            {activeSubCategory.categoryName} · {activeSubCategory.description}
          </p>
        )}
      </div>

      {/* Filtros */}
      <div className="mt-6 grid gap-3 rounded-2xl border border-line bg-surface p-4 shadow-card md:grid-cols-[1fr_14rem_12rem] md:items-end">
        <form role="search" aria-label="Buscar na lista de produtos" onSubmit={onSearchSubmit}>
          <label htmlFor="list-search" className="mb-1.5 block text-sm font-semibold text-ink">
            Buscar por nome
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                id="list-search"
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ex.: cafeteira"
                className="h-11 w-full rounded-lg border border-line-strong bg-surface pl-10 pr-3 text-base text-ink placeholder:text-muted hover:border-ink focus:border-brand-600 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-600/35"
              />
            </div>
            <Button type="submit">Buscar</Button>
          </div>
        </form>

        <div>
          <label htmlFor="list-sub" className="mb-1.5 block text-sm font-semibold text-ink">
            Subcategoria
          </label>
          <div className="relative">
            <select
              id="list-sub"
              value={subCategorieId ?? ""}
              onChange={(e) => onSubCategoryChange(e.target.value)}
              className={selectClass}
            >
              <option value="">Todas</option>
              {subCategories.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.categoryName} › {s.name}
                </option>
              ))}
            </select>
            <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          </div>
        </div>

        <div>
          <label htmlFor="list-sort" className="mb-1.5 block text-sm font-semibold text-ink">
            Ordenar por
          </label>
          <div className="relative">
            <select id="list-sort" value={sort} onChange={(e) => onSortChange(e.target.value)} className={selectClass}>
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          </div>
        </div>
      </div>

      {/* Resultados */}
      <section aria-labelledby="results-title" className="mt-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 id="results-title" ref={resultsHeadingRef} tabIndex={-1} className="font-sans text-base font-semibold text-ink focus:outline-none">
            <span role="status" aria-live="polite">
              {resultText}
            </span>
          </h2>
          {isFiltered && (
            <button type="button" onClick={clearFilters} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-sm font-semibold text-ink hover:border-ink">
              <X aria-hidden="true" className="h-4 w-4" />
              Limpar filtros
            </button>
          )}
        </div>

        {isError ? (
          <ErrorState
            message={error?.message ?? "Não conseguimos carregar os produtos."}
            onRetry={() => refetch()}
          />
        ) : isLoading ? (
          <div className="grid gap-6 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-hidden="true">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            icon={<PackageSearch />}
            title="Nenhum produto encontrado"
            description={
              q
                ? `Não encontramos produtos com “${q}”. Confira a ortografia ou tente um termo mais geral.`
                : "Ainda não há produtos nesta seleção."
            }
            action={
              isFiltered ? (
                <Button color="outline" onClick={clearFilters}>
                  Ver todos os produtos
                </Button>
              ) : undefined
            }
            headingLevel="h3"
          />
        ) : (
          <ul
            className={cn(
              "grid gap-6 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 transition-opacity",
              isFetching && "opacity-60",
            )}
            aria-busy={isFetching}
          >
            {products.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} summary={summaries[product.id]} />
              </li>
            ))}
          </ul>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          label="Paginação de produtos"
          className="mt-10"
        />
      </section>
    </div>
  );
};
