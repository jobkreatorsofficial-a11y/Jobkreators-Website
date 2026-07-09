"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
            <Logo variant="wordmark" size={28} priority />
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
              className="rounded-full p-2 text-text transition-colors hover:bg-surface-2 md:hidden"
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
              onClick={() => setMobileOpen(false)}
              aria-hidden
            />
            <motion.div
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
