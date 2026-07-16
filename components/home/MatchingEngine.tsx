"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useMotionSafe } from "@/lib/hooks/useMotionSafe";

/**
 * MatchingEngine — the signature "AI Matching Engine" visual (the screenshot
 * moment of the site). A constellation of candidate-profile nodes drifts in a
 * 400×400 SVG; match lines continuously form from candidates to a central
 * accent-cyan shortlist cluster; a scanline sweeps top→bottom; three floating
 * stat chips frame the viz.
 *
 * Deterministic by construction (no Math.random) so SSR and the first client
 * render are identical. Drift/lines/scanline are transform/opacity-only and are
 * gated on useMotionSafe() AND on being in view (IntersectionObserver), so the
 * animation pauses off-screen and renders a static, fully-drawn snapshot for
 * reduced-motion users.
 */

// Round numeric SVG coordinates to a fixed precision so Node (SSR) and the
// browser serialize them to identical strings. 2 digits is visually exact for
// these 400×400 coords; the hydration mismatch only appears past ~6 digits,
// where Node's and the browser's float→string formatting diverge.
const round = (n: number, digits = 2) => Number(n.toFixed(digits));

const VIEW = 400;
const CENTER = { x: 200, y: 196 };

type Node = { x: number; y: number; r: number; driftX: number; driftY: number; dur: number };

// Candidate constellation — golden-angle spiral, deterministic. Spread around the
// shortlist, varied radii (depth) and sizes.
const GOLDEN = 2.399963229728653; // ~137.5° in radians
const CANDIDATES: Node[] = Array.from({ length: 22 }, (_, i) => {
  const angle = i * GOLDEN;
  const radius = 78 + (i % 6) * 22 + ((i * 13) % 17);
  const x = CENTER.x + Math.cos(angle) * radius;
  const y = CENTER.y + Math.sin(angle) * radius * 0.92;
  return {
    x: round(Math.max(18, Math.min(VIEW - 18, x))),
    y: round(Math.max(18, Math.min(VIEW - 30, y))),
    r: round(2.5 + (i % 3) * 1.3),
    driftX: round(((i % 5) - 2) * 1.6),
    driftY: round((((i + 2) % 5) - 2) * 1.6),
    dur: round(3.2 + (i % 5) * 0.7),
  };
});

// Central shortlist — a tight 5-node accent cluster, "the matches".
const SHORTLIST: Node[] = [
  { x: CENTER.x, y: CENTER.y - 14, r: 5, driftX: 0, driftY: 0, dur: 4 },
  { x: CENTER.x - 16, y: CENTER.y + 4, r: 5.5, driftX: 0, driftY: 0, dur: 4 },
  { x: CENTER.x + 16, y: CENTER.y + 4, r: 5.5, driftX: 0, driftY: 0, dur: 4 },
  { x: CENTER.x - 8, y: CENTER.y + 18, r: 4.5, driftX: 0, driftY: 0, dur: 4 },
  { x: CENTER.x + 9, y: CENTER.y + 18, r: 4.5, driftX: 0, driftY: 0, dur: 4 },
];

const SLOTS = [0, 1, 2]; // three concurrent match lines

const STAT_CHIPS = [
  { value: "500K+", label: "Profiles scanned", pos: "left-3 top-11 md:left-4 md:top-12" },
  { value: "94%", label: "Match accuracy", pos: "right-3 top-1/2 -translate-y-1/2 md:right-4" },
  { value: "24h", label: "Avg shortlist time", pos: "bottom-3 right-3 md:bottom-4 md:right-4" },
] as const;

