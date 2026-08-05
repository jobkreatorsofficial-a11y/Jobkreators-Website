"use client";

import { usePathname } from "next/navigation";
import AdminProvider from "./AdminProvider";
import AdminShell from "./AdminShell";

// Auth-flow pages that must render BARE (centered card, no sidebar/topbar).
const BARE_ROUTES = ["/admin/sign-in", "/admin/sign-up", "/admin/not-authorized"];

/**
 * Decides the admin chrome. The auth pages (sign-in / sign-up / not-authorized)
 * live under /admin but must NOT get the portal sidebar + data provider, so they
 * render bare. Every other /admin page gets AdminProvider + AdminShell.
 */
export default function AdminChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (BARE_ROUTES.some((p) => pathname.startsWith(p))) return <>{children}</>;

  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}
