"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PROCESS } from "@/lib/data";

export default function ProcessSteps() {
  const containerRef = useRef<HTMLDivElement>(null);
  // position:relative is required by Framer Motion useScroll for correct offset calculation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.3"],
  });

  return (
    <section ref={containerRef} className="py-16 md:py-28 bg-white dark:bg-[#0A0A0A] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 md:mb-20"
        >
          <p className="text-sm font-medium text-[#0066FF] tracking-widest uppercase mb-3">How it works</p>
          <h2 className="text-3xl md:text-5xl font-bold text-[#1D1D1F] dark:text-white">
            From requirement to hire.<br />
            <span className="gradient-text">In 4 steps.</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-black/10 dark:bg-white/10 -translate-x-1/2 hidden md:block" />

          <motion.div
            className="absolute left-8 md:left-1/2 top-0 w-px bg-[#0066FF] -translate-x-1/2 origin-top hidden md:block"
            style={{ height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
          />

          <div className="flex flex-col gap-16">
            {PROCESS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className={`flex flex-col md:flex-row items-start md:items-center gap-8 ${
                  i % 2 !== 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Content */}
                <div className={`flex-1 ${i % 2 !== 0 ? "md:text-right" : ""}`}>
                  <span className="text-xs font-bold text-[#0066FF] tracking-widest uppercase">
                    Step {step.step}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold text-[#1D1D1F] dark:text-white mt-2 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[#6E6E73] dark:text-[#A1A1A6] leading-relaxed max-w-sm">
                    {step.description}
                  </p>
                </div>

                {/* Circle node */}
                <div className="relative z-10 shrink-0">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 400 }}
                    className="w-14 h-14 rounded-full bg-[#0066FF] flex items-center justify-center shadow-lg shadow-[#0066FF]/30"
                  >
                    <span className="text-white font-bold text-sm">{step.step}</span>
                  </motion.div>
                </div>

                {/* Spacer */}
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
