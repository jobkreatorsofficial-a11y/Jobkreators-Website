import Link from "next/link";
import { Briefcase, Users, Cpu, TrendingUp, Compass, ArrowRight, type LucideIcon } from "lucide-react";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";
import { SERVICES } from "@/lib/data";

// Keyed on service.id (not the legacy data `icon` field) so the homepage controls
// its own iconography in the single brand accent.
const ICONS_BY_ID: Record<string, LucideIcon> = {
  permanent: Briefcase,
  bulk: Users,
  tech: Cpu,
  "non-tech": TrendingUp,
  career: Compass,
};

export default function ServicesGrid() {
  return (
    <Section>
      <Container>
        <Reveal className="mb-12 md:mb-16">
          <Eyebrow>WHAT WE DO</Eyebrow>
          <div className="mt-3 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-xl font-display text-display md:text-display-md">
              Every hire you need, <span className="text-accent">one firm to trust.</span>
            </h2>
            <Link
              href="/services"
              className="group/all inline-flex items-center gap-1.5 text-body-sm font-medium text-accent transition-colors hover:text-accent-2"
            >
              View all services
              <ArrowRight size={16} className="transition-transform group-hover/all:translate-x-1" aria-hidden />
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => {
            const Icon = ICONS_BY_ID[service.id] ?? Briefcase;
            return (
              <Reveal key={service.id} delay={(i % 3) * 0.08}>
                <div className="group/card flex h-full flex-col rounded-xl border border-border bg-surface p-8 transition-[border-color,box-shadow] duration-[var(--duration-base)] hover:border-accent hover:shadow-[var(--shadow-glow-accent)]">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-surface-2 transition-transform duration-[var(--duration-base)] group-hover/card:scale-105">
                    <Icon size={22} className="text-accent" aria-hidden />
                  </div>
                  <h3 className="mb-3 text-h3 md:text-h3-md">{service.title}</h3>
                  <p className="mb-6 flex-1 text-body text-text-muted">{service.description}</p>
                  <Link
                    href="/services"
                    className="group/link inline-flex items-center gap-1.5 text-body-sm font-medium text-accent transition-colors hover:text-accent-2"
                    aria-label={`Learn more about ${service.title}`}
                  >
                    Learn more
                    <ArrowRight size={14} className="transition-transform group-hover/link:translate-x-1" aria-hidden />
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
