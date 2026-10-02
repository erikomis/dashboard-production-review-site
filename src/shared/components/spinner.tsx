import { cn } from "../utils/utils";

export const Spinner = ({ className }: { className?: string }) => (
  <span
    aria-hidden="true"
    className={cn(
      "inline-block h-5 w-5 rounded-full border-2 border-current border-r-transparent motion-safe:animate-spin",
      className,
    )}
  />
);
