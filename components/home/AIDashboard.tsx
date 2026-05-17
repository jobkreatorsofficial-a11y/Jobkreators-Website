"use client";

import { motion } from "framer-motion";
import { AI_CLAIMS } from "@/lib/data";
import { Cpu, Network, Shield, Zap } from "lucide-react";

const nodes = [
  { id: 1, x: 50, y: 20, label: "AI Engine", icon: Cpu, color: "#0066FF" },
  { id: 2, x: 15, y: 55, label: "Screening", icon: Shield, color: "#6366F1" },
  { id: 3, x: 50, y: 80, label: "Matching", icon: Zap, color: "#06B6D4" },
  { id: 4, x: 85, y: 55, label: "Network", icon: Network, color: "#8B5CF6" },
];

const connections = [
  { from: 1, to: 2 },
  { from: 1, to: 3 },
  { from: 1, to: 4 },
  { from: 2, to: 3 },
  { from: 3, to: 4 },
];

function NodeIcon({ Icon, color }: { Icon: React.ElementType; color: string }) {
  const DynamicIcon = Icon as React.FC<{ size?: number; color?: string }>;
  return <DynamicIcon size={16} color={color} />;
}

export default function AIDashboard() {
  return (
    <section className="py-16 md:py-28 bg-[#0A0A0A] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0066FF]/5 via-transparent to-[#6366F1]/5" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-center">
          {/* Left: Copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-sm font-medium text-[#0066FF] tracking-widest uppercase mb-4">
                Our differentiator
              </p>
              <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
                Powered by{" "}
                <span className="gradient-text">AI intelligence,</span>
                <br />
                driven by human expertise.
              </h2>
              <p className="text-[#A1A1A6] text-lg leading-relaxed mb-10">
                Our proprietary engine evaluates thousands of profiles per role — then our expert consultants
                curate the final shortlist. You get speed without sacrificing quality.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {AI_CLAIMS.map((claim, i) => (
                  <motion.div
                    key={claim}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#0066FF] shrink-0" />
                    <span className="text-sm font-medium text-white">{claim}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Animated Dashboard */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl border border-white/10 bg-[#1A1A1A] p-8 overflow-hidden">
              {/* Header bar */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28C940]" />
                <div className="ml-4 h-5 flex-1 rounded bg-white/5 flex items-center px-3">
                  <span className="text-[#6E6E73] text-xs">JOBKREATORS · AI Matching Engine</span>
                </div>
              </div>

              {/* Network visualization */}
              <div className="relative h-64">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {connections.map((conn) => {
                    const from = nodes.find((n) => n.id === conn.from)!;
                    const to = nodes.find((n) => n.id === conn.to)!;
                    return (
                      <motion.line
                        key={`${conn.from}-${conn.to}`}
                        x1={from.x}
                        y1={from.y}
                        x2={to.x}
                        y2={to.y}
                        stroke="#0066FF"
                        strokeWidth="0.4"
                        strokeOpacity={0.3}
                        strokeDasharray="2 2"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                      />
                    );
                  })}
                </svg>

                {nodes.map((node, i) => {
                  const Icon = node.icon;
                  return (
                    <motion.div
                      key={node.id}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.15, type: "spring", stiffness: 300 }}
                      className="absolute flex flex-col items-center gap-1"
                      style={{
                        left: `${node.x}%`,
                        top: `${node.y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <motion.div
                        animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ repeat: Infinity, duration: 2 + i * 0.5 }}
                        className="w-10 h-10 rounded-xl flex items-center justify-center border"
                        style={{
                          backgroundColor: `${node.color}20`,
                          borderColor: `${node.color}40`,
                        }}
                      >
                        <NodeIcon Icon={Icon} color={node.color} />
                      </motion.div>
                      <span className="text-[8px] font-medium text-[#A1A1A6] whitespace-nowrap">
                        {node.label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Bottom stats row */}
              <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/10">
                {[
                  { label: "Profiles Scanned", value: "500K+" },
                  { label: "Match Accuracy", value: "94%" },
                  { label: "Avg. Shortlist Time", value: "24h" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-lg font-bold text-white">{stat.value}</div>
                    <div className="text-[9px] text-[#6E6E73] uppercase tracking-wide">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
