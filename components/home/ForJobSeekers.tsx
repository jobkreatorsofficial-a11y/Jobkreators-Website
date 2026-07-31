import Link from "next/link";
import { ArrowRight, Search, FileUp, BadgeCheck } from "lucide-react";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";
import { buttonClasses, BUTTON_ICON_SIZE } from "@/components/ui/buttonClasses";
import { getPublicJobs } from "@/lib/jobs";

const POINTS = [
  { icon: Search, text: "Browse live roles across India, filtered to what fits you." },
  { icon: FileUp, text: "Apply in minutes — or drop your CV for roles we haven't posted yet." },
  { icon: BadgeCheck, text: "Always 100% free for candidates. A real recruiter reviews every application." },
];

export default function ForJobSeekers() {
  const openCount = getPublicJobs().length;

  return (
    <Section surface="subtle">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <Eyebrow>FOR JOB SEEKERS</Eyebrow>
            <h2 className="mt-3 font-display text-display md:text-display-md">
              Your next role, <span className="text-accent">without the noise.</span>
            </h2>
            <p className="mt-4 max-w-[52ch] text-body-lg text-text-muted">
              {openCount}+ open roles from India&apos;s best companies, matched to your background by AI
              and curated by people.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/jobs" className={buttonClasses("primary", "lg")}>
                <ArrowRight size={BUTTON_ICON_SIZE.lg} aria-hidden />
                Browse open roles
              </Link>
              <Link href="/submit-cv" className={buttonClasses("secondary", "lg")}>
                Submit your CV
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="flex flex-col gap-4">
              {POINTS.map((p) => (
                <li
                  key={p.text}
                  className="flex items-start gap-4 rounded-xl border border-border bg-surface p-5"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-2">
                    <p.icon size={20} className="text-accent" aria-hidden />
                  </span>
                  <p className="text-body text-text-muted">{p.text}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
