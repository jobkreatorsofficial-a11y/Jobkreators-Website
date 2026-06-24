import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FounderSection from "@/components/home/FounderSection";
import { STATS } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About JOBKREATORS — Premium Recruitment Since 2019",
  description: "Learn about JOBKREATORS, India's AI-powered recruitment firm founded by Akarsh Sharma in 2019.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="py-16 md:py-28 bg-white dark:bg-[#0A0A0A] relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0066FF]/5 rounded-full blur-3xl" />
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
            <p className="text-sm font-medium text-[#0066FF] tracking-widest uppercase mb-4">Our Story</p>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-[#1D1D1F] dark:text-white mb-6 leading-tight">
              Recruitment, reimagined<br />
              <span className="gradient-text">with AI and heart.</span>
            </h1>
            <p className="text-xl text-[#6E6E73] dark:text-[#A1A1A6] max-w-2xl mx-auto leading-relaxed">
              Founded in 2019 in Agra, JOBKREATORS has grown into India&apos;s most trusted AI-powered recruitment
              firm. We believe every company deserves the right talent, and every professional deserves their
              dream role.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 bg-[#F5F5F7] dark:bg-[#0A0A0A]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Our Mission",
                  text: "To eliminate the broken hiring experience — replacing guesswork with AI precision and human empathy.",
                  color: "#0066FF",
                },
                {
                  title: "Our Vision",
                  text: "A world where every job seeker lands their dream role and every company builds their ideal team.",
                  color: "#6366F1",
                },
                {
                  title: "Our Promise",
                  text: "90-day free replacement guarantee. 100% free for candidates. Transparent, fast, and accountable.",
                  color: "#06B6D4",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-8 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-black/10 dark:border-white/10"
                >
                  <div className="w-1 h-12 rounded-full mb-6" style={{ backgroundColor: item.color }} />
                  <h3 className="text-xl font-bold text-[#1D1D1F] dark:text-white mb-3">{item.title}</h3>
                  <p className="text-[#6E6E73] dark:text-[#A1A1A6] leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 bg-white dark:bg-[#0A0A0A]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-[#1D1D1F] dark:text-white text-center mb-12">
              JOBKREATORS by the numbers
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center p-6 rounded-2xl bg-[#F5F5F7] dark:bg-[#1A1A1A]">
                  <div className="text-3xl font-bold text-[#1D1D1F] dark:text-white mb-1">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-xs text-[#6E6E73] dark:text-[#A1A1A6] uppercase tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <FounderSection />
      </main>
      <Footer />
    </>
  );
}
