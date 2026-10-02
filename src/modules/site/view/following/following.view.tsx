import { Link } from "@tanstack/react-router";
import { BellOff, BellRing } from "lucide-react";
import { Breadcrumb } from "@/modules/site/components/Breadcrumb";
import { Pagination } from "@/modules/site/components/Pagination";
import { ProductCard, ProductCardSkeleton } from "@/modules/site/components/ProductCard";
import { Button } from "@/shared/components/button";
import { buttonVariants } from "@/shared/components/button-variants";
import { EmptyState, ErrorState } from "@/shared/components/state";
import { pluralize } from "@/shared/utils/format";
import { cn } from "@/shared/utils/utils";
import { useFollowingModel } from "./following.model";

type FollowingViewProps = ReturnType<typeof useFollowingModel>;

export const FollowingView = ({
  products,
  page,
  totalPages,
  totalElements,
  isLoading,
  isFetching,
  isError,
  error,
  refetch,
  onPageChange,
  onUnfollow,
  pendingId,
  headingRef,
  announcement,
}: FollowingViewProps) => (
  <div className="container-page py-8 sm:py-10">
    <Breadcrumb items={[{ label: "Seguindo" }]} />
    <div className="mt-5 max-w-3xl">
      <h1 ref={headingRef} tabIndex={-1} className="text-3xl font-bold text-ink focus:outline-none sm:text-4xl">
        Produtos que você segue
      </h1>
      <p className="mt-2 text-muted">
        Quando alguém publicar uma avaliação de um destes produtos, você recebe uma notificação.
      </p>
    </div>

    <p role="status" aria-live="polite" className="mt-6 text-sm font-semibold text-ink">
      {isLoading || isError || totalElements === 0 ? "" : pluralize(totalElements, "produto seguido", "produtos seguidos")}
    </p>
    <p className="sr-only" aria-live="polite">
      {announcement}
    </p>

    <div className="mt-4">
      {isError ? (
        <ErrorState message={error?.message ?? "Não conseguimos carregar os produtos seguidos."} onRetry={() => refetch()} />
      ) : isLoading ? (
        <div className="grid gap-6 xs:grid-cols-2 lg:grid-cols-4" aria-busy="true">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={<BellRing />}
          title="Você ainda não segue nenhum produto"
          description="Abra um produto e toque em “Seguir” para ser avisado quando chegar uma avaliação nova."
          action={
            <Link to="/products" className={buttonVariants()}>
              Explorar produtos
            </Link>
          }
        />
      ) : (
        <ul className={cn("grid gap-6 xs:grid-cols-2 lg:grid-cols-4", isFetching && "opacity-70")} aria-busy={isFetching}>
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard
                product={product}
                action={
                  <Button
                    color="outline"
                    size="sm"
                    className="w-full"
                    loading={pendingId === product.id}
                    onClick={() => onUnfollow(product)}
                  >
                    <BellOff aria-hidden="true" className="h-4 w-4" />
                    Deixar de seguir<span className="sr-only"> {product.name}</span>
                  </Button>
                }
              />
            </li>
          ))}
        </ul>
      )}
      <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} label="Paginação dos produtos seguidos" className="mt-8" />
    </div>
  </div>
);
