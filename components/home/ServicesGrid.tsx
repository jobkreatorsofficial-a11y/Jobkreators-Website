"use client";

import { motion } from "framer-motion";
import { Users, Zap, Code2, Briefcase, GraduationCap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { SERVICES } from "@/lib/data";

const iconMap = { Users, Zap, Code2, Briefcase, GraduationCap } as const;

export default function ServicesGrid() {
  return (
    <section className="py-16 md:py-28 bg-white dark:bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 md:mb-16"
        >
          <p className="text-sm font-medium text-[#0066FF] tracking-widest uppercase mb-3">What we do</p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] dark:text-white leading-tight max-w-xl">
              Every hire you need,<br />
              <span className="gradient-text">one firm to trust.</span>
            </h2>
            <Link
              href="/services"
              className="flex items-center gap-2 text-[#0066FF] font-semibold text-sm hover:gap-3 transition-all"
            >
              View all services <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((service, i) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap];
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className={`relative group p-8 rounded-2xl border border-black/10 dark:border-white/10 bg-[#F5F5F7] dark:bg-[#1A1A1A] cursor-pointer overflow-hidden ${
                  i === 0 ? "md:col-span-2 lg:col-span-1" : ""
                }`}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${service.color}15 0%, transparent 70%)`,
                  }}
                />

                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform duration-200 group-hover:scale-110"
                  style={{ backgroundColor: `${service.color}15` }}
                >
                  <Icon size={22} style={{ color: service.color }} />
                </div>

                <h3 className="text-xl font-semibold text-[#1D1D1F] dark:text-white mb-3">{service.title}</h3>
                <p className="text-sm text-[#6E6E73] dark:text-[#A1A1A6] leading-relaxed">{service.description}</p>

                <div className="flex items-center gap-1 mt-6 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ color: service.color }}>
                  Learn more <ArrowRight size={12} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
