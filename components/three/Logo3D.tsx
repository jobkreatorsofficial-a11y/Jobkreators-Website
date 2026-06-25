"use client";

// TODO(cleanup): UNUSED as of the Phase 3 hero rebuild — the hero now ships the
// `MatchingEngine` signature visual instead of this logo wobble. Kept for possible
// future use. If it stays unused, this file plus `three`/`@react-three/*` deps and
// the `transpilePackages: ["three"]` entry in next.config.ts can all be removed.
// (Despite the name + the `three` transpile config, this component is pure
// framer-motion and does not actually use three.js / R3F.)

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Logo from "@/components/Logo";

export default function Logo3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 60, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 18 });

  const tiltX = useTransform(springY, [-0.5, 0.5], ["8deg", "-8deg"]);
  const tiltY = useTransform(springX, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: "1200px" }}
    >
      {/* Mouse parallax tilt */}
      <motion.div
        style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" }}
      >
        {/* Float up/down */}
        <motion.div
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Gentle rock — never exceeds ±22deg so back face is never seen */}
          <motion.div
            animate={{ rotateY: [-22, 22, -22] }}
            transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
            style={{ transformStyle: "preserve-3d" }}
            className="relative w-64 h-64 lg:w-80 lg:h-80 flex items-center justify-center"
          >
            {/* Front face — the refined cream brand tile carries the original
                navy/cyan mark (surface="tile"); the wobble lifts it in 3D. The
                heavy drop shadow follows the tile's rounded shape. */}
            <div
              style={{
                transform: "translateZ(20px)",
                filter: "drop-shadow(0 32px 80px rgba(0,0,0,0.55))",
              }}
            >
              <Logo variant="mark" surface="tile" size={180} priority />
            </div>
          </motion.div>
        </motion.div>

        {/* Shadow on the "ground" that syncs with float */}
        <motion.div
          animate={{ scaleX: [1, 0.88, 1], opacity: [0.5, 0.25, 0.5] }}
          transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
          className="absolute left-1/2 -translate-x-1/2 mt-4"
          style={{
            bottom: "-48px",
            width: "200px",
            height: "16px",
            background: "radial-gradient(ellipse, rgba(124,212,236,0.4) 0%, transparent 70%)",
            filter: "blur(8px)",
          }}
        />

        {/* Floating particles — brand accent / cyan family (matches the tokens). */}
        {[
          { x: -110, y: -70, delay: 0,   size: 6, color: "#7CD4EC" },
          { x:  115, y: -55, delay: 1.0, size: 4, color: "#3DC6E8" },
          { x: -125, y:  55, delay: 2.0, size: 5, color: "#7CD4EC" },
          { x:  120, y:  65, delay: 0.5, size: 4, color: "#5B9FBC" },
          { x:    5, y: -125, delay: 1.5, size: 3, color: "#3DC6E8" },
        ].map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: p.size, height: p.size,
              left: `calc(50% + ${p.x}px)`,
              top:  `calc(50% + ${p.y}px)`,
              backgroundColor: p.color,
              boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            }}
            animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.4, 0.8] }}
            transition={{ duration: 2.5 + i * 0.3, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </motion.div>
    </div>
  );
}
