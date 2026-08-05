"use client";

import Link from "next/link";
import { useUser, SignOutButton } from "@clerk/nextjs";
import Logo from "@/components/Logo";

// Shown when a signed-in user is authenticated but NOT on the admin allowlist.
export default function NotAuthorizedPage() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-bg px-4 py-16 text-center">
      <Logo variant="mark" size={44} />
      <div className="max-w-md">
        <h1 className="font-display text-h2 text-text">Access not authorized</h1>
        <p className="mt-2 text-body text-text-muted">
          Your account
          {email ? (
            <>
              {" "}
              (<span className="font-medium text-text">{email}</span>)
            </>
          ) : null}{" "}
          isn&apos;t authorized to access the admin portal. Contact{" "}
          <a href="mailto:admin@jobkreators.com" className="text-accent hover:underline">
            admin@jobkreators.com
          </a>{" "}
          to request access.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <SignOutButton redirectUrl="/">
          <button className="inline-flex h-11 items-center rounded-lg bg-accent px-6 text-body-sm font-semibold text-accent-fg hover:bg-accent-2">
            Sign out
          </button>
        </SignOutButton>
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-lg border border-border-strong bg-surface px-6 text-body-sm font-medium text-text hover:border-accent"
        >
          Back to homepage
        </Link>
      </div>
    </main>
  );
}
