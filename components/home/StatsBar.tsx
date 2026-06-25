"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";
import { STATS } from "@/lib/data";
import { useMotionSafe } from "@/lib/hooks/useMotionSafe";

// ease-out-expo — matches the --ease-out-expo token used across the site.
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

type StatProps = { value: number; prefix?: string; suffix?: string };

/**
 * Stat — renders the REAL value in SSR markup (crucial for SEO + link previews;
 * the old build shipped 0). On mount, for motion-safe users in view, it runs a
 * ~1.2s count-up toward the real value. JS-off / reduced-motion → the real value
 * just sits there.
 */
function Stat({ value, prefix = "", suffix = "" }: StatProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const motionSafe = useMotionSafe();
  const [display, setDisplay] = useState(value); // SSR + first render = real value

  useEffect(() => {
    if (!motionSafe || !inView) return;
    const duration = 1200;
    let raf = 0;
    let startTs = 0;
    const tick = (ts: number) => {
      if (!startTs) startTs = ts;
      const progress = Math.min((ts - startTs) / duration, 1);
      setDisplay(Math.round(easeOutExpo(progress) * value));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, motionSafe, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {display.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

export default function StatsBar() {
  return (
    <Section surface="subtle" className="border-y border-border">
      <Container>
        <Reveal className="mb-12 text-center">
          <Eyebrow className="justify-center">BY THE NUMBERS</Eyebrow>
          <h2 className="mt-3 font-display text-h1 md:text-h1-md">
            Results that speak for themselves
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3 lg:grid-cols-6">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08}>
              <div className="flex h-full flex-col items-center justify-center gap-1 bg-surface px-4 py-8 text-center">
                <span className="font-display text-h1 font-bold text-text">
                  <Stat
                    value={stat.value}
                    prefix={"prefix" in stat ? stat.prefix : ""}
                    suffix={"suffix" in stat ? stat.suffix : ""}
                  />
                </span>
                <span className="text-caption uppercase text-text-muted">{stat.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
