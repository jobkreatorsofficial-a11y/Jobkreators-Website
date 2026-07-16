"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MessageCircle } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/data";
import { useMotionSafe } from "@/lib/hooks/useMotionSafe";

const whatsappHref = `https://wa.me/${SITE.whatsapp.replace("+", "")}`;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const motionSafe = useMotionSafe();
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Close + return focus to the toggle (used by Escape and the backdrop).
  const closeMenu = useCallback(() => {
    setMobileOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  // Backdrop-blur + hairline only appear after the user scrolls past 40px so the
  // hero reads edge-to-edge at the top.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close the drawer on route change (wrapped call keeps the react-hooks
  // set-state-in-effect rule happy).
  useEffect(() => {
    const close = () => setMobileOpen(false);
    close();
  }, [pathname]);

  // While open: Escape closes, and Tab is trapped inside the drawer.
  useEffect(() => {
    if (!mobileOpen) return;
    const getFocusable = () =>
      drawerRef.current
        ? Array.from(
            drawerRef.current.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
            ),
          )
        : [];
    getFocusable()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
        return;
      }
      if (e.key !== "Tab") return;
      const f = getFocusable();
      if (f.length === 0) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen, closeMenu]);

  return (
    <>
      <motion.header
        initial={motionSafe ? { y: -80, opacity: 0 } : false}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-[var(--duration-slow)] ${
          scrolled
            ? "border-b border-border bg-bg/80 backdrop-blur-md dark:backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center" aria-label="JOBKREATORS home">
            {/* Mark on mobile (the full lockup is illegible at 32px there); full
                lockup from md up. Wrapper spans own the display toggle so they beat
                the Logo's own `inline-flex`. */}
            <span className="md:hidden">
              <Logo variant="mark" size={30} priority />
            </span>
            <span className="hidden md:inline-flex">
              <Logo variant="lockup" size={32} priority />
            </span>
          </Link>

          {/* Desktop nav — left-origin underline draw on hover. */}
          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group/nav relative text-body-sm font-medium text-text-muted transition-colors hover:text-text"
              >
                <span className="relative">
                  {link.label}
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-[var(--duration-base)] ease-[var(--ease-out-expo)] group-hover/nav:scale-x-100" />
                </span>
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-full bg-accent px-4 py-2 text-body-sm font-semibold text-accent-fg shadow-[var(--shadow-glow-accent)] transition-colors hover:bg-accent-2 md:flex"
            >
              <MessageCircle size={14} aria-hidden />
              Hire Now
            </a>

            <button
              ref={menuButtonRef}
              className="flex h-11 w-11 items-center justify-center rounded-full p-3 text-text transition-colors hover:bg-surface-2 md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile drawer — slides in full-height from the right. */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-bg/60 backdrop-blur-sm md:hidden"
              onClick={closeMenu}
              aria-hidden
            />
            <motion.div
              ref={drawerRef}
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              initial={motionSafe ? { x: "100%" } : false}
              animate={{ x: 0 }}
              exit={motionSafe ? { x: "100%" } : undefined}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 right-0 z-50 flex w-[78%] max-w-sm flex-col gap-2 border-l border-border bg-surface px-6 pt-20 md:hidden"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="border-b border-border py-4 text-body-lg font-medium text-text transition-colors hover:text-accent"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="mt-6 flex items-center justify-center gap-2 rounded-full bg-accent py-4 text-body-lg font-semibold text-accent-fg"
              >
                <MessageCircle size={18} aria-hidden />
                Hire Now on WhatsApp
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
