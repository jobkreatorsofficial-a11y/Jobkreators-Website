import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";
import { INDUSTRIES } from "@/lib/data";

/*
  TODO: replace placeholders with real client logo SVGs in /public/logos/.
  Drop these files in, then flip `file` references to <Image> in `Logo` below:
    scaler.svg · upgrad.svg · great-learning.svg · univo.svg ·
    interview-kickstart.svg · emeritus.svg
  Adding a client is just a new entry in CLIENTS_WALL — keep name + file together.
*/
const CLIENTS_WALL: { name: string; file: string }[] = [
  { name: "Scaler Academy", file: "scaler.svg" },
  { name: "upGrad", file: "upgrad.svg" },
  { name: "Great Learning", file: "great-learning.svg" },
  { name: "UNIVO Education", file: "univo.svg" },
  { name: "Interview Kickstart", file: "interview-kickstart.svg" },
  { name: "Emeritus", file: "emeritus.svg" },
];

// Deliberately-unfinished placeholder — a named card, not broken initials. Swap
// the inner span for `<Image src={`/logos/${file}`} ... />` once SVGs are supplied.
function ClientPlaceholder({ name }: { name: string }) {
  return (
    <div className="flex h-16 w-44 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-2 px-5">
      <span className="text-center text-caption font-medium text-text-muted">{name}</span>
    </div>
  );
}

export default function LogoWall() {
  return (
    <Section surface="subtle">
      <Container>
        <Reveal className="mb-10 text-center">
          <Eyebrow className="justify-center">TRUSTED BY</Eyebrow>
          <h2 className="mt-3 font-display text-h1 md:text-h1-md">
            242+ companies placed their trust in us
          </h2>
        </Reveal>
      </Container>

      {/* Desktop marquee — pauses on hover (and is stilled for reduced motion via
          the global media block in globals.css). */}
      <div className="relative hidden overflow-hidden md:block" aria-hidden>
        <div className="flex w-max gap-4 marquee-track">
          {[...CLIENTS_WALL, ...CLIENTS_WALL].map((c, i) => (
            <ClientPlaceholder key={`${c.name}-${i}`} name={c.name} />
          ))}
        </div>
      </div>

      {/* Mobile grid */}
      <Container className="md:hidden">
        <ul className="grid grid-cols-3 gap-3">
          {CLIENTS_WALL.map((c) => (
            <li key={c.name} className="flex h-16 items-center justify-center rounded-xl border border-border bg-surface-2 px-2">
              <span className="text-center text-caption font-medium text-text-muted">{c.name}</span>
            </li>
          ))}
        </ul>
      </Container>

      {/* Industries — a refined static tag cloud (not a second marquee). */}
      <Container>
        <Reveal className="mt-12 flex flex-wrap justify-center gap-2">
          {INDUSTRIES.map((industry) => (
            <span
              key={industry}
              className="rounded-full border border-border px-4 py-1.5 text-caption text-text-muted"
            >
              {industry}
            </span>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
