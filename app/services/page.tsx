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
        <section className="py-16 md:py-28 bg-bg">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-20">
              <p className="text-sm font-medium text-accent tracking-widest uppercase mb-3">What we do</p>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold font-display text-text mb-6">
                Every service you need<br />
                <span className="gradient-text">to hire the best.</span>
              </h1>
              <p className="text-xl text-text-muted max-w-2xl mx-auto">
                From permanent hires to bulk recruitment, from C-suite to entry level — we do it all.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {SERVICES.map((service) => {
                const Icon = iconMap[service.icon as keyof typeof iconMap];
                return (
                  <div
                    key={service.id}
                    className="p-10 rounded-2xl border border-border bg-surface"
                  >
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-accent/10">
                      <Icon size={24} className="text-accent" />
                    </div>
                    <h2 className="text-2xl font-bold font-display text-text mb-3">{service.title}</h2>
                    <p className="text-text-muted leading-relaxed mb-6">{service.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {["Fast turnaround", "Vetted candidates", "90-day guarantee"].map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-bg border border-border text-text-muted"
                        >
                          <CheckCircle2 size={10} className="text-accent" />
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
        <section className="py-20 bg-surface">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl font-bold font-display text-text text-center mb-12">
              Industries we serve
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {INDUSTRIES.map((industry) => (
                <span
                  key={industry}
                  className="px-5 py-2.5 rounded-full border border-border bg-surface-2 text-sm font-medium text-text"
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
