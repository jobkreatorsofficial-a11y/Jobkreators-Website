"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useMotionSafe } from "@/lib/hooks/useMotionSafe";

/**
 * ThemeToggle — deliberate Sun/Moon switch (enableSystem=false; this is a brand
 * control, not an OS-follower). Light is the default; tapping flips light⇄dark.
 *
 * Rendered only after mount: resolvedTheme is undefined on the server, so a
 * matching-size placeholder holds the layout until hydration to avoid both a
 * mismatch and a reflow. The icon cross-fades via AnimatePresence, gated on
 * useMotionSafe() so reduced-motion users get an instant swap.
 */
export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const motionSafe = useMotionSafe();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Defer past first paint (rAF) rather than setting state synchronously in the
    // effect body — keeps the react-hooks lint rule happy and still flips on mount.
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Placeholder of identical dimensions (p-2 + 18px icon = 34px box) pre-mount.
  if (!mounted) {
    return <span className="inline-block h-[34px] w-[34px]" aria-hidden />;
  }

  const isDark = resolvedTheme === "dark";
  const next = isDark ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} theme`}
      className="relative inline-flex h-[34px] w-[34px] items-center justify-center rounded-full p-2 text-text-muted transition-colors hover:bg-surface-2 hover:text-text"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="moon"
            initial={motionSafe ? { opacity: 0, rotate: -45, scale: 0.6 } : false}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={motionSafe ? { opacity: 0, rotate: 45, scale: 0.6 } : undefined}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex"
          >
            <Moon size={18} aria-hidden />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={motionSafe ? { opacity: 0, rotate: 45, scale: 0.6 } : false}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={motionSafe ? { opacity: 0, rotate: -45, scale: 0.6 } : undefined}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex"
          >
            <Sun size={18} aria-hidden />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
