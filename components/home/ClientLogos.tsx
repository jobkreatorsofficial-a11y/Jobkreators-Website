"use client";

import { motion } from "framer-motion";
import { CLIENTS, INDUSTRIES } from "@/lib/data";

function LogoCard({ name, abbr }: { name: string; abbr: string }) {
  return (
    <div className="flex-shrink-0 flex items-center gap-3 px-6 py-4 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#1A1A1A] mx-3">
      <div className="w-8 h-8 rounded-lg bg-[#0066FF] flex items-center justify-center text-white text-xs font-bold">
        {abbr}
      </div>
      <span className="text-sm font-semibold text-[#1D1D1F] dark:text-white whitespace-nowrap">{name}</span>
    </div>
  );
}

export default function ClientLogos() {
  return (
    <section className="py-14 md:py-20 bg-[#F5F5F7] dark:bg-[#0A0A0A] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm font-medium text-[#0066FF] tracking-widest uppercase mb-3">Trusted by</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1D1D1F] dark:text-white">
            242+ companies placed their trust in us
          </h2>
        </motion.div>
      </div>

      {/* Clients marquee */}
      <div className="relative overflow-hidden">
        <div className="flex w-max marquee-track">
          {[...CLIENTS, ...CLIENTS].map((client, i) => (
            <LogoCard key={`${client.name}-${i}`} name={client.name} abbr={client.abbr} />
          ))}
        </div>
      </div>

      {/* Industries ticker (reverse direction) */}
      <div className="relative overflow-hidden mt-6">
        <div
          className="flex w-max"
          style={{ animation: "marquee 30s linear infinite reverse" }}
        >
          {[...INDUSTRIES, ...INDUSTRIES].map((industry, i) => (
            <div
              key={`${industry}-${i}`}
              className="flex-shrink-0 px-5 py-2 mx-2 rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-[#1A1A1A] text-xs font-medium text-[#6E6E73] dark:text-[#A1A1A6] whitespace-nowrap"
            >
              {industry}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
