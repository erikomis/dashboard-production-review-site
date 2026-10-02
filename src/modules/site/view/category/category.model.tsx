import { useRef } from "react";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { useQueryCategoryBySlug } from "@/modules/site/hooks/useQueryCategories";
import { useQueryProducts } from "@/modules/site/hooks/useQueryProducts";
import { PRODUCT_SORT_OPTIONS } from "@/modules/site/constants/product-sort";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import type { ProductSort } from "@/shared/types/product";
import type { CategorySearch } from "./category.type";

export const CATEGORY_PAGE_SIZE = 12;

export const useCategoryModel = () => {
  const navigate = useNavigate();
  const { slug } = useParams({ from: "/site/categorias/$slug" });
  const search = useSearch({ from: "/site/categorias/$slug" });
  const page = (search.page ?? 1) - 1;
  const sort: ProductSort = search.sort ?? "recent";
  const subCategorieId = search.sub;
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);

  const categoryQuery = useQueryCategoryBySlug(slug);
  const category = categoryQuery.data;
  const activeSubCategory = category?.subCategories.find((s) => s.id === subCategorieId);

  // Filtros no servidor: categoria + subcategoria opcional
  const productsQuery = useQueryProducts(
    { page, size: CATEGORY_PAGE_SIZE, sort, categoryId: category?.id, subCategorieId },
    { enabled: !!category },
  );

  useDocumentTitle(
    category
      ? activeSubCategory
        ? `${activeSubCategory.name} · ${category.name}`
        : category.name
      : categoryQuery.isPending
        ? undefined
        : "Categoria não encontrada",
  );

  const updateSearch = (next: Partial<CategorySearch>) =>
    navigate({
      to: "/categorias/$slug",
      params: { slug },
      search: () => {
        const merged: CategorySearch = { ...search, ...next };
        return {
          sub: merged.sub || undefined,
          sort: merged.sort && merged.sort !== "recent" ? merged.sort : undefined,
          page: merged.page && merged.page > 1 ? merged.page : undefined,
        };
      },
      resetScroll: false,
    });

  const onSubCategoryChange = (id: number | undefined) => updateSearch({ sub: id, page: undefined });
  const onSortChange = (value: string) => updateSearch({ sort: value as ProductSort, page: undefined });
  const onPageChange = (nextPage: number) => {
    updateSearch({ page: nextPage + 1 });
    resultsHeadingRef.current?.focus({ preventScroll: true });
    resultsHeadingRef.current?.scrollIntoView({ block: "start" });
  };

  return {
    slug,
    category,
    isLoadingCategory: categoryQuery.isPending,
    isErrorCategory: categoryQuery.isError,
    categoryError: categoryQuery.error,
    refetchCategory: categoryQuery.refetch,
    activeSubCategory,
    subCategorieId,
    onSubCategoryChange,
    sort,
    sortOptions: PRODUCT_SORT_OPTIONS,
    onSortChange,
    page,
    onPageChange,
    products: productsQuery.data?.content ?? [],
    totalPages: productsQuery.data?.page.totalPages ?? 0,
    totalElements: productsQuery.data?.page.totalElements ?? 0,
    isLoadingProducts: productsQuery.isPending,
    isFetchingProducts: productsQuery.isFetching,
    isErrorProducts: productsQuery.isError,
    productsError: productsQuery.error,
    refetchProducts: productsQuery.refetch,
    resultsHeadingRef,
  };
};
