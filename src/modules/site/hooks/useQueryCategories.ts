import { queryOptions, useQuery } from "@tanstack/react-query";
import { CategoryService } from "@/modules/site/services/category.service";

export const categoriesQueryOptions = () =>
  queryOptions({
    queryKey: ["categories"],
    queryFn: () => CategoryService.list(),
    staleTime: 1000 * 60 * 30,
  });

export const categoryBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["category", slug],
    queryFn: () => CategoryService.getBySlug(slug),
    staleTime: 1000 * 60 * 30,
  });

export const useQueryCategories = () => useQuery(categoriesQueryOptions());

export const useQueryCategoryBySlug = (slug: string) =>
  useQuery({ ...categoryBySlugQueryOptions(slug), enabled: !!slug });
