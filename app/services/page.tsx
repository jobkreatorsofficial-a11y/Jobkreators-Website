import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SERVICES, INDUSTRIES } from "@/lib/data";
import { Users, Zap, Code2, Briefcase, GraduationCap, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services — JOBKREATORS",
  description: "Permanent recruitment, bulk hiring, tech/non-tech hiring, and career counseling across all industries.",
};

const iconMap = { Users, Zap, Code2, Briefcase, GraduationCap } as const;

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <section className="py-16 md:py-28 bg-white dark:bg-[#0A0A0A]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-20">
              <p className="text-sm font-medium text-[#0066FF] tracking-widest uppercase mb-3">What we do</p>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-[#1D1D1F] dark:text-white mb-6">
                Every service you need<br />
                <span className="gradient-text">to hire the best.</span>
              </h1>
              <p className="text-xl text-[#6E6E73] dark:text-[#A1A1A6] max-w-2xl mx-auto">
                From permanent hires to bulk recruitment, from C-suite to entry level — we do it all.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {SERVICES.map((service) => {
                const Icon = iconMap[service.icon as keyof typeof iconMap];
                return (
                  <div
                    key={service.id}
                    className="p-10 rounded-2xl border border-black/10 dark:border-white/10 bg-[#F5F5F7] dark:bg-[#1A1A1A]"
                  >
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                      style={{ backgroundColor: `${service.color}15` }}
                    >
                      <Icon size={24} style={{ color: service.color }} />
                    </div>
                    <h2 className="text-2xl font-bold text-[#1D1D1F] dark:text-white mb-3">{service.title}</h2>
                    <p className="text-[#6E6E73] dark:text-[#A1A1A6] leading-relaxed mb-6">{service.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {["Fast turnaround", "Vetted candidates", "90-day guarantee"].map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-white dark:bg-[#0A0A0A] border border-black/10 dark:border-white/10 text-[#6E6E73] dark:text-[#A1A1A6]"
                        >
                          <CheckCircle2 size={10} color={service.color} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Industries */}
        <section className="py-20 bg-[#F5F5F7] dark:bg-[#0A0A0A]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-[#1D1D1F] dark:text-white text-center mb-12">
              Industries we serve
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {INDUSTRIES.map((industry) => (
                <span
                  key={industry}
                  className="px-5 py-2.5 rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-[#1A1A1A] text-sm font-medium text-[#1D1D1F] dark:text-white"
                >
                  {industry}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
