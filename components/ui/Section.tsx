import { cn } from "@/lib/cn";

type SectionProps = {
  /** Background elevation. "default" = page bg, others step up the surface. */
  surface?: "default" | "subtle" | "elevated";
  /** Anchor target id for in-page scrolling. */
  id?: string;
  className?: string;
  children: React.ReactNode;
};

const SURFACES: Record<NonNullable<SectionProps["surface"]>, string> = {
  default: "bg-bg",
  subtle: "bg-surface",
  elevated: "bg-surface-2",
};

/**
 * Section — vertical rhythm wrapper for a page region. Owns the section's
 * vertical padding (py-24, md:py-32) and optional surface elevation so every
 * section stacks consistently. Pair with <Container> for horizontal layout.
 */
export default function Section({
  surface = "default",
  id,
  className,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "py-16 md:py-24 lg:py-32",
        SURFACES[surface],
        // Smooth-scroll anchors clear the fixed navbar.
        id && "scroll-mt-24",
        className,
      )}
    >
      {children}
    </section>
  );
}
