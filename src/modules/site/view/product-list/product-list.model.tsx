import { FormEvent, useMemo, useRef, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useQueryProducts } from "@/modules/site/hooks/useQueryProducts";
import { useQueryCategories } from "@/modules/site/hooks/useQueryCategories";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import type { ProductSort } from "@/shared/types/product";
import type { ProductListSearch } from "./product-list.type";

export const PAGE_SIZE = 12;


export const useProductListModel = () => {
  const navigate = useNavigate();
  // id da rota inclui o layout "site"
  const search = useSearch({ from: "/site/products" });
  const q = search.q ?? "";
  const page = (search.page ?? 1) - 1;
  const sort: ProductSort = search.sort ?? "recent";
  const subCategorieId = search.sub;

  // Campo de busca editável, ressincronizado quando ?q= muda (ex.: busca do header)
  const [searchTerm, setSearchTerm] = useState(q);
  const [syncedQ, setSyncedQ] = useState(q);
  if (syncedQ !== q) {
    setSyncedQ(q);
    setSearchTerm(q);
  }

  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);

  const productsQuery = useQueryProducts({ page, size: PAGE_SIZE, search: q, sort, subCategorieId });
  const { data: categories } = useQueryCategories();

  const products = useMemo(() => productsQuery.data?.content ?? [], [productsQuery.data]);
  const totalPages = productsQuery.data?.page.totalPages ?? 0;
  const totalElements = productsQuery.data?.page.totalElements ?? 0;

  const subCategories = useMemo(
    () => (categories ?? []).flatMap((c) => c.subCategories.map((s) => ({ ...s, categoryName: c.name, categorySlug: c.slug }))),
    [categories],
  );
  const activeSubCategory = subCategories.find((s) => s.id === subCategorieId);

  useDocumentTitle(
    q ? `Resultados para “${q}”` : activeSubCategory ? activeSubCategory.name : "Produtos",
  );

  const updateSearch = (next: Partial<ProductListSearch>) =>
    navigate({
      to: "/products",
      search: () => {
        const merged: ProductListSearch = { ...search, ...next };
        // remove valores padrão para manter a URL limpa
        return {
          q: merged.q || undefined,
          page: merged.page && merged.page > 1 ? merged.page : undefined,
          sort: merged.sort && merged.sort !== "recent" ? merged.sort : undefined,
          sub: merged.sub || undefined,
        };
      },
    });

  const onSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateSearch({ q: searchTerm.trim(), page: undefined });
  };

  const onSortChange = (value: string) => updateSearch({ sort: value as ProductSort, page: undefined });

  const onSubCategoryChange = (value: string) =>
    updateSearch({ sub: value ? Number(value) : undefined, page: undefined });

  const onPageChange = (nextPage: number) => {
    updateSearch({ page: nextPage + 1 });
    resultsHeadingRef.current?.focus({ preventScroll: true });
    resultsHeadingRef.current?.scrollIntoView({ block: "start" });
  };

  const clearFilters = () => {
    setSearchTerm("");
    navigate({ to: "/products", search: {} });
  };

  const isFiltered = !!q || !!subCategorieId;

  return {
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
    totalPages,
    totalElements,
    isLoading: productsQuery.isPending,
    isFetching: productsQuery.isFetching,
    isError: productsQuery.isError,
    error: productsQuery.error,
    refetch: productsQuery.refetch,
    resultsHeadingRef,
  };
};