export default function MatchingEngine() {
  const motionSafe = useMotionSafe();
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [tick, setTick] = useState(0);
  // Mobile thins the constellation for clarity/perf. SSR + first client render use
  // the full set (no hydration mismatch); the effect trims afterward.
  const [visibleCount, setVisibleCount] = useState(CANDIDATES.length);
  // Live "matches today" ticker — deterministic initial value (SSR-safe), then
  // increments client-side while animating.
  const [matchCount, setMatchCount] = useState(1247);
  // Which 2–3 candidate nodes are actively "scanning" (pulsing) right now.
  const [pulseSet, setPulseSet] = useState<number[]>([]);
  const [pulseTick, setPulseTick] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const apply = () => setVisibleCount(mq.matches ? 11 : CANDIDATES.length);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.15,
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Advance the match-line cycle only while animating + visible.
  useEffect(() => {
    if (!motionSafe || !inView) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 1500);
    return () => window.clearInterval(id);
  }, [motionSafe, inView]);

  // Live "matches today" ticker — +1 every 3–5s while animating. Each increment
  // re-keys the shortlist ripple below for a one-shot pulse.
  useEffect(() => {
    if (!motionSafe || !inView) return;
    let timer = 0;
    const schedule = () => {
      timer = window.setTimeout(() => {
        setMatchCount((c) => c + 1);
        schedule();
      }, 3000 + Math.random() * 2000);
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, [motionSafe, inView]);

  // Rotate which 2–3 candidate nodes are "scanning" every ~1.5s.
  useEffect(() => {
    if (!motionSafe || !inView) return;
    const pick = () => {
      const n = Math.min(visibleCount, CANDIDATES.length);
      const out: number[] = [];
      while (out.length < 3 && out.length < n) {
        const r = Math.floor(Math.random() * n);
        if (!out.includes(r)) out.push(r);
      }
      setPulseSet(out);
      setPulseTick((t) => t + 1);
    };
    pick();
    const id = window.setInterval(pick, 1500);
    return () => window.clearInterval(id);
  }, [motionSafe, inView, visibleCount]);

  const candidates = CANDIDATES.slice(0, visibleCount);
  const animating = motionSafe && inView;

  // For each match line slot pick a candidate (varied by tick) → a shortlist node.
  const lines = SLOTS.map((slot) => {
    const from = candidates[(tick * 3 + slot * 7) % candidates.length];
    const to = SHORTLIST[slot % SHORTLIST.length];
    return { slot, from, to };
  });

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-[460px] rounded-2xl border border-border-strong bg-surface p-4 shadow-[var(--shadow-lg)] [--me-node-bump:1px] md:p-6 dark:bg-surface-2 dark:shadow-[var(--shadow-glow-accent)] dark:[--me-node-bump:0px]"
    >
      {/* Technical dot-grid texture — LIGHT only; gives the white card surface
          character (Vercel-style). Invisible on the dark glowing card. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 rounded-2xl dark:hidden"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--color-brand-navy) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
          opacity: 0.03,
        }}
      />

      {/* LIVE status — signals a live system, not a static diagram. The dot pulse
          + the SCANNING loader are gated on motion-safety. */}
      <div className="absolute left-4 top-4 z-20 flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <span className="relative inline-flex h-1.5 w-1.5" aria-hidden>
            {motionSafe && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-bright opacity-75" />
            )}
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-bright" />
          </span>
          <span className="text-[10px] font-medium uppercase tracking-tight text-text-subtle">
            Live matching
          </span>
        </div>
        <div className="flex items-center pl-3 text-[10px] uppercase tracking-tight text-text-subtle">
          Scanning
          <span aria-hidden className="inline-flex w-3 justify-start">
            {animating ? (
              [0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
                >
                  .
                </motion.span>
              ))
            ) : (
              <span>…</span>
            )}
          </span>
        </div>
      </div>

      {/* Live "matches today" ticker — top-right. Deterministic initial value keeps
          SSR + first client render identical; it increments client-side. */}
      <div className="absolute right-4 top-4 z-20 text-right">
        <div className="font-display text-body-sm font-bold tabular-nums leading-none text-accent">
          {matchCount.toLocaleString("en-US")}
        </div>
        <div className="mt-0.5 text-[10px] uppercase tracking-tight text-text-subtle">
          matches today
        </div>
      </div>

      <svg
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        className="relative z-10 h-auto w-full"
        role="img"
        aria-label="AI matching engine visualization: candidate profiles being matched into a shortlist"
      >
        <defs>
          <radialGradient id="me-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="me-scan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--color-accent)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Scanline sweep */}
        {animating && (
          <motion.rect
            x={0}
            width={VIEW}
            height={70}
            fill="url(#me-scan)"
            initial={{ y: -70 }}
            animate={{ y: VIEW }}
            transition={{ duration: 4, ease: "linear", repeat: Infinity }}
          />
        )}

        {/* Soft glow behind the shortlist core */}
        <circle cx={CENTER.x} cy={CENTER.y} r={70} fill="url(#me-core)" />

        {/* Match lines */}
        {lines.map(({ slot, from, to }) =>
          animating ? (
            <motion.line
              key={`${slot}-${tick}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="var(--color-accent)"
              strokeWidth={1}
              strokeLinecap="round"
              className="[stroke-width:1.5px] dark:[stroke-width:1px]"
              initial={{ pathLength: 0, opacity: 0.85 }}
              animate={{ pathLength: 1, opacity: [0.85, 0.85, 0] }}
              transition={{ duration: 1.4, times: [0, 0.57, 1], ease: [0.16, 1, 0.3, 1] }}
            />
          ) : (
            // Static snapshot: all match lines drawn.
            <line
              key={`${slot}-static`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="var(--color-accent)"
              strokeWidth={1}
              strokeLinecap="round"
              className="opacity-60 [stroke-width:1.5px] dark:opacity-50 dark:[stroke-width:1px]"
            />
          ),
        )}

        {/* Candidate nodes */}
        {candidates.map((n, i) =>
          animating ? (
            <motion.circle
              key={`c-${i}`}
              cx={n.x}
              cy={n.y}
              r={n.r}
              fill="var(--color-text-subtle)"
              style={{ r: `calc(${n.r}px + var(--me-node-bump, 0px))` }}
              initial={{ x: 0, y: 0 }}
              animate={{ x: [0, n.driftX, 0], y: [0, n.driftY, 0] }}
              transition={{ duration: n.dur, ease: "easeInOut", repeat: Infinity }}
            />
          ) : (
            <circle
              key={`c-${i}`}
              cx={n.x}
              cy={n.y}
              r={n.r}
              fill="var(--color-text-subtle)"
              style={{ r: `calc(${n.r}px + var(--me-node-bump, 0px))` }}
            />
          ),
        )}

        {/* Active-scan highlights — the 2–3 "scanning" candidate nodes light up
            cyan (0 → 1 → 0 over ~1.5s), re-picked each cycle. Overlay only, so the
            underlying node positions/drift are untouched. */}
        {animating &&
          pulseSet.map((idx) => {
            const n = candidates[idx];
            if (!n) return null;
            return (
              <motion.circle
                key={`scan-${idx}-${pulseTick}`}
                cx={n.x}
                cy={n.y}
                r={n.r + 1.5}
                fill="var(--color-accent-bright)"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.9, 0] }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            );
          })}

        {/* Increment ripple — a one-shot accent glow that expands from the
            shortlist on every new match (re-keyed by matchCount). */}
        {animating && (
          <motion.circle
            key={`ripple-${matchCount}`}
            cx={CENTER.x}
            cy={CENTER.y}
            fill="var(--color-accent)"
            initial={{ r: 14, opacity: 0.35 }}
            animate={{ r: 46, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        )}

        {/* Shortlist cluster — accent-filled "matches" */}
        {SHORTLIST.map((n, i) => (
          <g key={`s-${i}`}>
            {animating && (
              <motion.circle
                cx={n.x}
                cy={n.y}
                r={n.r}
                fill="var(--color-accent)"
                className="drop-shadow-[0_1px_1.5px_rgba(21,42,55,0.35)] dark:drop-shadow-none"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.12, 1] }}
                transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity, delay: i * 0.25 }}
                style={{ transformOrigin: `${n.x}px ${n.y}px`, r: `calc(${n.r}px + var(--me-node-bump, 0px))` }}
              />
            )}
            {!animating && (
              <circle
                cx={n.x}
                cy={n.y}
                r={n.r}
                fill="var(--color-accent)"
                className="drop-shadow-[0_1px_1.5px_rgba(21,42,55,0.35)] dark:drop-shadow-none"
                style={{ r: `calc(${n.r}px + var(--me-node-bump, 0px))` }}
              />
            )}
          </g>
        ))}
      </svg>

      {/* Floating stat chips — intentional cards in both themes: white + strong
          border on light (pops on the cream panel), raised surface-3 + subtle
          border on dark. */}
      {STAT_CHIPS.map((chip) => (
        <div
          key={chip.label}
          className={`absolute z-20 ${chip.pos} rounded-xl border border-border-strong bg-surface px-3 py-2 shadow-[var(--shadow-md)] dark:border-border dark:bg-surface-3`}
        >
          <div className="text-h4 font-display font-bold text-accent">{chip.value}</div>
          <div className="text-caption text-text-muted">{chip.label}</div>
        </div>
      ))}
    </div>
  );
}
