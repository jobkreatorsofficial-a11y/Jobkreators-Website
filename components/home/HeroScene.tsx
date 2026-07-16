"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useMotionSafe } from "@/lib/hooks/useMotionSafe";

/**
 * HeroScene — a WebGL-free layered parallax scene for the hero's right side.
 * Three stacked layers at increasing "depth response" give premium depth +
 * sustained motion with CSS + framer-motion only:
 *
 *   Layer 1 (glow)  — a big blurred radial ambient glow; slowest to everything.
 *   Layer 2 (logo)  — the real 2D JOBKREATORS lockup (theme-aware), gentle float.
 *   Layer 3 (chips) — four floating stat chips at varying depths, each drifting.
 *
 * Each layer composes THREE independent transforms via nested elements so they
 * never fight over a single `transform`:
 *   scroll-parallax  →  mouse-parallax (damped spring)  →  idle drift/float.
 *
 * All motion gates on useMotionSafe(); mouse parallax additionally requires a
 * hover-capable (non-touch) device. Mobile drops to a lighter scene.
 */

const SPRING = { stiffness: 150, damping: 30 } as const;

// 8-point (≈circle) drift for the glow — radius 40px, linear 20s loop.
const GLOW_DRIFT = {
  x: [40, 28, 0, -28, -40, -28, 0, 28, 40],
  y: [0, 28, 40, 28, 0, -28, -40, -28, 0],
};

// Per-chip idle drifts.
const CHIP1_DRIFT = { x: [0, 10, 0, -10, 0], y: [0, -10, 0, 10, 0] }; // diamond, 12s
const CHIP2_DRIFT = { x: [0, 0, 0], y: [0, -8, 0] }; // up/down, 5s
const CHIP3_DRIFT = { x: [0, 9, 0, -9, 0], y: [0, 9, 0, -9, 0] }; // diagonal, 10s
const CHIP4_DRIFT = {
  x: [8, 5.6, 0, -5.6, -8, -5.6, 0, 5.6, 8],
  y: [0, 5.6, 8, 5.6, 0, -5.6, -8, -5.6, 0],
}; // small circle, 9s

type ChipProps = {
  style: CSSProperties;
  value: string;
  label: string;
  dot?: boolean;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  scrollY?: MotionValue<number>;
  drift?: { x: number[]; y: number[] };
  driftDur: number;
  driftEase: "linear" | "easeInOut";
  driftActive: boolean;
  motionSafe: boolean;
};

