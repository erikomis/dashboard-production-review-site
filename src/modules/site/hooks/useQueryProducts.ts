import { useQuery } from "@tanstack/react-query";
import { ProductsService } from "@/modules/site/services/products.service";

export const useQueryProducts = (page = 0, size = 12) =>
  useQuery({
    queryKey: ["products", page, size],
    queryFn: () => ProductsService.fetchProducts(page, size),
  });

export const useQueryProductBySlug = (slug: string) =>
  useQuery({
    queryKey: ["product", slug],
    queryFn: () => ProductsService.getBySlug(slug),
    enabled: !!slug,
  });
