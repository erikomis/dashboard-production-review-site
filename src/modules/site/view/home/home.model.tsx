import { useQueryProducts } from "@/modules/site/hooks/useQueryProducts";

export const useHomeModel = () => {
  const { data, isLoading } = useQueryProducts(0, 6);
  return { data, isLoading };
};
