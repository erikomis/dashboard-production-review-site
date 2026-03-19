import { ProductCard } from "@/modules/site/components/ProductCard";
import { useProductListModel } from "./product-list.model";

type ProductListViewProps = ReturnType<typeof useProductListModel>;

export const ProductListView = ({
  data,
  isLoading,
  page,
  setPage,
  totalPages,
}: ProductListViewProps) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black dark:text-white">Todos os Produtos</h1>
        <p className="text-gray-500 mt-1">
          {data ? `${data.totalElements} produto(s) disponíveis` : "Carregando..."}
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-stroke p-6 animate-pulse dark:bg-boxdark dark:border-strokedark"
            >
              <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4" />
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-3 bg-gray-100 rounded mb-1" />
              <div className="h-3 bg-gray-100 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.content.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-stroke rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-boxdark dark:text-white dark:border-strokedark"
              >
                ← Anterior
              </button>
              <span className="text-sm text-gray-600 px-2">
                Página {page + 1} de {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-stroke rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-boxdark dark:text-white dark:border-strokedark"
              >
                Próxima →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
