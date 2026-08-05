import type { Metadata } from "next";
import AdminProvider from "@/components/admin/AdminProvider";
import AdminShell from "@/components/admin/AdminShell";

// TODO Phase 2C: wrap in ClerkProvider + require a signed-in admin role
// (redirect unauthenticated users to sign-in). The portal is open for now.
export const metadata: Metadata = {
  title: "Admin — JOBKREATORS",
  robots: { index: false, follow: false }, // never index the admin portal
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // AdminProvider hosts the TanStack Query client; each page fetches its own data
  // from /api/admin/* via hooks in lib/admin/hooks.ts.
  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}
