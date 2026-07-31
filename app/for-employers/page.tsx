import type { Metadata } from "next";
import Link from "next/link";
import { Target, Zap, MapPin, UserCheck, FileText, Users, CalendarCheck, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";
import LogoWall from "@/components/home/LogoWall";
import { buttonClasses, BUTTON_ICON_SIZE } from "@/components/ui/buttonClasses";

export const metadata: Metadata = {
  title: "For Employers — Hire Faster with JOBKREATORS",
  description:
    "India's premium recruitment partner. 94% match accuracy, curated shortlists in 72 hours, pan-India reach, and a dedicated account manager. Submit a role.",
  alternates: { canonical: "/for-employers" },
};

const VALUE_PROPS = [
  { icon: Target, stat: "94%", label: "Match accuracy", desc: "AI-ranked, human-curated — only relevant profiles reach you." },
  { icon: Zap, stat: "72 hrs", label: "To first shortlist", desc: "A curated slate of candidates, fast — not a resume dump." },
  { icon: MapPin, stat: "Pan-India", label: "Reach", desc: "500K+ professionals across every major hiring hub." },
  { icon: UserCheck, stat: "1:1", label: "Account manager", desc: "A dedicated partner who owns your search end to end." },
];

const STEPS = [
  { icon: FileText, step: "01", title: "Submit the JD", desc: "Share the role in two minutes — paste it or upload a file." },
  { icon: Users, step: "02", title: "We source & screen", desc: "Our engine and consultants curate a shortlist of the best-fit candidates." },
  { icon: CalendarCheck, step: "03", title: "You interview", desc: "Meet a tight, qualified slate — and hire, with a 90-day replacement guarantee." },
];

export default function ForEmployersPage() {
  return (
    <>
      <Navbar />
      <main id="main">
        {/* Hero */}
        <section className="relative overflow-hidden pb-16 pt-28 md:pb-24 md:pt-36">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 right-0 h-[420px] w-[420px] rounded-full bg-accent/[0.07] blur-[120px] dark:bg-accent/10"
          />
          <Container className="relative">
            <div className="max-w-3xl">
              <Eyebrow dot>FOR EMPLOYERS</Eyebrow>
              <h1 className="mt-3 max-w-[18ch] font-display text-display-xl md:text-display-xl-md">
                Hire faster. <span className="text-accent">India&apos;s premium recruitment partner.</span>
              </h1>
              <p className="mt-5 max-w-[56ch] text-body-lg text-text-muted">
                From a single senior hire to a whole team — we combine AI matching with expert
                consultants to deliver curated shortlists, fast.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/for-employers/submit-role" className={buttonClasses("primary", "lg")}>
                  <ArrowRight size={BUTTON_ICON_SIZE.lg} aria-hidden />
                  Submit a role
                </Link>
                <Link href="/contact" className={buttonClasses("secondary", "lg")}>
                  Talk to us
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* Value props */}
        <Section surface="subtle">
          <Container>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {VALUE_PROPS.map((v, i) => (
                <Reveal key={v.label} delay={(i % 4) * 0.06}>
                  <div className="flex h-full flex-col rounded-xl border border-border bg-surface p-6">
                    <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-surface-2">
                      <v.icon size={22} className="text-accent" aria-hidden />
                    </span>
                    <p className="font-display text-h2 font-bold text-accent">{v.stat}</p>
                    <p className="mt-1 text-body-sm font-semibold text-text">{v.label}</p>
                    <p className="mt-2 text-body-sm text-text-muted">{v.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>

        {/* How it works */}
        <Section>
          <Container>
            <Reveal className="mb-14 text-center md:mb-16">
              <Eyebrow className="justify-center">HOW IT WORKS</Eyebrow>
              <h2 className="mt-3 font-display text-display md:text-display-md">
                From JD to hire, <span className="text-accent">in three steps.</span>
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {STEPS.map((s, i) => (
                <Reveal key={s.step} delay={i * 0.1}>
                  <div className="flex h-full flex-col rounded-xl border border-border bg-surface p-8">
                    <div className="mb-5 flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-surface-2">
                        <s.icon size={22} className="text-accent" aria-hidden />
                      </span>
                      <span className="font-display text-display-xl font-bold leading-none text-accent/30">
                        {s.step}
                      </span>
                    </div>
                    <h3 className="mb-2 text-h3 md:text-h3-md">{s.title}</h3>
                    <p className="text-body text-text-muted">{s.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>

        {/* Trust — reuse the homepage client wall */}
        <LogoWall />

        {/* Closing CTA */}
        <Section>
          <Container>
            <Reveal>
              <div className="relative overflow-hidden rounded-2xl border border-border-strong bg-surface-2 px-6 py-14 text-center shadow-[var(--shadow-glow-accent)] md:px-16 md:py-20">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/[0.07] blur-[120px] dark:bg-accent/10"
                />
                <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6">
                  <h2 className="font-display text-display md:text-display-md">
                    Ready to <span className="text-accent">hire smarter?</span>
                  </h2>
                  <p className="max-w-[52ch] text-body-lg text-text-muted">
                    Submit your role and get a curated shortlist within days. 90-day free
                    replacement on every placement.
                  </p>
                  <Link href="/for-employers/submit-role" className={buttonClasses("primary", "lg")}>
                    <ArrowRight size={BUTTON_ICON_SIZE.lg} aria-hidden />
                    Submit a role
                  </Link>
                </div>
              </div>
            </Reveal>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
