import { Link } from "@tanstack/react-router";
import { ChevronDown, FolderX, PackageSearch, Trophy } from "lucide-react";
import { Breadcrumb, type BreadcrumbItem } from "@/modules/site/components/Breadcrumb";
import { FilterChips } from "@/modules/site/components/FilterChips";
import { Pagination } from "@/modules/site/components/Pagination";
import { ProductCard, ProductCardSkeleton } from "@/modules/site/components/ProductCard";
import { Button } from "@/shared/components/button";
import { buttonVariants } from "@/shared/components/button-variants";
import { EmptyState, ErrorState } from "@/shared/components/state";
import { pluralize } from "@/shared/utils/format";
import { cn } from "@/shared/utils/utils";
import { CATEGORY_PAGE_SIZE, useCategoryModel } from "./category.model";

type CategoryViewProps = ReturnType<typeof useCategoryModel>;

const RESULTS_ID = "categoria-produtos";

const selectClass =
  "h-11 w-full appearance-none rounded-lg border border-line-strong bg-surface pl-3.5 pr-10 text-sm font-medium text-ink hover:border-ink focus:border-brand-600 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-600/35";

const HeaderSkeleton = () => (
  <div className="container-page py-8 sm:py-10" aria-busy="true">
    <span role="status" className="sr-only">
      Carregando categoria…
    </span>
    <div aria-hidden="true">
      <div className="skeleton h-4 w-56" />
      <div className="skeleton mt-6 h-10 w-72" />
      <div className="skeleton mt-3 h-4 w-96 max-w-full" />
      <div className="mt-6 flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-10 w-28 rounded-full" />
        ))}
      </div>
    </div>
  </div>
);

export const CategoryView = ({
  category,
  isLoadingCategory,
  isErrorCategory,
  categoryError,
  refetchCategory,
  activeSubCategory,
  subCategorieId,
  onSubCategoryChange,
  sort,
  sortOptions,
  onSortChange,
  page,
  onPageChange,
  products,
  totalPages,
  totalElements,
  isLoadingProducts,
  isFetchingProducts,
  isErrorProducts,
  productsError,
  refetchProducts,
  resultsHeadingRef,
}: CategoryViewProps) => {
  if (isLoadingCategory) return <HeaderSkeleton />;

  if (isErrorCategory) {
    return (
      <div className="container-page py-16">
        <h1 className="sr-only">Erro ao carregar a categoria</h1>
        <ErrorState message={categoryError?.message} onRetry={() => refetchCategory()} />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={<FolderX />}
          headingLevel="h1"
          title="Categoria não encontrada"
          description="A categoria que você procura pode ter sido removida ou o endereço está incorreto."
          action={
            <Link to="/" hash="categorias" className={buttonVariants()}>
              Ver todas as categorias
            </Link>
          }
        />
      </div>
    );
  }

  const breadcrumb: BreadcrumbItem[] = [
    {
      label: "Categorias",
      link: (children, className) => (
        <Link to="/" hash="categorias" className={className}>
          {children}
        </Link>
      ),
    },
    activeSubCategory
      ? {
          label: category.name,
          link: (children, className) => (
            <Link to="/categorias/$slug" params={{ slug: category.slug }} className={className}>
              {children}
            </Link>
          ),
        }
      : { label: category.name },
  ];
  if (activeSubCategory) breadcrumb.push({ label: activeSubCategory.name });

  const resultText = isLoadingProducts
    ? "Carregando produtos…"
    : isErrorProducts
      ? ""
      : totalElements === 0
        ? "Nenhum produto encontrado"
        : `${pluralize(totalElements, "produto", "produtos")}${
            activeSubCategory ? ` em ${activeSubCategory.name}` : ""
          }${totalPages > 1 ? ` · página ${page + 1} de ${totalPages}` : ""}`;

  return (
    <div className="container-page py-8 sm:py-10">
      <Breadcrumb items={breadcrumb} />

      <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-700">Categoria</p>
          <h1 className="mt-1 text-3xl font-bold text-ink sm:text-4xl">
            {category.name}
            {activeSubCategory && <span className="text-muted"> › {activeSubCategory.name}</span>}
          </h1>
          {(activeSubCategory?.description || category.description) && (
            <p className="mt-2 text-muted">{activeSubCategory?.description || category.description}</p>
          )}
        </div>
        <Link
          to="/ranking"
          search={{ cat: category.id }}
          className={cn(buttonVariants({ color: "outline" }), "self-start lg:self-auto")}
        >
          <Trophy aria-hidden="true" className="h-4 w-4" />
          Mais bem avaliados em {category.name}
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4 shadow-card md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <p className="mb-2 text-sm font-semibold text-ink">
            Subcategorias
          </p>
          {category.subCategories.length > 0 ? (
            <FilterChips
              label={`Filtrar ${category.name} por subcategoria`}
              options={category.subCategories.map((s) => ({ value: s.id, label: s.name }))}
              value={subCategorieId}
              onChange={onSubCategoryChange}
              allLabel="Todas"
              controls={RESULTS_ID}
            />
          ) : (
            <p className="text-sm text-muted">Esta categoria ainda não tem subcategorias.</p>
          )}
        </div>
        <div className="md:w-56 md:shrink-0">
          <label htmlFor="category-sort" className="mb-1.5 block text-sm font-semibold text-ink">
            Ordenar por
          </label>
          <div className="relative">
            <select
              id="category-sort"
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              aria-controls={RESULTS_ID}
              className={selectClass}
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          </div>
        </div>
      </div>

      <section aria-labelledby="category-results-title" className="mt-8">
        <h2
          id="category-results-title"
          ref={resultsHeadingRef}
          tabIndex={-1}
          className="mb-5 font-sans text-base font-semibold text-ink focus:outline-none"
        >
          <span role="status" aria-live="polite">
            {resultText}
          </span>
        </h2>

        <div id={RESULTS_ID}>
          {isErrorProducts ? (
            <ErrorState
              message={productsError?.message ?? "Não conseguimos carregar os produtos."}
              onRetry={() => refetchProducts()}
            />
          ) : isLoadingProducts ? (
            <div className="grid gap-6 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-hidden="true">
              {Array.from({ length: CATEGORY_PAGE_SIZE }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              icon={<PackageSearch />}
              title="Nenhum produto por aqui ainda"
              description={
                activeSubCategory
                  ? `Ainda não há produtos em ${activeSubCategory.name}.`
                  : `Ainda não há produtos em ${category.name}.`
              }
              action={
                activeSubCategory ? (
                  <Button color="outline" onClick={() => onSubCategoryChange(undefined)}>
                    Ver tudo em {category.name}
                  </Button>
                ) : undefined
              }
              headingLevel="h3"
            />
          ) : (
            <ul
              className={cn(
                "grid gap-6 transition-opacity xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
                isFetchingProducts && "opacity-60",
              )}
              aria-busy={isFetchingProducts}
            >
              {products.map((product) => (
                <li key={product.id}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          label="Paginação de produtos da categoria"
          className="mt-10"
        />
      </section>
    </div>
  );
};
