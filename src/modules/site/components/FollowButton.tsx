import { BellPlus, BellRing } from "lucide-react";
import { pluralize } from "@/shared/utils/format";
import { cn } from "@/shared/utils/utils";

interface FollowButtonProps {
  following: boolean;
  followersCount: number;
  onToggle: () => void;
  pending?: boolean;
  productName: string;
  className?: string;
}

/** "Seguir"/"Seguindo" (aria-pressed) com o total de seguidores. */
export const FollowButton = ({ following, followersCount, onToggle, pending, productName, className }: FollowButtonProps) => (
  <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-1", className)}>
    <button
      type="button"
      onClick={() => {
        if (!pending) onToggle();
      }}
      aria-pressed={following}
      aria-disabled={pending || undefined}
      aria-describedby="follow-hint"
      className={cn(
        "inline-flex h-12 items-center justify-center gap-2 rounded-lg border px-5 text-base font-semibold transition-colors",
        following
          ? "border-brand-600 bg-tint text-brand-800 hover:bg-tint-strong dark:border-brand-300"
          : "border-line-strong bg-surface text-ink hover:border-ink hover:bg-canvas",
      )}
    >
      {following ? (
        <BellRing aria-hidden="true" className="h-5 w-5 motion-safe:animate-pop-in" />
      ) : (
        <BellPlus aria-hidden="true" className="h-5 w-5" />
      )}
      {following ? "Seguindo" : "Seguir"}
      <span className="sr-only"> {productName}</span>
    </button>
    <span className="text-sm text-muted" aria-live="polite">
      {pluralize(followersCount, "seguidor", "seguidores")}
    </span>
    <span id="follow-hint" className="sr-only">
      Quem segue o produto é avisado quando chega uma avaliação nova.
    </span>
  </div>
);
