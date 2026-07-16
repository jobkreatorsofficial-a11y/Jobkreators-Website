// TODO: Client logos pending partnership team approval. See /public/logos/README.md
import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";
import { INDUSTRIES } from "@/lib/data";

/*
  Anchor clients. Drop an approved SVG at /public/logos/<file> and it renders
  automatically above the name; until then, a name-only placeholder card shows.
  See /public/logos/README.md for naming + usage rules.
*/
const CLIENTS_WALL: { name: string; file: string }[] = [
  { name: "Scaler", file: "scaler.svg" },
  { name: "upGrad", file: "upgrad.svg" },
  { name: "Great Learning", file: "great-learning.svg" },
  { name: "Emeritus", file: "emeritus.svg" },
  { name: "UNIVO Education", file: "univo.svg" },
  { name: "Interview Kickstart", file: "interview-kickstart.svg" },
];

// Resolved at build (Server Component): true once the SVG is supplied.
const CLIENTS = CLIENTS_WALL.map((c) => ({
  ...c,
  hasLogo: existsSync(join(process.cwd(), "public", "logos", c.file)),
}));

type Client = (typeof CLIENTS)[number];

// Card: logo (when supplied) on top, company name below in small caps.
function ClientCard({ client, decorative = false }: { client: Client; decorative?: boolean }) {
  return (
    <div
      {...(decorative ? { "aria-hidden": true } : {})}
      className="flex h-24 w-full flex-col items-center justify-center gap-2 rounded-xl border border-border bg-surface-2 px-5"
    >
      {client.hasLogo && (
        <div className="relative h-10 w-full">
          <Image src={`/logos/${client.file}`} alt={client.name} fill unoptimized className="object-contain" />
        </div>
      )}
      <span className="text-center text-caption font-medium uppercase tracking-wide text-text-muted">
        {client.name}
      </span>
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

      {/* Desktop marquee — pauses on hover, fades at both edges, and is stilled for
          reduced motion via the global media block in globals.css. */}
      <div className="relative hidden overflow-hidden md:block marquee-mask" aria-hidden>
        <div className="flex w-max gap-4 marquee-track">
          {CLIENTS.map((c) => (
            <div key={`a-${c.name}`} className="w-48 shrink-0">
              <ClientCard client={c} />
            </div>
          ))}
          {CLIENTS.map((c) => (
            <div key={`b-${c.name}`} className="w-48 shrink-0">
              <ClientCard client={c} decorative />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile grid */}
      <Container className="md:hidden">
        <ul className="grid grid-cols-2 gap-3">
          {CLIENTS.map((c) => (
            <li key={c.name}>
              <ClientCard client={c} />
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
