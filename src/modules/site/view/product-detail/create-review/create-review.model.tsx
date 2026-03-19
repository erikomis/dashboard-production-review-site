import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { SchemaCreateReview } from "./create-review.schema";
import { CreateReviewValues } from "./create-review.type";
import { useMutationReview } from "@/modules/site/hooks/useMutationReview";

export const useCreateReviewModel = (productId: string) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateReviewValues>({
    resolver: zodResolver(SchemaCreateReview),
    defaultValues: { rating: 0 },
  });

  const { mutateAsync: createReview, isPending } = useMutationReview(productId);

  const rating = watch("rating");

  const onSubmit: SubmitHandler<CreateReviewValues> = async (data) => {
    try {
      await createReview({ ...data, productId });
      toast.success("Avaliação enviada com sucesso!");
      reset();
    } catch {
      toast.error("Erro ao enviar avaliação. Tente novamente.");
    }
  };

  return { register, handleSubmit, setValue, rating, errors, onSubmit, isPending };
};
