import { cn } from "@/lib/cn";

// Pure (non-"use client") button styling shared by the <Button> client component
// and by navigational CTAs that render a real <Link>/<a> (a <button> can't be
// nested in an anchor, and Slot/asChild isn't available). Keeping this in a plain
// module lets Server Components import buttonClasses without pulling in client code.

export type ButtonVariant = "primary" | "secondary" | "ghost" | "link";
export type ButtonSize = "sm" | "md" | "lg";

export const BUTTON_BASE =
  "relative inline-flex items-center justify-center gap-2 rounded-full font-medium " +
  "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out-expo)] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50";

export const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-accent text-accent-fg hover:bg-accent-2 shadow-[var(--shadow-glow-accent)]",
  secondary:
    "border border-border-strong bg-transparent text-text hover:bg-surface-2 hover:border-accent",
  ghost: "bg-transparent text-text hover:bg-surface-2",
  // `link` underline animates in from the left on hover (handled inside <Button>).
  link: "group/link bg-transparent px-0 text-accent hover:text-accent-2",
};

export const BUTTON_SIZES: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-body-sm",
  md: "h-11 px-5 text-body",
  lg: "h-12 px-6 text-body-lg",
};

/** Icon px size per button size — also used by link/anchor CTAs. */
export const BUTTON_ICON_SIZE: Record<ButtonSize, number> = { sm: 16, md: 18, lg: 20 };

/**
 * buttonClasses — the Button's class composition, exposed so navigational CTAs
 * can render a real `<Link>`/`<a>` with identical styling. The magnetic hover is
 * button-only; link CTAs get the same surface, sizing and focus treatment.
 */
export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
): string {
  return cn(BUTTON_BASE, BUTTON_VARIANTS[variant], BUTTON_SIZES[size], className);
}
