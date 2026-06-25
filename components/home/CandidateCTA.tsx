import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";
import { buttonClasses, BUTTON_ICON_SIZE } from "@/components/ui/buttonClasses";

const TRUST = ["100% free for candidates", "Browse 500+ open roles", "Expert career guidance"];

export default function CandidateCTA() {
  return (
    <Section>
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-border-strong bg-surface-2 px-6 py-14 text-center shadow-[var(--shadow-glow-accent)] md:px-16 md:py-20">
            {/* Subtle accent glow. */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]"
            />

            <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6">
              <Eyebrow className="justify-center">FOR JOB SEEKERS</Eyebrow>
              <h2 className="font-display text-display md:text-display-md">
                Looking for your <span className="text-accent">dream job?</span>
              </h2>
              <p className="max-w-[52ch] text-body-lg text-text-muted">
                Tell us what you&apos;re looking for. Our team — and our AI — will match you with roles
                that actually fit, and guide you all the way to the offer.
              </p>

              <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-caption text-text-muted">
                {TRUST.map((item) => (
                  <li key={item} className="flex items-center gap-1.5">
                    <Check size={13} className="text-accent" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <Link href="/submit-cv" className={buttonClasses("primary", "lg")}>
                  <ArrowRight size={BUTTON_ICON_SIZE.lg} aria-hidden />
                  Submit Your CV
                </Link>
                <Link href="/jobs" className={buttonClasses("secondary", "lg")}>
                  Browse Jobs
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
