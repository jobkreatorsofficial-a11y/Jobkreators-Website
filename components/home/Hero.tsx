"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { SITE } from "@/lib/data";

const Logo3D = dynamic(() => import("@/components/three/Logo3D"), { ssr: false });

const words = ["Smarter.", "Faster.", "In 72 Hours."];

function AnimatedHeadline() {
  return (
    <div className="overflow-hidden">
      <motion.h1
        className="text-[2.4rem] leading-[1.1] sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight md:leading-[1.05] text-[#1D1D1F] dark:text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Wrap each word in whitespace-nowrap so character spans never break mid-word */}
        <span className="inline-block whitespace-nowrap">
          {"Hire".split("").map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.03, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </span>
        <br />
        {words.map((word, wi) => (
          <span
            key={wi}
            className={`inline-block whitespace-nowrap${wi === words.length - 1 ? " gradient-text" : ""}`}
          >
            {word.split("").map((char, ci) => (
              <motion.span
                key={ci}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.5 + (wi * 8 + ci) * 0.025,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="inline-block"
              >
                {char === " " ? " " : char}
              </motion.span>
            ))}
            {wi < words.length - 1 && " "}
          </span>
        ))}
      </motion.h1>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white dark:bg-[#0A0A0A]">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(#0066FF 1px, transparent 1px), linear-gradient(90deg, #0066FF 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Blue glow */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-[#0066FF]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-[#6366F1]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-12 md:pt-24 md:pb-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left: Content */}
          <div className="flex flex-col gap-6 md:gap-8 relative z-10">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 w-fit px-4 py-2 rounded-full bg-[#0066FF]/10 border border-[#0066FF]/20"
            >
              <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-pulse" />
              <span className="text-[#0066FF] text-sm font-medium">Powered by AI · Pan-India</span>
            </motion.div>

            {/* Headline */}
            <AnimatedHeadline />

            {/* Subline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="text-base md:text-xl text-[#6E6E73] dark:text-[#A1A1A6] max-w-lg leading-relaxed"
            >
              India&apos;s premium recruitment firm. AI-powered matching. 3,400+ placements. 94% fulfillment
              rate. Trusted by Scaler, upGrad, Great Learning and 240+ more.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.4 }}
              className="flex flex-wrap gap-3"
            >
              <Link
                href="/submit-role"
                className="relative group flex items-center gap-2 bg-[#0066FF] text-white font-semibold px-6 py-3.5 rounded-full hover:bg-[#004FCC] transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-[#0066FF]/25"
              >
                <span className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300" />
                Submit a Role
                <ArrowRight size={16} />
              </Link>
              <a
                href={`https://wa.me/${SITE.whatsapp.replace("+", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-transparent border border-[#D2D2D7] dark:border-[#3D3D3D] text-[#1D1D1F] dark:text-white font-semibold px-6 py-3.5 rounded-full hover:border-[#0066FF] hover:text-[#0066FF] transition-all duration-200"
              >
                <MessageCircle size={16} />
                WhatsApp Us
              </a>
            </motion.div>

            {/* Trust micro-line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.8 }}
              className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-[#6E6E73] dark:text-[#6E6E73]"
            >
              <span className="flex items-center gap-1">
                <span className="text-[#0066FF]">✓</span> 90-day free replacement
              </span>
              <span className="hidden sm:block w-px h-3 bg-[#D2D2D7] dark:bg-[#3D3D3D]" />
              <span className="flex items-center gap-1">
                <span className="text-[#0066FF]">✓</span> 100% free for candidates
              </span>
              <span className="hidden sm:block w-px h-3 bg-[#D2D2D7] dark:bg-[#3D3D3D]" />
              <span className="flex items-center gap-1">
                <span className="text-[#0066FF]">✓</span> Since 2019
              </span>
            </motion.div>
          </div>

          {/* Right: 3D Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-[320px] sm:h-[420px] lg:h-[600px]"
          >
            <Logo3D />
            {/* Glow under 3D */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-12 bg-[#0066FF]/30 blur-2xl rounded-full" />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="hidden md:flex flex-col items-center gap-2 mt-8 text-[#6E6E73]"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-px h-10 bg-gradient-to-b from-[#0066FF] to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
}
