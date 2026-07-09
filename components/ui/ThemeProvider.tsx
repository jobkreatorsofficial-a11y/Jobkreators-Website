"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * ThemeProvider — JOBKREATORS dual-theme root (light default, dark alternative).
 *
 * Drives the `data-theme="light" | "dark"` attribute on <html>, which the token
 * system in app/globals.css swaps on (:root = light defaults,
 * :root[data-theme="dark"] = dark overrides). The matching `@custom-variant dark`
 * makes Tailwind `dark:` utilities respond to this attribute (NOT the OS
 * prefers-color-scheme), so the toggle is a deliberate brand control.
 *
 * - attribute="data-theme"  → writes <html data-theme="…"> (not a .dark class)
 * - defaultTheme="light"    → light is the brand default (per client)
 * - enableSystem={false}    → deliberate Sun/Moon toggle, not OS-following
 * - disableTransitionOnChange → no color-transition flash on load or on switch
 *
 * next-themes injects a pre-paint inline script that sets the attribute before
 * hydration; <html> therefore needs suppressHydrationWarning (set in layout.tsx).
 */
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
