interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
}

const sizes = { sm: "text-base", md: "text-2xl", lg: "text-3xl" };

export const StarRating = ({ value, onChange, size = "md" }: StarRatingProps) => {
  const interactive = !!onChange;
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? "button" : undefined}
          onClick={() => onChange?.(star)}
          disabled={!interactive}
          className={`${sizes[size]} ${
            interactive
              ? "cursor-pointer hover:scale-110 transition-transform"
              : "cursor-default"
          } ${star <= value ? "text-yellow-400" : "text-gray-300"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
};
