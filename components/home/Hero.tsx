"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MessageCircle, Check } from "lucide-react";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import { buttonClasses, BUTTON_ICON_SIZE } from "@/components/ui/buttonClasses";
import HeroScene from "@/components/home/HeroScene";
import { SITE } from "@/lib/data";
import { useMotionSafe } from "@/lib/hooks/useMotionSafe";

const whatsappHref = `https://wa.me/${SITE.whatsapp.replace("+", "")}`;

const TRUST = [
  "90-day free replacement",
  "100% free for candidates",
  "Since 2019",
];

export default function Hero() {
  const motionSafe = useMotionSafe();
  // Short, staggered fade-up. Disabled entirely for reduced-motion users.
  const fade = (delay: number) =>
    motionSafe
      ? {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] as const },
        }
      : {};

  return (
    <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
      {/* Ambient accent glow (decorative). Softer on light — a heavy glow reads
          cheap on white; a faint tint reads premium. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-0 h-[480px] w-[480px] rounded-full bg-accent/[0.07] blur-[120px] dark:bg-accent/10"
      />

      <Container className="relative">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[3fr_2fr] lg:gap-16">
          {/* Visual — the layered parallax hero scene (glow + lockup + chips).
              Stacks above the text on mobile, sits right on desktop. */}
          <motion.div className="order-first lg:order-last" {...fade(0.15)}>
            <HeroScene />
          </motion.div>

          {/* Text */}
          <div className="flex flex-col gap-6 md:gap-7">
            <motion.div {...fade(0)}>
              <Eyebrow dot>POWERED BY AI · PAN-INDIA</Eyebrow>
            </motion.div>

            <motion.h1
              {...fade(0.05)}
              className="max-w-[16ch] font-display text-display-2xl md:text-display-2xl-md"
            >
              Hire smarter. Hire faster.{" "}
              <span className="text-accent">In 72 hours.</span>
            </motion.h1>

            <motion.p
              {...fade(0.1)}
              className="max-w-[56ch] text-body-lg text-text-muted"
            >
              India&apos;s premium recruitment firm. AI-powered matching, 3,400+ placements, a 94%
              fulfillment rate. Trusted by Scaler, upGrad, Great Learning and 240+ more.
            </motion.p>

            <motion.div {...fade(0.15)} className="flex flex-wrap gap-3">
              <Link href="/submit-role" className={buttonClasses("primary", "lg")}>
                <ArrowRight size={BUTTON_ICON_SIZE.lg} aria-hidden />
                Submit a Role
              </Link>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses("secondary", "lg")}
              >
                <MessageCircle size={BUTTON_ICON_SIZE.lg} aria-hidden />
                WhatsApp Us
              </a>
            </motion.div>

            {/* Trust strip */}
            <motion.ul
              {...fade(0.2)}
              className="flex flex-wrap items-center gap-x-5 gap-y-2 text-caption text-text-muted"
            >
              {TRUST.map((item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <Check size={13} className="text-accent" aria-hidden />
                  {item}
                </li>
              ))}
            </motion.ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
