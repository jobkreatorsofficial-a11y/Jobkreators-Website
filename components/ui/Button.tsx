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
import {
  BUTTON_BASE,
  BUTTON_VARIANTS,
  BUTTON_SIZES,
  BUTTON_ICON_SIZE,
  type ButtonVariant,
  type ButtonSize,
} from "@/components/ui/buttonClasses";

// Re-exported so existing imports from "@/components/ui/Button" keep working.
export { buttonClasses, BUTTON_ICON_SIZE } from "@/components/ui/buttonClasses";

type Variant = ButtonVariant;
type Size = ButtonSize;

export type ButtonProps = {
  variant?: Variant;
  size?: Size;
  /** Leading icon (lucide). Hidden while loading. */
  icon?: LucideIcon;
  /** Show a spinner and disable interaction. */
  loading?: boolean;
  children?: React.ReactNode;
} & Omit<HTMLMotionProps<"button">, "ref" | "children">;

const ICON_SIZE = BUTTON_ICON_SIZE;

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
      className={cn(BUTTON_BASE, BUTTON_VARIANTS[variant], BUTTON_SIZES[size], className)}
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
