import Image from "next/image";
import { cn } from "@/lib/cn";

type Variant = "mark" | "wordmark" | "lockup";
type NamedSize = "sm" | "md" | "lg" | "xl";

type LogoProps = {
  variant?: Variant;
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
 * wordmark + cyan tagline); the brand identity is never recolored.
 *
 * The cream brand tile is now AUTOMATIC and theme-driven, with no client JS:
 *   - LIGHT theme → the logo sits bare on the warm-white page (a cream tile on
 *     a cream-ish page would only compete), so the wrapper is invisible.
 *   - DARK theme  → `dark:` utilities seat the unchanged logo on a refined cream
 *     stamp (Stripe/Linear style), NOT a giant white card.
 * Because this is pure CSS keyed on <html data-theme>, SSR is correct in both
 * themes and there is no mount-time flicker or layout shift on hydration.
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

  // Original colors, always. No theme/surface branching on the asset itself.
  const file = `/brand/jk-${variant}.png`;

  // Tile geometry (applied only in dark via dark:* below). Padding scales with the
  // logo height; larger logos get the softer xl radius. Passed as CSS vars so the
  // dark-only utilities can consume per-instance values.
  const pad = Math.round(heightPx * 0.08);
  const radius = heightPx >= NAMED_HEIGHTS.lg ? "var(--radius-xl)" : "var(--radius-lg)";

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center",
        // Dark-only cream brand tile. In light these utilities are inert and the
        // wrapper has zero padding/background → effectively bare.
        "dark:bg-brand-cream dark:p-[var(--logo-pad)] dark:rounded-[var(--logo-radius)]",
        "dark:border dark:border-[color:rgba(21,42,55,0.08)] dark:shadow-[var(--shadow-sm)]",
        className,
      )}
      style={
        {
          "--logo-pad": `${pad}px`,
          "--logo-radius": radius,
        } as React.CSSProperties
      }
    >
      <Image
        src={file}
        alt="JOBKREATORS"
        width={w}
        height={h}
        quality={95}
        priority={priority}
        sizes={`${widthPx}px`}
        style={{ height: heightPx, width: "auto" }}
        className="object-contain select-none"
      />
    </span>
  );
}
