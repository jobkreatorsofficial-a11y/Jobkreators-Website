import { dark } from "@clerk/themes";

// JOBKREATORS design tokens applied to Clerk's components (replaces Clerk purple).
// colorPrimary is the deeper accent #1C7C99 in BOTH themes — it clears WCAG AA as a
// white-on-accent button fill (4.77:1); the bright #7CD4EC would fail as a fill.
const variables = {
  colorPrimary: "#1c7c99",
  borderRadius: "0.5rem",
  fontFamily: "var(--font-inter)",
};

// Provider-level appearance (ClerkProvider sits ABOVE ThemeProvider, so this is
// static — used for globally-rendered Clerk UI like the UserButton popover).
export const clerkBaseAppearance = {
  variables,
  layout: { logoImageUrl: "/brand/jk-mark-light.png", logoLinkUrl: "/" },
};

// Component-level appearance — <SignIn>/<UserButton> render inside ThemeProvider,
// so they can be theme-aware: dark baseTheme + the pale mark on the dark theme.
export function clerkThemedAppearance(isDark: boolean) {
  return {
    baseTheme: isDark ? dark : undefined,
    variables,
    layout: {
      logoImageUrl: isDark ? "/brand/jk-mark-dark.png" : "/brand/jk-mark-light.png",
      logoLinkUrl: "/",
    },
  };
}
