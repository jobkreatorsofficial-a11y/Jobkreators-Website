import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";
import DifferentiatorBlob from "@/components/home/DifferentiatorBlob";
import { AI_CLAIMS } from "@/lib/data";

export default function AIDashboard() {
  return (
    <Section surface="subtle">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Copy — unchanged. */}
          <Reveal>
            <Eyebrow>OUR DIFFERENTIATOR</Eyebrow>
            <h2 className="mt-3 mb-6 font-display text-display md:text-display-md">
              Powered by <span className="text-accent">AI intelligence,</span> driven by human expertise.
            </h2>
            <p className="mb-10 max-w-[56ch] text-body-lg text-text-muted">
              Our proprietary engine evaluates thousands of profiles per role — then our expert
              consultants curate the final shortlist. You get speed without sacrificing quality.
            </p>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {AI_CLAIMS.map((claim) => (
                <li
                  key={claim}
                  className="flex items-center gap-3 rounded-xl border border-border bg-surface-2 p-4"
                >
                  <span className="h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden />
                  <span className="text-body-sm font-medium text-text">{claim}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Morphing blob with rotating "we handle …" headline. */}
          <Reveal delay={0.1}>
            <DifferentiatorBlob />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
