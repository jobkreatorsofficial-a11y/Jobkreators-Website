import { cn } from "@/lib/cn";

type EyebrowProps = {
  /** Show a pulsing accent status dot before the label (live/now signals). */
  dot?: boolean;
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
};

/**
 * Eyebrow — uppercase small-caps label for section headers and the hero
 * eyebrow. Uses the `eyebrow` type token (11px, 0.12em tracking). The optional
 * status dot pulses via Tailwind's animate-ping, which the global
 * reduced-motion block in globals.css stills for motion-sensitive users.
 */
export default function Eyebrow({
  dot = false,
  as = "span",
  className,
  children,
}: EyebrowProps) {
  // `as`-prop needs explicit typing when polymorphic; TS otherwise infers this
  // JSX tag's children as `never` (React.ElementType collapse). The cast pins the
  // accepted props/children so children stay valid — do not remove.
  const Tag = as as React.ElementType<{ className?: string; children?: React.ReactNode }>;
  return (
    <Tag
      className={cn(
        "inline-flex items-center gap-2 text-eyebrow uppercase text-accent",
        className,
      )}
    >
      {dot && (
        // Bright-cyan "pop" tier in BOTH themes — small enough to read as a live
        // signal on light; identical to the accent on dark.
        <span className="relative inline-flex h-1.5 w-1.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-bright opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-bright" />
        </span>
      )}
      {children}
    </Tag>
  );
}
