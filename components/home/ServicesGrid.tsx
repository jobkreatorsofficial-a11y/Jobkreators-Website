"use client";

import Link from "next/link";
import { Briefcase, Users, Cpu, TrendingUp, Compass, ArrowRight, type LucideIcon } from "lucide-react";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";
import { SERVICES } from "@/lib/data";
import { useMotionSafe } from "@/lib/hooks/useMotionSafe";

// Keyed on service.id (not the legacy data `icon` field) so the homepage controls
// its own iconography in the single brand accent.
const ICONS_BY_ID: Record<string, LucideIcon> = {
  permanent: Briefcase,
  bulk: Users,
  tech: Cpu,
  "non-tech": TrendingUp,
  career: Compass,
};

type Service = (typeof SERVICES)[number];

// The card design is unchanged from the grid version — only the container behaves
// differently (marquee vs grid). `decorative` marks the marquee's duplicated copy
// so screen readers + keyboard don't hit the same links twice.
function ServiceCard({ service, decorative = false }: { service: Service; decorative?: boolean }) {
  const Icon = ICONS_BY_ID[service.id] ?? Briefcase;
  return (
    <div
      {...(decorative ? { "aria-hidden": true } : {})}
      className="group/card flex h-full flex-col rounded-xl border border-border bg-surface p-8 transition-[border-color,box-shadow] duration-[var(--duration-base)] hover:border-accent hover:shadow-[var(--shadow-glow-accent)]"
    >
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-surface-2 transition-transform duration-[var(--duration-base)] group-hover/card:scale-105">
        <Icon size={22} className="text-accent" aria-hidden />
      </div>
      <h3 className="mb-3 text-h3 md:text-h3-md">{service.title}</h3>
      <p className="mb-6 flex-1 text-body text-text-muted">{service.description}</p>
      <Link
        href="/services"
        tabIndex={decorative ? -1 : undefined}
        className="group/link inline-flex items-center gap-1.5 text-body-sm font-medium text-accent transition-colors hover:text-accent-2"
        aria-label={`Learn more about ${service.title}`}
      >
        Learn more
        <ArrowRight size={14} className="transition-transform group-hover/link:translate-x-1" aria-hidden />
      </Link>
    </div>
  );
}

export default function ServicesGrid() {
  const motionSafe = useMotionSafe();

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
      </Container>

      {motionSafe ? (
        <>
          {/* Desktop: infinite marquee — two copies translate -50% for a seamless
              loop, paused on hover, with a fade-mask at both edges. */}
          <div className="relative hidden overflow-hidden md:block marquee-mask">
            <div className="flex w-max items-stretch gap-5 px-5 marquee-track-slow">
              {SERVICES.map((service) => (
                <div key={`a-${service.id}`} className="w-[320px] shrink-0">
                  <ServiceCard service={service} />
                </div>
              ))}
              {SERVICES.map((service) => (
                <div key={`b-${service.id}`} className="w-[320px] shrink-0">
                  <ServiceCard service={service} decorative />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: vertical stack (marquee on touch is jank). */}
          <Container className="md:hidden">
            <div className="grid grid-cols-1 gap-5">
              {SERVICES.map((service, i) => (
                <Reveal key={service.id} delay={(i % 3) * 0.08}>
                  <ServiceCard service={service} />
                </Reveal>
              ))}
            </div>
          </Container>
        </>
      ) : (
        // Reduced motion: the original static grid.
        <Container>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service, i) => (
              <Reveal key={service.id} delay={(i % 3) * 0.08}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
        </Container>
      )}
    </Section>
  );
}
