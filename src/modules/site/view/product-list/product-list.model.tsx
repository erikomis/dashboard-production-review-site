import { useNavigate, useSearch } from "@tanstack/react-router";
import { useQueryProducts } from "@/modules/site/hooks/useQueryProducts";

export const useProductListModel = () => {
  const navigate = useNavigate();

  // page vive na URL — persiste no back/forward e é bookmarkável
  const { page } = useSearch({ from: "/products" });

  const setPage = (updater: number | ((prev: number) => number)) => {
    const newPage = typeof updater === "function" ? updater(page) : updater;
    navigate({ to: "/products", search: (prev) => ({ ...prev, page: newPage }) });
  };

  const size = 12;
  const { data, isLoading } = useQueryProducts(page, size);
  const totalPages = data?.totalPages ?? 1;

  return { data, isLoading, page, setPage, totalPages };
};
