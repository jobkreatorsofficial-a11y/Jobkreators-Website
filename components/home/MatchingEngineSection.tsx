import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";
import MatchingEngine from "@/components/home/MatchingEngine";

/**
 * MatchingEngineSection — the standalone home for the AI Matching Engine visual,
 * relocated out of the hero (which now carries the 3D cube). The visualization
 * itself (`MatchingEngine`) is unchanged; this only gives it room to breathe and
 * an explicit frame — an eyebrow + heading + one supporting line — so it reads as
 * its own moment between the stats bar and the services grid.
 */
export default function MatchingEngineSection() {
  return (
    <Section>
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <Eyebrow>THE ENGINE</Eyebrow>
            <h2 className="mt-3 font-display text-display md:text-display-md">
              How we match <span className="text-accent">at scale.</span>
            </h2>
            <p className="mt-6 max-w-[52ch] text-body-lg text-text-muted">
              Every role runs through the same engine — half a million profiles scanned,
              ranked and shortlisted in hours, not weeks. The machine narrows the field;
              our people close the hire.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <MatchingEngine />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
