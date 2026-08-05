import type { Metadata } from "next";
import AdminChrome from "@/components/admin/AdminChrome";

// The whole /admin surface is gated by Clerk in proxy.ts (sign-in + email
// allowlist). This layout only owns metadata + chrome selection.
export const metadata: Metadata = {
  title: "Admin — JOBKREATORS",
  robots: { index: false, follow: false }, // never index the admin portal
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // AdminChrome renders the portal shell for real admin pages, and nothing (bare)
  // for the sign-in / not-authorized pages.
  return <AdminChrome>{children}</AdminChrome>;
}
