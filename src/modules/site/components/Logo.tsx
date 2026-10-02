import { cn } from "@/shared/utils/utils";

interface LogoProps {
  className?: string;
  tone?: "dark" | "light";
}

/** Marca do ReviewStore. Puramente visual: o texto acessível vem do link que a envolve. */
export const Logo = ({ className, tone = "dark" }: LogoProps) => (
  <span className={cn("inline-flex items-center gap-2", className)}>
    <svg aria-hidden="true" viewBox="0 0 32 32" className="h-8 w-8 shrink-0">
      <rect width="32" height="32" rx="8" className={tone === "dark" ? "fill-brand-600" : "fill-cream"} />
      <path
        d="M16 6.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L16 21.3l-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9z"
        className={tone === "dark" ? "fill-cream" : "fill-brand-700"}
      />
    </svg>
    <span
      className={cn(
        "font-display text-xl font-bold tracking-tight",
        tone === "dark" ? "text-ink" : "text-white",
      )}
    >
      Review<span className={tone === "dark" ? "text-brand-600" : "text-brand-200"}>Store</span>
    </span>
  </span>
);
