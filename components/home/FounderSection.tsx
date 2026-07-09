import Image from "next/image";
import { Quote } from "lucide-react";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";
import { FOUNDER } from "@/lib/data";

export default function FounderSection() {
  const credentials = FOUNDER.background.split(" · ");

  return (
    <Section surface="subtle">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Photo */}
          <Reveal className="relative mx-auto w-full max-w-sm lg:max-w-md">
            {/* Accent glow halo behind the frame — softer on light. */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-accent/10 blur-3xl dark:bg-accent/15"
            />
            <div
              className="relative overflow-hidden rounded-2xl border border-border-strong bg-surface-2"
              style={{ height: "clamp(380px, 55vw, 560px)" }}
            >
              <Image
                src={FOUNDER.photo}
                alt={`${FOUNDER.name}, ${FOUNDER.title} of JOBKREATORS`}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 90vw, 45vw"
              />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg/80 to-transparent" />
              <div className="absolute inset-x-5 bottom-5">
                <div className="glass rounded-xl p-4">
                  <p className="text-body-lg font-bold text-text">{FOUNDER.name}</p>
                  <p className="text-body-sm text-text-muted">{FOUNDER.title}</p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Content */}
          <Reveal delay={0.1}>
            <Eyebrow>THE FOUNDER</Eyebrow>
            <h2 className="mt-3 mb-6 font-display text-display md:text-display-md">
              Built from a belief that <span className="text-accent">every job seeker</span> deserves their dream role.
            </h2>

            <div className="relative mb-8 border-l-2 border-accent pl-6">
              <Quote size={20} className="mb-3 text-accent" aria-hidden />
              <p className="text-body-lg italic leading-relaxed text-text-muted">{FOUNDER.story}</p>
            </div>

            <ul className="mb-8 flex flex-wrap gap-3">
              {credentials.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 rounded-full border border-border bg-surface-2 px-4 py-2 text-caption text-text-muted"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>

            <p className="text-h4 font-bold text-text">{FOUNDER.name}</p>
            <p className="text-body-sm font-medium text-accent">{FOUNDER.title}, JOBKREATORS</p>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
