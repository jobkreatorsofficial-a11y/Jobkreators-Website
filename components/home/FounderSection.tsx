"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { FOUNDER } from "@/lib/data";
import { Quote } from "lucide-react";

export default function FounderSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section ref={ref} className="relative py-16 md:py-28 bg-[#F5F5F7] dark:bg-[#0A0A0A] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Photo */}
          <motion.div
            style={{ y: photoY }}
            className="relative w-full mx-auto max-w-sm lg:max-w-full"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative w-full rounded-2xl overflow-hidden bg-[#1D1D1F]"
              style={{ height: "clamp(380px, 55vw, 580px)" }}
            >
              <Image
                src={FOUNDER.photo}
                alt={FOUNDER.name}
                fill
                className="object-cover object-top grayscale"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                unoptimized
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/60 via-transparent to-transparent" />

              {/* Name badge overlaid on photo */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="glass rounded-xl p-4">
                  <p className="text-white font-bold text-lg">{FOUNDER.name}</p>
                  <p className="text-[#A1A1A6] text-sm">{FOUNDER.title}</p>
                </div>
              </div>
            </motion.div>

            {/* Blue accent */}
            <div className="absolute -top-4 -left-4 w-24 h-24 rounded-2xl bg-[#0066FF]/20 blur-2xl" />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-2xl bg-[#6366F1]/20 blur-2xl" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-sm font-medium text-[#0066FF] tracking-widest uppercase mb-4">The Founder</p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] dark:text-white mb-6">
              Built from a belief that
              <span className="gradient-text"> every job seeker</span> deserves their dream role.
            </h2>

            <div className="relative pl-6 mb-8">
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#0066FF] rounded-full" />
              <Quote size={20} className="text-[#0066FF] mb-3" />
              <p className="text-[#6E6E73] dark:text-[#A1A1A6] text-lg leading-relaxed italic">
                {FOUNDER.story}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              {FOUNDER.background.split(" · ").map((item) => (
                <span
                  key={item}
                  className="px-4 py-2 rounded-full bg-white dark:bg-[#1A1A1A] border border-black/10 dark:border-white/10 text-xs font-medium text-[#1D1D1F] dark:text-white"
                >
                  {item}
                </span>
              ))}
            </div>

            <p className="text-[#1D1D1F] dark:text-white font-bold text-xl">{FOUNDER.name}</p>
            <p className="text-[#0066FF] text-sm font-medium">{FOUNDER.title}, JOBKREATORS</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
