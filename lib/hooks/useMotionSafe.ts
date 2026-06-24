"use client";

import { useEffect, useState } from "react";

/**
 * useMotionSafe — the canonical motion-safety primitive for JOBKREATORS.
 *
 * Returns `false` when the user has requested reduced motion
 * (`prefers-reduced-motion: reduce`), and `true` otherwise. Every
 * framer-motion component in the site gates its animation on this hook so a
 * single source of truth honors the OS-level accessibility setting:
 *
 *   const motionSafe = useMotionSafe();
 *   <motion.div animate={motionSafe ? { y: 0 } : false} ... />
 *
 * It SSR-renders as `false` (reduced/no-motion) and resolves on mount, so the
 * server never emits motion a reduced-motion user would see, and it reacts live
 * if the OS setting changes mid-session.
 *
 * CSS animations are handled separately by the global
 * `@media (prefers-reduced-motion: reduce)` block in app/globals.css.
 */
export function useMotionSafe(): boolean {
  const [motionSafe, setMotionSafe] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotionSafe(!query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return motionSafe;
}

export default useMotionSafe;
