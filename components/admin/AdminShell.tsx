"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, ClerkLoading, ClerkLoaded, useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  Briefcase,
  Inbox,
  Building2,
  MessageSquare,
  Settings,
  Menu,
  X,
} from "lucide-react";
import Logo from "@/components/Logo";
import { clerkThemedAppearance } from "@/lib/clerk-appearance";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/jobs", label: "Jobs", icon: Briefcase, exact: false },
  { href: "/admin/applications", label: "Applications", icon: Inbox, exact: false },
  { href: "/admin/employer-inquiries", label: "Employer Inquiries", icon: Building2, exact: false },
  { href: "/admin/chat-sessions", label: "Chat Sessions", icon: MessageSquare, exact: false },
  { href: "/admin/settings", label: "Settings", icon: Settings, exact: false },
] as const;

function isActive(pathname: string, item: (typeof NAV)[number]) {
  return item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + "/");
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user } = useUser();
  const { resolvedTheme } = useTheme();
  const email = user?.primaryEmailAddress?.emailAddress;

  const navList = (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active = isActive(pathname, item);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-body-sm font-medium transition-colors ${
              active ? "bg-accent/10 text-accent" : "text-text-muted hover:bg-surface-2 hover:text-text"
            }`}
          >
            <item.icon size={18} aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-bg">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-border bg-surface px-4 py-5 lg:flex">
        <Link href="/admin" className="mb-6 flex items-center gap-2 px-2">
          <Logo variant="mark" size={26} />
          <span className="text-body-sm font-semibold text-text">Admin</span>
        </Link>
        {navList}
      </aside>

      <div className="lg:pl-60">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-surface/90 px-4 backdrop-blur-md lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-text hover:bg-surface-2 lg:hidden"
              aria-label="Open admin menu"
            >
              <Menu size={20} aria-hidden />
            </button>
            <Link href="/admin" className="lg:hidden">
              <Logo variant="mark" size={24} />
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {email && <span className="hidden text-body-sm text-text-muted sm:block">{email}</span>}
            {/* Prevent a flash of unauthenticated UI while Clerk resolves. */}
            <ClerkLoading>
              <div className="h-8 w-8 animate-pulse rounded-full bg-surface-2" aria-hidden />
            </ClerkLoading>
            <ClerkLoaded>
              <UserButton appearance={clerkThemedAppearance(resolvedTheme === "dark")} />
            </ClerkLoaded>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-5 py-8 md:px-8">{children}</main>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-40 bg-bg/60 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden />
          <div className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[80%] flex-col border-r border-border bg-surface px-4 py-5">
            <div className="mb-6 flex items-center justify-between px-2">
              <span className="flex items-center gap-2">
                <Logo variant="mark" size={26} />
                <span className="text-body-sm font-semibold text-text">Admin</span>
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-text hover:bg-surface-2"
                aria-label="Close menu"
              >
                <X size={20} aria-hidden />
              </button>
            </div>
            {navList}
            <div className="mt-auto border-t border-border pt-4">
              {email && <p className="px-3 text-caption text-text-subtle">{email}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
