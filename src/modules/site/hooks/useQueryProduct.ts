import { useQuery } from "@tanstack/react-query";
import { ProductsService } from "@/modules/site/services/products.service";

export const useQueryProduct = (id: string) =>
  useQuery({
    queryKey: ["product", id],
    queryFn: () => ProductsService.getById(id),
    enabled: !!id,
  });
