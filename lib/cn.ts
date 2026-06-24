/**
 * cn — tiny className joiner. Filters falsy values so conditional classes
 * (`cond && "..."`) and undefined props drop out cleanly. No clsx/tailwind-merge
 * dependency; the design system avoids conflicting utilities by construction.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export default cn;
