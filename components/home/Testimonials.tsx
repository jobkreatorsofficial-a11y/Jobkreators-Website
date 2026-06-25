import { Quote } from "lucide-react";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";
import { TESTIMONIALS } from "@/lib/data";

export default function Testimonials() {
  return (
    <Section>
      <Container>
        <Reveal className="mb-12 text-center md:mb-16">
          <Eyebrow className="justify-center">TESTIMONIALS</Eyebrow>
          <h2 className="mt-3 font-display text-display md:text-display-md">What our clients say</h2>
        </Reveal>

        {/* 3-card grid on desktop, single column on mobile. */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.company} delay={i * 0.1}>
              <figure className="relative h-full overflow-hidden rounded-2xl border border-border bg-surface p-8">
                {/* Decorative accent quote mark behind the card. */}
                <Quote
                  className="pointer-events-none absolute -right-2 -top-2 text-accent/10"
                  size={96}
                  strokeWidth={1}
                  aria-hidden
                />
                <blockquote className="relative text-h3 leading-snug text-text">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="relative mt-6 flex items-center gap-3 border-t border-border pt-6">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-3 text-caption font-semibold text-accent"
                    aria-hidden
                  >
                    {t.avatar}
                  </span>
                  <div>
                    {/* TODO(client): `name` is currently the job title — replace with a real person. */}
                    <div className="text-body font-medium text-text">{t.name}</div>
                    <div className="text-body-sm text-text-muted">
                      {t.role} · <span className="text-accent">{t.company}</span>
                    </div>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
