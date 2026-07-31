import type { Metadata } from "next";
import AdminProvider from "@/components/admin/AdminProvider";
import AdminShell from "@/components/admin/AdminShell";

// TODO Phase 2: wrap in ClerkProvider + require a signed-in admin role (redirect
// unauthenticated users to sign-in). For now the portal is open + client-state only.
export const metadata: Metadata = {
  title: "Admin — JOBKREATORS",
  robots: { index: false, follow: false }, // never index the admin portal
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}
