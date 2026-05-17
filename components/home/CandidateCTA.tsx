"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function CandidateCTA() {
  return (
    <section className="py-20 bg-[#0066FF] relative overflow-hidden">
      {/* Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-white/70 text-sm font-medium uppercase tracking-widest mb-2">For Job Seekers</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Looking for your dream job?
            </h2>
            <div className="flex flex-wrap gap-4 text-white/90 text-sm">
              {[
                "100% free for candidates",
                "Browse 500+ open roles",
                "Expert career guidance",
              ].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <CheckCircle2 size={14} />
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto"
          >
            <Link
              href="/submit-cv"
              className="flex items-center justify-center gap-2 bg-white text-[#0066FF] font-bold px-8 py-4 rounded-full hover:bg-[#F5F5F7] transition-all duration-200 hover:scale-105 shadow-lg"
            >
              Submit Your CV
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/jobs"
              className="flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white font-bold px-8 py-4 rounded-full hover:bg-white/10 transition-all duration-200"
            >
              Browse Jobs
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
