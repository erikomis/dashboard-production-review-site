import { Eye } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/shared/components/button";
import { Input } from "@/shared/components/input";
import { Label } from "@/shared/components/label";
import { StarRating } from "@/modules/site/components/StarRating";
import { ReviewCard } from "@/modules/site/components/ReviewCard";
import { useProductDetailModel } from "./product-detail.model";

type ProductDetailViewProps = ReturnType<typeof useProductDetailModel>;

export const ProductDetailView = ({
  product,
  loadingProduct,
  reviews,
  loadingReviews,
  avgRating,
  rating,
  setRating,
  register,
  handleSubmit,
  onSubmit,
  errors,
  isPending,
  isAuthenticated,
  slug,
}: ProductDetailViewProps) => {
  if (loadingProduct) {
    return (
      <div className="flex items-center justify-center py-40">
        <div className="w-10 h-10 border-b-2 rounded-full animate-spin border-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-40">
        <span className="text-5xl">😕</span>
        <h2 className="text-xl font-semibold text-gray-700">Produto não encontrado</h2>
        <Link to="/products" search={{ page: 0, q: "" }} className="text-primary hover:underline">
          Ver todos os produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl px-4 py-12 mx-auto sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 mb-6 text-sm text-gray-500">
        <Link to="/" className="hover:text-primary">
          Início
        </Link>
        <span>/</span>
        <Link to="/products" search={{ page: 0, q: "" }} className="hover:text-primary">
          Produtos
        </Link>
        <span>/</span>
        <span className="text-black dark:text-white">{product.name}</span>
      </nav>

      {/* Product info */}
      <div className="p-8 mb-10 bg-white border dark:bg-boxdark rounded-2xl border-stroke dark:border-strokedark">
        <div className="flex items-start gap-6">
          <div className="flex items-center justify-center flex-shrink-0 w-16 h-16 bg-blue-50 rounded-xl">
            <span className="text-3xl">📦</span>
          </div>
          <div className="flex-1">
            <h1 className="mb-2 text-2xl font-bold text-black dark:text-white">{product.name}</h1>
            <p className="leading-relaxed text-gray-600">{product.description}</p>
            {reviews.length > 0 && (
              <div className="flex items-center gap-3 mt-4">
                <StarRating value={Math.round(avgRating)} size="sm" />
                <span className="text-sm text-gray-500">
                  {avgRating.toFixed(1)} ({reviews.length} avaliação
                  {reviews.length !== 1 ? "ões" : ""})
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Reviews list */}
        <div className="lg:col-span-3">
          <h2 className="mb-4 text-xl font-bold text-black dark:text-white">
            Avaliações {reviews.length > 0 && `(${reviews.length})`}
          </h2>

          {loadingReviews ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="p-6 bg-white border dark:bg-boxdark rounded-xl border-stroke dark:border-strokedark animate-pulse"
                >
                  <div className="w-1/2 h-4 mb-3 bg-gray-200 rounded" />
                  <div className="h-3 mb-1 bg-gray-100 rounded" />
                  <div className="w-3/4 h-3 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="p-8 text-center bg-white border dark:bg-boxdark rounded-xl border-stroke dark:border-strokedark">
              <span className="block mb-3 text-4xl">💬</span>
              <p className="text-gray-500">Nenhuma avaliação ainda. Seja o primeiro!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>

        {/* Review form */}
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-xl font-bold text-black dark:text-white">Avaliar produto</h2>
          <div className="p-6 bg-white border dark:bg-boxdark rounded-xl border-stroke dark:border-strokedark">
            {isAuthenticated ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
                <div className="mb-4">
                  <Label value="Sua nota:" />
                  <StarRating value={rating} onChange={setRating} size="lg" />
                </div>

                <Input
                  {...register("title")}
                  color="primary"
                  type="text"
                  placeholder="Ex: Produto excelente!"
                  error={errors.title?.message}
                >
                  <Label value="Título:" htmlFor="title" />
                </Input>

                <div className="mb-2">
                  <Label value="Sua opinião:" htmlFor="content" />
                  <textarea
                    {...register("content")}
                    rows={4}
                    placeholder="Conte o que achou do produto, pontos positivos e negativos..."
                    className="w-full py-3 pl-4 pr-4 text-black bg-transparent border rounded-lg outline-none resize-none border-stroke focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {errors.content && (
                    <span className="my-2 text-xs font-bold text-danger">
                      {errors.content.message}
                    </span>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isPending}
                  color="default"
                  size="lg"
                  className="flex w-full p-4 text-white transition border rounded-lg cursor-pointer border-primary bg-primary hover:bg-opacity-90 disabled:opacity-50"
                >
                  {isPending ? "Enviando..." : "Enviar Avaliação"}
                </Button>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
                <span className="text-4xl">🔒</span>
                <p className="text-gray-600 dark:text-gray-400">
                  Faça login para avaliar este produto
                </p>
                <Link
                  to="/login"
                  search={{ redirect: `/products/${slug}` }}
                  className="flex w-full items-center justify-center p-3 text-white transition border rounded-lg border-primary bg-primary hover:bg-opacity-90"
                >
                  Fazer login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
