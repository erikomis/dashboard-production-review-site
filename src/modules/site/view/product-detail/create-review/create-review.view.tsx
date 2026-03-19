import { Star } from "lucide-react";
import { Button } from "@/shared/components/button";
import { Input } from "@/shared/components/input";
import { Label } from "@/shared/components/label";
import { useCreateReviewModel } from "./create-review.model";

type CreateReviewViewProps = ReturnType<typeof useCreateReviewModel>;

export const CreateReviewView = ({
  register,
  handleSubmit,
  setValue,
  rating,
  errors,
  onSubmit,
  isPending,
}: CreateReviewViewProps) => {
  return (
    <div className="bg-white rounded-xl border border-stroke shadow-card p-6">
      <h3 className="text-lg font-semibold text-black mb-5">
        Deixe sua avaliação
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Star Rating */}
        <div className="mb-2">
          <Label value="Nota:" />
          <div className="flex items-center gap-1 mt-1">
            {Array.from({ length: 5 }).map((_, i) => {
              const value = i + 1;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setValue("rating", value, { shouldValidate: true })}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={28}
                    className={
                      value <= rating
                        ? "text-meta-6 fill-meta-6"
                        : "text-stroke fill-stroke"
                    }
                  />
                </button>
              );
            })}
            {rating > 0 && (
              <span className="ml-2 text-sm text-body">{rating}/5</span>
            )}
          </div>
          {errors.rating && (
            <span className="text-xs font-bold text-danger">
              {errors.rating.message}
            </span>
          )}
        </div>

        <Input
          {...register("title")}
          type="text"
          placeholder="Ex: Produto excelente!"
          error={errors.title?.message}
        >
          <Label value="Título:" />
        </Input>

        <div className="mb-2">
          <Label value="Opinião:" />
          <textarea
            {...register("content")}
            rows={4}
            placeholder="Descreva sua experiência com o produto..."
            className="w-full py-3 px-4 text-black bg-transparent border rounded-lg outline-none border-stroke focus:border-primary resize-none text-sm"
          />
          {errors.content && (
            <span className="text-xs font-bold text-danger">
              {errors.content.message}
            </span>
          )}
        </div>

        <Button
          type="submit"
          color="default"
          size="lg"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? "Enviando..." : "Enviar avaliação"}
        </Button>
      </form>
    </div>
  );
};
