import { useQuery } from "@tanstack/react-query";
import { CategoryService } from "@/modules/site/services/category.service";

export const useQueryCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoryService.list(),
  });