function Chip({
  style,
  value,
  label,
  dot,
  mouseX,
  mouseY,
  scrollY,
  drift,
  driftDur,
  driftEase,
  driftActive,
  motionSafe,
}: ChipProps) {
  return (
    <div className="pointer-events-none absolute z-20" style={style}>
      {/* scroll → mouse → drift */}
      <motion.div style={{ y: scrollY }}>
        <motion.div style={{ x: mouseX, y: mouseY }}>
          <motion.div
            animate={driftActive && drift ? { x: drift.x, y: drift.y } : undefined}
            transition={
              driftActive && drift
                ? { duration: driftDur, ease: driftEase, repeat: Infinity }
                : undefined
            }
          >
            <div className="rounded-xl border border-border-strong bg-surface px-3 py-2 shadow-[var(--shadow-md)] backdrop-blur-sm dark:bg-surface-2/80 dark:shadow-[var(--shadow-glow-accent)] dark:backdrop-blur-md">
              <div className="flex items-center leading-none">
                {dot && (
                  <motion.span
                    aria-hidden
                    className="mr-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent-bright"
                    animate={motionSafe ? { opacity: [0.4, 1, 0.4] } : undefined}
                    transition={motionSafe ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" } : undefined}
                  />
                )}
                <span className="font-display text-[18px] font-bold leading-none text-accent">
                  {value}
                </span>
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-wide text-text-subtle">
                {label}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function HeroScene() {
  const motionSafe = useMotionSafe();
  const sceneRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mqMobile = window.matchMedia("(max-width: 767px)");
    const mqHover = window.matchMedia("(hover: hover)");
    const apply = () => {
      setIsMobile(mqMobile.matches);
      setCanHover(mqHover.matches);
    };
    apply();
    mqMobile.addEventListener("change", apply);
    mqHover.addEventListener("change", apply);
    return () => {
      mqMobile.removeEventListener("change", apply);
      mqHover.removeEventListener("change", apply);
    };
  }, []);

  // Motion gates.
  const mouseActive = motionSafe && canHover;
  const scrollGlobal = motionSafe && !isMobile; // glow + chips scroll
  const scrollLogo = motionSafe; // logo scrolls even on mobile (per fallback)
  const driftChips = motionSafe && !isMobile;

  // --- Mouse parallax: normalized (-1..1) → per-layer damped springs. ---
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const glowMX = useSpring(useTransform(mx, (v) => v * 8), SPRING);
  const glowMY = useSpring(useTransform(my, (v) => v * 8), SPRING);
  const logoMX = useSpring(useTransform(mx, (v) => v * 20), SPRING);
  const logoMY = useSpring(useTransform(my, (v) => v * 20), SPRING);
  const c1MX = useSpring(useTransform(mx, (v) => v * 35), SPRING);
  const c1MY = useSpring(useTransform(my, (v) => v * 35), SPRING);
  const c2MX = useSpring(useTransform(mx, (v) => v * 42), SPRING);
  const c2MY = useSpring(useTransform(my, (v) => v * 42), SPRING);
  const c3MX = useSpring(useTransform(mx, (v) => v * 45), SPRING);
  const c3MY = useSpring(useTransform(my, (v) => v * 45), SPRING);
  const c4MX = useSpring(useTransform(mx, (v) => v * 50), SPRING);
  const c4MY = useSpring(useTransform(my, (v) => v * 50), SPRING);

  // --- Scroll parallax. ---
  const { scrollYProgress } = useScroll({ target: sceneRef, offset: ["start start", "end start"] });
  const glowScrollY = useTransform(scrollYProgress, [0, 1], [0, 30]);
  const logoScrollY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const chipScrollY = useTransform(scrollYProgress, [0, 1], [0, 130]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = sceneRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const handleLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div
      ref={sceneRef}
      className="relative mx-auto h-[400px] w-[320px] sm:w-[400px] md:h-[500px] lg:w-[540px]"
      onMouseMove={mouseActive ? handleMove : undefined}
      onMouseLeave={mouseActive ? handleLeave : undefined}
    >
      {/* LAYER 1 — atmospheric background glow (z-0). */}
      <div className="absolute inset-0 z-0 overflow-visible">
        <motion.div style={{ y: scrollGlobal ? glowScrollY : undefined }}>
          <motion.div style={{ x: glowMX, y: glowMY }}>
            <motion.div
              className="absolute left-[60%] top-[40%] h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.08] blur-[60px] dark:opacity-25"
              style={{ background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)" }}
              animate={motionSafe ? { x: GLOW_DRIFT.x, y: GLOW_DRIFT.y } : undefined}
              transition={motionSafe ? { duration: 20, ease: "linear", repeat: Infinity } : undefined}
              aria-hidden
            />
          </motion.div>
        </motion.div>
      </div>

      {/* LAYER 2 — the logo (z-10, centered). */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <motion.div style={{ y: scrollLogo ? logoScrollY : undefined }}>
          <motion.div style={{ x: logoMX, y: logoMY }}>
            <motion.div
              animate={motionSafe ? { y: [0, -6, 0] } : undefined}
              transition={motionSafe ? { duration: 7, ease: "easeInOut", repeat: Infinity } : undefined}
              className="w-[300px] sm:w-[380px] lg:w-[500px]"
            >
              <Image
                src="/brand/jk-lockup-light.png"
                alt="JOBKREATORS — Recruitment and Consultancy"
                width={1600}
                height={1140}
                quality={95}
                priority
                sizes="(max-width: 640px) 300px, (max-width: 1024px) 380px, 500px"
                className="block h-auto w-full dark:hidden"
              />
              <Image
                src="/brand/jk-lockup-dark.png"
                alt=""
                aria-hidden
                width={1600}
                height={1140}
                quality={95}
                sizes="(max-width: 640px) 300px, (max-width: 1024px) 380px, 500px"
                className="hidden h-auto w-full dark:block"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* LAYER 3 — floating signal chips (z-20). Chips 2 & 3 drop on mobile. */}
      <Chip
        style={{ top: "8%", left: "-5%" }}
        value="500K+"
        label="PROFILES SCANNED"
        mouseX={c1MX}
        mouseY={c1MY}
        scrollY={scrollGlobal ? chipScrollY : undefined}
        drift={CHIP1_DRIFT}
        driftDur={12}
        driftEase="easeInOut"
        driftActive={driftChips}
        motionSafe={motionSafe}
      />
      {!isMobile && (
        <Chip
          style={{ top: "40%", right: "-8%" }}
          value="94%"
          label="MATCH ACCURACY"
          mouseX={c2MX}
          mouseY={c2MY}
          scrollY={scrollGlobal ? chipScrollY : undefined}
          drift={CHIP2_DRIFT}
          driftDur={5}
          driftEase="easeInOut"
          driftActive={driftChips}
          motionSafe={motionSafe}
        />
      )}
      {!isMobile && (
        <Chip
          style={{ bottom: "15%", left: "-2%" }}
          value="72h"
          label="AVG DELIVERY"
          mouseX={c3MX}
          mouseY={c3MY}
          scrollY={scrollGlobal ? chipScrollY : undefined}
          drift={CHIP3_DRIFT}
          driftDur={10}
          driftEase="easeInOut"
          driftActive={driftChips}
          motionSafe={motionSafe}
        />
      )}
      <Chip
        style={{ bottom: "5%", right: "5%" }}
        value="3,247"
        label="LIVE SCANS TODAY"
        dot
        mouseX={c4MX}
        mouseY={c4MY}
        scrollY={scrollGlobal ? chipScrollY : undefined}
        drift={CHIP4_DRIFT}
        driftDur={9}
        driftEase="linear"
        driftActive={driftChips}
        motionSafe={motionSafe}
      />
    </div>
  );
}
