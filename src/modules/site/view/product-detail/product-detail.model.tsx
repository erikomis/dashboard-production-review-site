import { useState } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useQueryProductBySlug } from "@/modules/site/hooks/useQueryProducts";
import { useQueryReviews } from "@/modules/site/hooks/useQueryReviews";
import { useMutationReview } from "@/modules/site/hooks/useMutationReview";
import { useMeQuery } from "@/shared/hooks/useMeQuery";
import { SchemaReview } from "./product-detail.schema";
import { ReviewFormValues } from "./product-detail.type";

export const useProductDetailModel = () => {
  const { slug } = useParams({ from: "/products/$slug" });
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const { isSuccess: isAuthenticated } = useMeQuery();

  const { data: product, isLoading: loadingProduct } = useQueryProductBySlug(slug ?? "");
  const { data: reviewPage, isLoading: loadingReviews } = useQueryReviews(product?.id ?? "");

  const { mutateAsync: createReview, isPending } = useMutationReview(product?.id ?? "");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({ resolver: zodResolver(SchemaReview) });

  const reviews = reviewPage?.content ?? [];
  const avgRating =
    reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  const onSubmit: SubmitHandler<ReviewFormValues> = async (data) => {
    if (!isAuthenticated) {
      navigate({ to: "/login", search: { redirect: `/products/${slug}` } });
      return;
    }
    if (rating === 0) {
      toast.warning("Selecione uma nota de 1 a 5 estrelas.");
      return;
    }
    try {
      await createReview({ ...data, rating, productId: product!.id });
      toast.success("Avaliação enviada! Obrigado pelo feedback.");
      reset();
      setRating(0);
    } catch {
      toast.error("Erro ao enviar avaliação. Tente novamente.");
    }
  };

  return {
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
  };
};
