import { cn } from "@/lib/cn";

type ContainerProps = {
  /** "narrow" caps width tighter for reading; "wide" relaxes it. */
  size?: "default" | "narrow" | "wide";
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
};

const SIZES: Record<NonNullable<ContainerProps["size"]>, string> = {
  default: "max-w-7xl",
  narrow: "max-w-3xl",
  wide: "max-w-[88rem]",
};

/**
 * Container — horizontal width + gutters for every section's content.
 * Centered, with mobile-first padding that opens up at md.
 */
export default function Container({
  size = "default",
  as: Tag = "div",
  className,
  children,
}: ContainerProps) {
  return (
    <Tag className={cn("mx-auto w-full px-6 md:px-8", SIZES[size], className)}>
      {children}
    </Tag>
  );
}
