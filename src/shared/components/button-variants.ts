import { tv } from "tailwind-variants";

export const buttonVariants = tv({
  base: "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold transition-[color,background-color,border-color,box-shadow,transform] duration-150 motion-safe:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 aria-disabled:cursor-not-allowed aria-disabled:opacity-60",
  variants: {
    color: {
      default: "bg-primary text-white shadow-card hover:bg-primary-hover active:bg-primary-active",
      outline:
        "border border-line-strong bg-surface text-ink hover:border-ink hover:bg-canvas",
      ghost: "text-ink hover:bg-ink/5",
      link: "h-auto px-0 text-brand-700 underline decoration-brand-300 decoration-2 underline-offset-4 hover:text-brand-900",
      danger: "bg-danger-solid text-white hover:bg-[#912018]",
      light: "bg-white text-[#1C2434] hover:bg-brand-100",
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
