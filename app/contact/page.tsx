import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SITE } from "@/lib/data";
import { Phone, Mail, MessageCircle, MapPin, ArrowRight } from "lucide-react";
import { LinkedInIcon, InstagramIcon } from "@/components/ui/SocialIcons";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — JOBKREATORS",
  description: "Get in touch with JOBKREATORS for recruitment and consultancy inquiries.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <section className="py-16 md:py-28 bg-white dark:bg-[#0A0A0A]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-sm font-medium text-[#0066FF] tracking-widest uppercase mb-3">Get in touch</p>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-[#1D1D1F] dark:text-white mb-4">
                Let&apos;s build your team
              </h1>
              <p className="text-xl text-[#6E6E73] dark:text-[#A1A1A6] max-w-xl mx-auto">
                Reach out via any channel — our team responds within 4 business hours.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Phone,
                  label: "Call Us",
                  value: SITE.phone,
                  href: `tel:${SITE.phone}`,
                  color: "#0066FF",
                  desc: "Mon–Sat, 9am–7pm IST",
                },
                {
                  icon: MessageCircle,
                  label: "WhatsApp",
                  value: "Chat instantly",
                  href: `https://wa.me/${SITE.whatsapp.replace("+", "")}`,
                  color: "#25D366",
                  desc: "Fastest response — usually within minutes",
                },
                {
                  icon: Mail,
                  label: "Email",
                  value: SITE.email,
                  href: `mailto:${SITE.email}`,
                  color: "#6366F1",
                  desc: "Detailed inquiries & JD submissions",
                },
                {
                  icon: MapPin,
                  label: "Headquarters",
                  value: "Agra, Uttar Pradesh",
                  href: "#",
                  color: "#F59E0B",
                  desc: "Serving Pan-India and beyond",
                },
                {
                  icon: LinkedInIcon,
                  label: "LinkedIn",
                  value: "JOBKREATORS",
                  href: SITE.linkedin,
                  color: "#0A66C2",
                  desc: "Follow for hiring insights",
                },
                {
                  icon: InstagramIcon,
                  label: "Instagram",
                  value: "@job_kreators",
                  href: SITE.instagram,
                  color: "#E1306C",
                  desc: "Behind the scenes & success stories",
                },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group flex flex-col gap-4 p-8 rounded-2xl border border-black/10 dark:border-white/10 bg-[#F5F5F7] dark:bg-[#1A1A1A] hover:border-[#0066FF]/40 hover:-translate-y-1 transition-all duration-200"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${item.color}15` }}
                  >
                    <item.icon size={20} color={item.color} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#6E6E73] dark:text-[#A1A1A6] uppercase tracking-wide mb-1">
                      {item.label}
                    </p>
                    <p className="text-base font-semibold text-[#1D1D1F] dark:text-white group-hover:text-[#0066FF] transition-colors">
                      {item.value}
                    </p>
                    <p className="text-xs text-[#6E6E73] dark:text-[#A1A1A6] mt-1">{item.desc}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: item.color }}>
                    Open <ArrowRight size={12} />
                  </div>
                </a>
              ))}
            </div>

            {/* Quick action CTAs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
              <div className="p-10 rounded-2xl bg-[#0066FF] text-white text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                <h2 className="text-2xl font-bold mb-3">Hiring someone?</h2>
                <p className="text-white/80 mb-6">Submit your role and get a curated shortlist in 5-8 days.</p>
                <Link href="/submit-role" className="inline-flex items-center gap-2 bg-white text-[#0066FF] font-bold px-6 py-3 rounded-full hover:bg-[#F5F5F7] transition-all">
                  Submit a Role <ArrowRight size={16} />
                </Link>
              </div>
              <div className="p-10 rounded-2xl border border-black/10 dark:border-white/10 bg-[#F5F5F7] dark:bg-[#1A1A1A] text-center">
                <h2 className="text-2xl font-bold text-[#1D1D1F] dark:text-white mb-3">Looking for a job?</h2>
                <p className="text-[#6E6E73] dark:text-[#A1A1A6] mb-6">Submit your CV — 100% free, no hidden fees.</p>
                <Link href="/submit-cv" className="inline-flex items-center gap-2 bg-[#1D1D1F] dark:bg-white text-white dark:text-[#1D1D1F] font-bold px-6 py-3 rounded-full hover:opacity-90 transition-all">
                  Submit Your CV <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
