"use client";

import { motion } from "framer-motion";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";
import { AI_CLAIMS } from "@/lib/data";
import { useMotionSafe } from "@/lib/hooks/useMotionSafe";

const CENTER = { x: 120, y: 120 };
// Compact supporting constellation — deterministic accent nodes around a core.
const NODES = Array.from({ length: 7 }, (_, i) => {
  const angle = (i / 7) * Math.PI * 2;
  return {
    x: CENTER.x + Math.cos(angle) * 78,
    y: CENTER.y + Math.sin(angle) * 78,
    r: 4 + (i % 2) * 2,
    dur: 2.2 + (i % 4) * 0.4,
  };
});

export default function AIDashboard() {
  const motionSafe = useMotionSafe();

  return (
    <Section surface="subtle">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Copy */}
          <Reveal>
            <Eyebrow>OUR DIFFERENTIATOR</Eyebrow>
            <h2 className="mt-3 mb-6 font-display text-display md:text-display-md">
              Powered by <span className="text-accent">AI intelligence,</span> driven by human expertise.
            </h2>
            <p className="mb-10 max-w-[56ch] text-body-lg text-text-muted">
              Our proprietary engine evaluates thousands of profiles per role — then our expert
              consultants curate the final shortlist. You get speed without sacrificing quality.
            </p>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {AI_CLAIMS.map((claim) => (
                <li
                  key={claim}
                  className="flex items-center gap-3 rounded-xl border border-border bg-surface-2 p-4"
                >
                  <span className="h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden />
                  <span className="text-body-sm font-medium text-text">{claim}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Supporting constellation */}
          <Reveal delay={0.1}>
            <div className="relative mx-auto flex w-full max-w-sm items-center justify-center rounded-2xl border border-border bg-surface p-6">
              <svg viewBox="0 0 240 240" className="h-auto w-full" role="img" aria-label="AI matching constellation">
                <defs>
                  <radialGradient id="ai-core" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx={CENTER.x} cy={CENTER.y} r={60} fill="url(#ai-core)" />
                {NODES.map((n, i) => (
                  <line
                    key={`l-${i}`}
                    x1={CENTER.x}
                    y1={CENTER.y}
                    x2={n.x}
                    y2={n.y}
                    stroke="var(--color-border-strong)"
                    strokeWidth={1}
                    strokeDasharray="3 3"
                  />
                ))}
                {NODES.map((n, i) =>
                  motionSafe ? (
                    <motion.circle
                      key={`n-${i}`}
                      cx={n.x}
                      cy={n.y}
                      r={n.r}
                      fill="var(--color-text-subtle)"
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: n.dur, ease: "easeInOut", repeat: Infinity }}
                    />
                  ) : (
                    <circle key={`n-${i}`} cx={n.x} cy={n.y} r={n.r} fill="var(--color-text-subtle)" />
                  ),
                )}
                {/* Core = the curated match */}
                {motionSafe ? (
                  <motion.circle
                    cx={CENTER.x}
                    cy={CENTER.y}
                    r={9}
                    fill="var(--color-accent)"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 2.6, ease: "easeInOut", repeat: Infinity }}
                    style={{ transformOrigin: `${CENTER.x}px ${CENTER.y}px` }}
                  />
                ) : (
                  <circle cx={CENTER.x} cy={CENTER.y} r={9} fill="var(--color-accent)" />
                )}
              </svg>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
