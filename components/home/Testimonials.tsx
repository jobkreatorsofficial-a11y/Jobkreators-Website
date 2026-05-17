"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { TESTIMONIALS } from "@/lib/data";

export default function Testimonials() {
  const [active, setActive] = useState(0);

  const prev = () => setActive((a) => (a - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setActive((a) => (a + 1) % TESTIMONIALS.length);

  return (
    <section className="py-16 md:py-28 bg-white dark:bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 md:mb-16"
        >
          <p className="text-sm font-medium text-[#0066FF] tracking-widest uppercase mb-3">Testimonials</p>
          <h2 className="text-3xl md:text-5xl font-bold text-[#1D1D1F] dark:text-white">
            What our clients say
          </h2>
        </motion.div>

        {/* All cards grid on desktop, carousel on mobile */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="p-8 rounded-2xl border border-black/10 dark:border-white/10 bg-[#F5F5F7] dark:bg-[#1A1A1A] flex flex-col gap-5"
            >
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} size={14} fill="#0066FF" color="#0066FF" />
                ))}
              </div>
              <p className="text-[#1D1D1F] dark:text-white text-sm leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-black/10 dark:border-white/10">
                <div className="w-10 h-10 rounded-full bg-[#0066FF] flex items-center justify-center text-white text-xs font-bold">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#1D1D1F] dark:text-white">{t.name}</div>
                  <div className="text-xs text-[#6E6E73] dark:text-[#A1A1A6]">{t.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="p-8 rounded-2xl border border-black/10 dark:border-white/10 bg-[#F5F5F7] dark:bg-[#1A1A1A]"
            >
              <div className="flex gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} size={14} fill="#0066FF" color="#0066FF" />
                ))}
              </div>
              <p className="text-[#1D1D1F] dark:text-white text-sm leading-relaxed mb-5">
                &ldquo;{TESTIMONIALS[active].quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0066FF] flex items-center justify-center text-white text-xs font-bold">
                  {TESTIMONIALS[active].avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#1D1D1F] dark:text-white">
                    {TESTIMONIALS[active].name}
                  </div>
                  <div className="text-xs text-[#6E6E73]">{TESTIMONIALS[active].company}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={prev}
              className="p-2 rounded-full border border-black/10 dark:border-white/10 hover:bg-[#0066FF] hover:text-white hover:border-[#0066FF] transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2 items-center">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === active ? "bg-[#0066FF] w-5" : "bg-[#D2D2D7] dark:bg-[#3D3D3D]"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="p-2 rounded-full border border-black/10 dark:border-white/10 hover:bg-[#0066FF] hover:text-white hover:border-[#0066FF] transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
