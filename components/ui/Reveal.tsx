"use client";

import { motion } from "framer-motion";
import { useMotionSafe } from "@/lib/hooks/useMotionSafe";

type RevealProps = {
  /** Stagger delay in seconds. */
  delay?: number;
  className?: string;
  children: React.ReactNode;
};

/**
 * Reveal — the canonical reveal-on-scroll wrapper. Fades + lifts its children
 * into view once, and is gated on useMotionSafe(): reduced-motion users get the
 * content immediately with no transform. Keeps every section's scroll animation
 * consistent and accessible in one place.
 */
export default function Reveal({ delay = 0, className, children }: RevealProps) {
  const motionSafe = useMotionSafe();

  if (!motionSafe) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
