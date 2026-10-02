import { tv } from "tailwind-variants";

export const buttonVariants = tv({
  base: "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 aria-disabled:cursor-not-allowed aria-disabled:opacity-60",
  variants: {
    color: {
      default: "bg-brand-600 text-white shadow-card hover:bg-brand-700 active:bg-brand-800",
      outline:
        "border border-line-strong bg-surface text-ink hover:border-ink hover:bg-canvas",
      ghost: "text-ink hover:bg-ink/5",
      link: "h-auto px-0 text-brand-700 underline decoration-brand-300 decoration-2 underline-offset-4 hover:text-brand-900",
      danger: "bg-danger text-white hover:bg-[#912018]",
      light: "bg-white text-ink hover:bg-brand-50",
    },
    size: {
      default: "h-11 px-5 text-sm",
      sm: "h-9 px-3 text-sm",
      lg: "h-12 px-6 text-base",
      icon: "h-11 w-11",
    },
  },
  defaultVariants: {
    color: "default",
    size: "default",
  },
});
