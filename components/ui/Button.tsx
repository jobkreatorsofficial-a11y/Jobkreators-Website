"use client";

import { forwardRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  type HTMLMotionProps,
} from "framer-motion";
import { Loader2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { useMotionSafe } from "@/lib/hooks/useMotionSafe";

type Variant = "primary" | "secondary" | "ghost" | "link";
type Size = "sm" | "md" | "lg";

export type ButtonProps = {
  variant?: Variant;
  size?: Size;
  /** Leading icon (lucide). Hidden while loading. */
  icon?: LucideIcon;
  /** Show a spinner and disable interaction. */
  loading?: boolean;
  children?: React.ReactNode;
} & Omit<HTMLMotionProps<"button">, "ref" | "children">;

const BASE =
  "relative inline-flex items-center justify-center gap-2 rounded-full font-medium " +
  "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out-expo)] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-accent text-accent-fg hover:bg-accent-2 shadow-[var(--shadow-glow-accent)]",
  secondary:
    "border border-border-strong bg-transparent text-brand-cream hover:bg-surface-2 hover:border-accent",
  ghost: "bg-transparent text-text hover:bg-surface-2",
  // `link` underline animates in from the left on hover.
  link: "group/link bg-transparent px-0 text-accent hover:text-accent-2",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-3 text-body-sm",
  md: "h-11 px-5 text-body",
  lg: "h-12 px-6 text-body-lg",
};

const ICON_SIZE: Record<Size, number> = { sm: 16, md: 18, lg: 20 };

/**
 * Button — the canonical action primitive. Variants: primary (accent),
 * secondary (outline), ghost, link (animated underline). The primary variant
 * gets a subtle magnetic hover (max 4px translate) gated on useMotionSafe().
 *
 * asChild is intentionally omitted: @radix-ui/react-slot is not installed, so
 * per the design brief this forwards a ref to the underlying <button> instead.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    icon: Icon,
    loading = false,
    className,
    children,
    disabled,
    onMouseMove,
    onMouseLeave,
    ...props
  },
  ref,
) {
  const motionSafe = useMotionSafe();
  const magnetic = variant === "primary" && motionSafe;

  // Magnetic pull toward the cursor, capped at ±4px, spring-smoothed.
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15 });
  const springY = useSpring(y, { stiffness: 200, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    onMouseMove?.(e);
    if (!magnetic) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const cap = 4;
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    x.set(Math.max(-cap, Math.min(cap, dx * cap)));
    y.set(Math.max(-cap, Math.min(cap, dy * cap)));
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    onMouseLeave?.(e);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={magnetic ? { x: springX, y: springY } : undefined}
      className={cn(BASE, VARIANTS[variant], SIZES[size], className)}
      {...props}
    >
      {loading && <Loader2 className="animate-spin" size={ICON_SIZE[size]} aria-hidden />}
      {!loading && Icon && <Icon size={ICON_SIZE[size]} aria-hidden />}
      {variant === "link" ? (
        <span className="relative">
          {children}
          <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-[var(--duration-base)] ease-[var(--ease-out-expo)] group-hover/link:scale-x-100" />
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
});

export default Button;
