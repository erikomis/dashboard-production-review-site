import { useQuery } from "@tanstack/react-query";
import { SeoService } from "@/modules/site/services/seo.service";

/** Dados do JSON-LD do produto (GET /seo/products/{slug}). Falha aqui não afeta a página. */
export const useQuerySeoProduct = (slug: string) =>
  useQuery({
    queryKey: ["seo", "product", slug],
    queryFn: () => SeoService.getProduct(slug),
    enabled: !!slug,
    staleTime: 5 * 60_000,
    retry: false,
  });
