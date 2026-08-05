import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Briefcase, Clock, Building2, IndianRupee, CalendarRange, Check } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import JobCard from "@/components/jobs/JobCard";
import ShareButtons from "@/components/jobs/ShareButtons";
import {
  getJobBySlug,
  getPublicJobs,
  getRelatedJobs,
  formatSalary,
  formatExperience,
  formatAgeRange,
  formatDate,
  cityLabel,
  citiesLabel,
  departmentLabel,
  jobTypeLabel,
} from "@/lib/jobs";
import type { Job, JobType } from "@/lib/schema";

export function generateStaticParams() {
  return getPublicJobs().map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = getJobBySlug(slug);
  if (!job) return { title: "Role not found — JOBKREATORS" };
  return {
    title: `${job.title} at ${job.company} — JOBKREATORS`,
    description: job.description.slice(0, 155),
    alternates: { canonical: `/jobs/${job.slug}` },
  };
}

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = getJobBySlug(slug);
  if (!job || job.status !== "active") notFound();

  const { jobs: related, sameCompany } = getRelatedJobs(job);
  const applyHref = `/jobs/${job.slug}/apply`;

  const ageRange = formatAgeRange(job.minAge, job.maxAge);
  const allCities = job.cities.map(cityLabel).join(", ");
  const meta = [
    // Full city list on hover when it's collapsed to "+ N more".
    { icon: MapPin, label: citiesLabel(job.cities), title: job.cities.length > 2 ? allCities : undefined },
    { icon: Building2, label: departmentLabel(job.department), title: undefined },
    { icon: Briefcase, label: jobTypeLabel(job.type), title: undefined },
    { icon: Clock, label: formatExperience(job.minYears, job.maxYears), title: undefined },
    { icon: IndianRupee, label: formatSalary(job.minSalaryLpa, job.maxSalaryLpa), title: undefined },
    // Age requirement — only shown when both bounds are set.
    ...(ageRange ? [{ icon: CalendarRange, label: `Age: ${ageRange}`, title: undefined }] : []),
  ];

  // Google Jobs structured data — one jobLocation per physical city (+ TELECOMMUTE
  // for remote). "pan-india" / "multiple-locations" fall back to a country-level Place.
  const physicalCities = job.cities.filter((c) => c !== "remote" && c !== "pan-india" && c !== "multiple-locations");
  const isRemote = job.cities.includes("remote");
  const employmentType: Record<JobType, string> = {
    "full-time": "FULL_TIME",
    "part-time": "PART_TIME",
    contract: "CONTRACTOR",
    internship: "INTERN",
  };
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.postedAt,
    ...(job.closesAt ? { validThrough: job.closesAt } : {}),
    employmentType: employmentType[job.type],
    hiringOrganization: { "@type": "Organization", name: job.company },
    jobLocation: (physicalCities.length ? physicalCities.map(cityLabel) : [null]).map((locality) => ({
      "@type": "Place",
      address: { "@type": "PostalAddress", ...(locality ? { addressLocality: locality } : {}), addressCountry: "IN" },
    })),
    ...(isRemote
      ? { jobLocationType: "TELECOMMUTE", applicantLocationRequirements: { "@type": "Country", name: "India" } }
      : {}),
    ...(job.minSalaryLpa != null && job.maxSalaryLpa != null
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: "INR",
            value: {
              "@type": "QuantitativeValue",
              minValue: job.minSalaryLpa * 100000,
              maxValue: job.maxSalaryLpa * 100000,
              unitText: "YEAR",
            },
          },
        }
      : {}),
  };

  return (
    <>
      {/* Google Jobs structured data (escaped to avoid </script> breakout). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Navbar />
      {/* pb allows room for the fixed mobile apply bar */}
      <main id="main" className="min-h-screen pb-28 pt-28 md:pb-24 md:pt-32">
        <Container>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 text-body-sm font-medium text-text-muted transition-colors hover:text-accent"
          >
            <ArrowLeft size={16} aria-hidden /> Back to all roles
          </Link>

          <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px] lg:gap-14">
            {/* Main */}
            <div>
              <div className="border-b border-border pb-8">
                <p className="text-body-sm font-medium text-accent">{job.company}</p>
                <h1 className="mt-1 font-display text-h1 md:text-h1-md">{job.title}</h1>
                <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-body-sm text-text-muted">
                  {meta.map((m) => (
                    <li key={m.label} title={m.title} className="inline-flex items-center gap-1.5">
                      <m.icon size={15} className="text-text-subtle" aria-hidden />
                      {m.label}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <Link
                    href={applyHref}
                    className="inline-flex h-12 items-center rounded-full bg-accent px-7 text-body-lg font-semibold text-accent-fg shadow-[var(--shadow-glow-accent)] transition-colors hover:bg-accent-2"
                  >
                    Apply Now
                  </Link>
                  <ShareButtons title={`${job.title} at ${job.company}`} />
                </div>
                <p className="mt-4 text-caption text-text-subtle">
                  Posted {formatDate(job.postedAt)}
                  {job.closesAt ? ` · Applications close ${formatDate(job.closesAt)}` : ""}
                </p>
              </div>

              <Prose title="About the role">
                <p className="whitespace-pre-line text-body-lg leading-relaxed text-text-muted">
                  {job.description}
                </p>
              </Prose>
              <BulletSection title="Responsibilities" items={job.responsibilities} />
              <BulletSection title="Requirements" items={job.requirements} />
              <BulletSection title="Nice to have" items={job.niceToHave} />
              <BulletSection title="Benefits" items={job.benefits} />

              {/* Bottom apply CTA */}
              <div className="mt-12 rounded-2xl border border-border-strong bg-surface-2 px-6 py-8 text-center">
                <p className="font-display text-h3 md:text-h3-md">Ready to apply?</p>
                <p className="mx-auto mt-2 max-w-md text-body-sm text-text-muted">
                  It takes a few minutes. Our team reviews every application and responds within 48 hours.
                </p>
                <Link
                  href={applyHref}
                  className="mt-6 inline-flex h-12 items-center rounded-full bg-accent px-7 text-body-lg font-semibold text-accent-fg transition-colors hover:bg-accent-2"
                >
                  Apply for this role
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-border bg-surface p-6">
                <p className="text-h4 font-bold text-accent">
                  {formatSalary(job.minSalaryLpa, job.maxSalaryLpa)}
                </p>
                <p className="mt-1 text-body-sm text-text-muted">
                  {formatExperience(job.minYears, job.maxYears)} · {jobTypeLabel(job.type)}
                </p>
                <Link
                  href={applyHref}
                  className="mt-5 flex h-11 items-center justify-center rounded-full bg-accent text-body-sm font-semibold text-accent-fg transition-colors hover:bg-accent-2"
                >
                  Apply Now
                </Link>
                <ul className="mt-5 space-y-2 border-t border-border pt-5 text-body-sm text-text-muted">
                  <li className="flex items-center gap-2">
                    <Check size={15} className="text-accent" aria-hidden /> 100% free for candidates
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={15} className="text-accent" aria-hidden /> Reviewed by a real recruiter
                  </li>
                </ul>
              </div>

              {related.length > 0 && (
                <div className="mt-8">
                  <h2 className="mb-4 text-h4 font-semibold text-text">
                    {sameCompany ? `Also open at ${job.company}` : "Similar roles"}
                  </h2>
                  <div className="flex flex-col gap-4">
                    {related.map((r: Job) => (
                      <JobCard key={r.id} job={r} />
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </Container>
      </main>

      {/* Sticky apply bar — mobile only. */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/95 px-4 py-3 backdrop-blur-md md:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-body-sm font-semibold text-text">
              {formatSalary(job.minSalaryLpa, job.maxSalaryLpa)}
            </p>
            <p className="truncate text-caption text-text-subtle">{job.title}</p>
          </div>
          <Link
            href={applyHref}
            className="inline-flex h-11 shrink-0 items-center rounded-full bg-accent px-6 text-body-sm font-semibold text-accent-fg"
          >
            Apply Now
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}

function Prose({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="mb-4 text-h3 md:text-h3-md">{title}</h2>
      {children}
    </section>
  );
}

function BulletSection({ title, items }: { title: string; items: string[] }) {
  if (!items || items.length === 0) return null; // hide empty sections
  return (
    <section className="mt-10">
      <h2 className="mb-4 text-h3 md:text-h3-md">{title}</h2>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-body-lg text-text-muted">
            <Check size={18} className="mt-1 shrink-0 text-accent" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
