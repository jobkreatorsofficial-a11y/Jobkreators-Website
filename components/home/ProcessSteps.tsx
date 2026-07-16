"use client";

import { motion } from "framer-motion";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";
import { PROCESS } from "@/lib/data";
import { useMotionSafe } from "@/lib/hooks/useMotionSafe";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function ProcessSteps() {
  const motionSafe = useMotionSafe();

  // One-shot reveal on scroll-in (no lingering/looping):
  //  - steps stagger 150ms apart,
  //  - within each step the number lifts up 8px + fades first,
  //  - the title + description fade in 100ms after the number.
  const container = { hidden: {}, show: { transition: { staggerChildren: 0.15 } } };
  const stepGroup = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
  const numberVariant = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
  };
  const contentVariant = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.45, ease: EASE } },
  };

  // When motion is unsafe, drop all variants so everything renders in place.
  const revealProps = motionSafe
    ? ({ initial: "hidden", whileInView: "show", viewport: { once: true, margin: "-80px" } } as const)
    : {};

  return (
    <Section>
      <Container>
        <Reveal className="mb-14 text-center md:mb-20">
          <Eyebrow className="justify-center">HOW IT WORKS</Eyebrow>
          <h2 className="mt-3 font-display text-display md:text-display-md">
            From requirement to hire. <span className="text-accent">In 4 steps.</span>
          </h2>
        </Reveal>

        <motion.div className="relative" variants={motionSafe ? container : undefined} {...revealProps}>
          {/* Connecting line — horizontal on desktop, vertical on mobile. The base
              hairline sits behind; the accent overlay draws in left→right (~1.5s). */}
          <div aria-hidden className="absolute left-[5px] top-2 bottom-2 w-px bg-border-strong md:left-0 md:right-0 md:top-[7px] md:h-px md:w-auto md:bottom-auto" />
          <motion.div
            aria-hidden
            className="absolute left-[5px] top-2 bottom-2 w-px origin-top bg-gradient-to-b from-accent to-accent/0 md:left-0 md:right-0 md:top-[7px] md:h-px md:w-auto md:origin-left md:bg-gradient-to-r"
            initial={motionSafe ? { scaleX: 0, scaleY: 0 } : false}
            whileInView={{ scaleX: 1, scaleY: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.5, ease: EASE }}
          />

          <div className="grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-8">
            {PROCESS.map((step) => (
              <motion.div
                key={step.step}
                variants={motionSafe ? stepGroup : undefined}
                className="relative flex gap-4 md:flex-col md:gap-0 md:text-center"
              >
                <span
                  aria-hidden
                  className="relative z-10 mt-1.5 h-3 w-3 shrink-0 rounded-full bg-accent shadow-[var(--shadow-glow-accent)] md:mx-auto md:mt-0"
                />
                <div className="md:mt-6">
                  <motion.div
                    variants={motionSafe ? numberVariant : undefined}
                    className="font-display text-display-xl font-bold leading-none text-accent"
                  >
                    {step.step}
                  </motion.div>
                  <motion.div variants={motionSafe ? contentVariant : undefined}>
                    <h3 className="mt-3 mb-2 text-h3 md:text-h3-md">{step.title}</h3>
                    <p className="text-body-sm text-text-muted md:mx-auto md:max-w-[28ch]">
                      {step.description}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
