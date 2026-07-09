import Image from "next/image";
import { cn } from "@/lib/cn";

type Variant = "mark" | "lockup";
type NamedSize = "sm" | "md" | "lg" | "xl";

type LogoProps = {
  variant?: Variant;
  /** Named height token or an explicit height in px. */
  size?: NamedSize | number;
  priority?: boolean;
  className?: string;
};

/**
 * Intrinsic pixel dimensions of the v2 assets (client-supplied 2026-07-10).
 * The two lockup surface-variants differ by ~3px in height on disk (1138 vs
 * 1141); both are normalised to 1600×1140 here so the light/dark pair render
 * into an IDENTICAL box and toggling themes causes zero reflow. Drives the
 * rendered aspect ratio and next/image's responsive srcset.
 */
const ASSETS: Record<Variant, { w: number; h: number }> = {
  lockup: { w: 1600, h: 1140 },
  mark: { w: 1024, h: 1024 },
};

/** Named sizes map to a rendered HEIGHT in px; width follows the aspect ratio. */
const NAMED_HEIGHTS: Record<NamedSize, number> = {
  sm: 28,
  md: 40,
  lg: 56,
  xl: 80,
};

/**
 * Logo — the ONLY way the JOBKREATORS logo appears anywhere on the site.
 *
 * v2 brand family (client-supplied 2026-07-10). The logo now ships as two
 * surface-specific, ORIGINAL-COLOR variants — navy artwork for LIGHT surfaces
 * (`-light`) and pale/cyan artwork for DARK surfaces (`-dark`). Both are
 * transparent PNGs that sit DIRECTLY on the page background: no cream tile, no
 * recolor, no CSS filter.
 *
 * The theme swap is pure CSS and SSR-perfect: we render BOTH variants and let
 * the `dark:` visibility utilities (keyed on `<html data-theme>`) reveal exactly
 * one. Zero client JS, zero hydration flicker, zero layout shift on toggle.
 * `priority` applies to the light variant only, since defaultTheme="light".
 *
 * Naming is the conventional artwork-colour convention: `-light` = light-surface
 * (navy art), `-dark` = dark-surface (pale/cyan art). See DESIGN.md.
 */
export default function Logo({
  variant = "lockup",
  size = "md",
  priority = false,
  className,
}: LogoProps) {
  const { w, h } = ASSETS[variant];
  const heightPx = typeof size === "number" ? size : NAMED_HEIGHTS[size];
  const widthPx = Math.round((w / h) * heightPx);

  // Shared across both surface-variants so their boxes are byte-identical.
  const common = {
    width: w,
    height: h,
    quality: 95,
    sizes: `${widthPx}px`,
    style: { height: heightPx, width: "auto" as const },
  };

  return (
    <span className={cn("inline-flex items-center justify-center", className)}>
      {/* LIGHT surface → navy artwork. Shown in light, hidden in dark. */}
      <Image
        src={`/brand/jk-${variant}-light.png`}
        alt="JOBKREATORS"
        priority={priority}
        className="block object-contain select-none dark:hidden"
        {...common}
      />
      {/* DARK surface → pale/cyan artwork. Hidden in light, shown in dark. */}
      <Image
        src={`/brand/jk-${variant}-dark.png`}
        alt="JOBKREATORS"
        className="hidden object-contain select-none dark:block"
        {...common}
      />
    </span>
  );
}
