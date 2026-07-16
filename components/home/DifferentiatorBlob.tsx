"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Eyebrow from "@/components/ui/Eyebrow";
import { useMotionSafe } from "@/lib/hooks/useMotionSafe";

/**
 * DifferentiatorBlob — the "our differentiator" visual: a continuously morphing
 * organic blob in brand cyan, with a headline inside that rotates through the
 * steps we handle. The blob morph (framer keyframes on the path `d`) and the word
 * rotation (a 4s swap) run independently.
 *
 * Reduced motion: a static blob + static "every step" — no morph, no rotation.
 */

const EASE = [0.16, 1, 0.3, 1] as const;
const WORDS = ["Sourcing", "Screening", "Matching", "Shortlisting", "Placing", "Retaining"] as const;

// Build a smooth closed blob path from per-vertex radii (Catmull-Rom → cubic
// beziers). Every shape uses the same vertex count, so the command structure is
// identical and framer can interpolate `d` between them for a smooth morph.
function blobPath(radii: number[], cx = 100, cy = 100): string {
  const n = radii.length;
  const pts = radii.map((r, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as const;
  });
  const f = (v: number) => v.toFixed(1);
  let d = `M ${f(pts[0][0])} ${f(pts[0][1])} `;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C ${f(c1x)} ${f(c1y)} ${f(c2x)} ${f(c2y)} ${f(p2[0])} ${f(p2[1])} `;
  }
  return `${d}Z`;
}

// Four organic shapes (6 vertices each) the blob morphs between.
const SHAPES = [
  [74, 64, 80, 66, 76, 62],
  [64, 78, 62, 80, 66, 74],
  [80, 66, 74, 62, 78, 68],
  [66, 76, 68, 80, 62, 78],
].map((r) => blobPath(r));

export default function DifferentiatorBlob() {
  const motionSafe = useMotionSafe();
  const [isMobile, setIsMobile] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Morph + word rotation run only when motion is safe AND we're not on a
  // touch/mobile viewport (continuous SVG morph is a battery cost there).
  const active = motionSafe && !isMobile;

  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % WORDS.length), 4000);
    return () => window.clearInterval(id);
  }, [active]);

  return (
    <div className="relative mx-auto flex aspect-square w-full max-w-sm items-center justify-center">
      {/* Soft cyan glow behind the blob. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl"
      />

      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <radialGradient id="blob-fill" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.08" />
          </radialGradient>
        </defs>
        <motion.path
          d={SHAPES[0]}
          fill="url(#blob-fill)"
          stroke="var(--color-accent)"
          strokeOpacity={0.4}
          strokeWidth={1.4}
          animate={active ? { d: [...SHAPES, SHAPES[0]] } : undefined}
          transition={active ? { duration: 14, ease: "easeInOut", repeat: Infinity } : undefined}
        />
      </svg>

      {/* Rotating headline, centered in the blob. */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <Eyebrow className="justify-center">WE HANDLE</Eyebrow>
        {active ? (
          <div className="mt-2 flex h-[3rem] items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={WORDS[index]}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="font-display text-[2.5rem] font-semibold leading-none tracking-tight text-text"
              >
                {WORDS[index]}
              </motion.span>
            </AnimatePresence>
          </div>
        ) : (
          <span className="mt-2 font-display text-[2.5rem] font-semibold leading-none tracking-tight text-text">
            every step
          </span>
        )}
      </div>
    </div>
  );
}
