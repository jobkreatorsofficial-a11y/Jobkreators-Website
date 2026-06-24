import Image from "next/image";
import { cn } from "@/lib/cn";

type Variant = "mark" | "wordmark" | "lockup";
type Surface = "bare" | "tile";
type NamedSize = "sm" | "md" | "lg" | "xl";

type LogoProps = {
  variant?: Variant;
  /**
   * "bare" renders the logo directly on the surface (use on light surfaces).
   * "tile" wraps it in a refined cream brand stamp (use on dark surfaces).
   */
  surface?: Surface;
  /** Named height token or an explicit height in px. */
  size?: NamedSize | number;
  priority?: boolean;
  className?: string;
};

/**
 * True intrinsic pixel dimensions of each generated asset (see DESIGN.md).
 * Drives the rendered aspect ratio and next/image's responsive srcset.
 */
const ASSETS: Record<Variant, { w: number; h: number }> = {
  lockup: { w: 1600, h: 1152 },
  mark: { w: 1024, h: 1024 },
  wordmark: { w: 1400, h: 259 },
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
 * ALWAYS renders the original-color trimmed transparent PNGs (navy mark + navy
 * wordmark + cyan tagline). The recolored "-light" rasters stay in
 * public/brand/ for future use but are never referenced here — the brand
 * identity is not recolored. On dark surfaces, pass surface="tile" to seat the
 * logo on a refined cream brand stamp instead of recoloring it.
 */
export default function Logo({
  variant = "lockup",
  surface = "bare",
  size = "md",
  priority = false,
  className,
}: LogoProps) {
  const { w, h } = ASSETS[variant];
  const heightPx = typeof size === "number" ? size : NAMED_HEIGHTS[size];
  const widthPx = Math.round((w / h) * heightPx);

  // Original colors, always. No theme/surface branching on the asset.
  const file = `/brand/jk-${variant}.png`;

  const img = (
    <Image
      src={file}
      alt="JOBKREATORS"
      width={w}
      height={h}
      quality={95}
      priority={priority}
      sizes={`${widthPx}px`}
      style={{ height: heightPx, width: "auto" }}
      className={cn("object-contain select-none", surface === "bare" && className)}
    />
  );

  if (surface === "bare") return img;

  // "tile" — a deliberate cream brand stamp for dark surfaces (Stripe/Linear
  // style), NOT a giant white card. Padding scales with the logo height; larger
  // logos get the softer xl radius.
  const pad = Math.round(heightPx * 0.08);
  const radius = heightPx >= NAMED_HEIGHTS.lg ? "var(--radius-xl)" : "var(--radius-lg)";

  return (
    <span
      className={cn("inline-flex items-center justify-center", className)}
      style={{
        background: "#F4F5F0",
        borderRadius: radius,
        border: "1px solid rgba(21, 42, 55, 0.08)",
        boxShadow: "var(--shadow-sm)",
        padding: pad,
      }}
    >
      {img}
    </span>
  );
}
