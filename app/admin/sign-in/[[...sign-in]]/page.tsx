"use client";

import { SignIn } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import Logo from "@/components/Logo";
import { clerkThemedAppearance } from "@/lib/clerk-appearance";

export default function AdminSignInPage() {
  const { resolvedTheme } = useTheme();
  // Our own branded header (theme-aware <Logo>) sits above the Clerk card, so hide
  // Clerk's built-in header to avoid a duplicate title/logo.
  const appearance = {
    ...clerkThemedAppearance(resolvedTheme === "dark"),
    elements: { header: "hidden" },
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-bg px-4 py-16">
      <div className="flex flex-col items-center gap-4 text-center">
        <Logo variant="mark" size={44} />
        <div>
          <h1 className="font-display text-h2 text-text">Admin sign-in</h1>
          <p className="mt-1.5 text-body-sm text-text-muted">
            Access restricted to authorized team members.
          </p>
        </div>
      </div>
      <SignIn appearance={appearance} />
    </main>
  );
}
