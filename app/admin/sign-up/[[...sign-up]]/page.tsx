import Link from "next/link";
import Logo from "@/components/Logo";

// Admin sign-up is intentionally NOT a public Clerk flow — access is invite-only.
export default function AdminSignUpPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-bg px-4 py-16 text-center">
      <Logo variant="mark" size={44} />
      <div className="max-w-md">
        <h1 className="font-display text-h2 text-text">Access is invite-only</h1>
        <p className="mt-2 text-body text-text-muted">
          The JOBKREATORS admin portal has no public sign-up. Access is granted by an
          existing admin — contact{" "}
          <a href="mailto:admin@jobkreators.com" className="text-accent hover:underline">
            admin@jobkreators.com
          </a>
          .
        </p>
      </div>
      <Link
        href="/admin/sign-in"
        className="inline-flex h-11 items-center rounded-lg bg-accent px-6 text-body-sm font-semibold text-accent-fg hover:bg-accent-2"
      >
        Back to sign-in
      </Link>
    </main>
  );
}
