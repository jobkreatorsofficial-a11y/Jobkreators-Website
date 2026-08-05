import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import ApplicationForm from "@/components/jobs/ApplicationForm";
import { citiesLabel, jobTypeLabel } from "@/lib/jobs";
import { getJobBySlug, getActiveJobs } from "@/db/queries";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const jobs = await getActiveJobs();
  return jobs.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  return {
    title: job ? `Apply — ${job.title} at ${job.company} — JOBKREATORS` : "Apply — JOBKREATORS",
    robots: { index: false }, // application pages aren't for indexing
  };
}

export default async function ApplyPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job || job.status !== "active") notFound();

  // Optional prefill from the chatbot (?city=&exp=&salary=).
  const sp = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const prefill = { city: one(sp.city), exp: one(sp.exp), salary: one(sp.salary) };

  return (
    <>
      <Navbar />
      <main id="main" className="min-h-screen pb-24 pt-28 md:pt-32">
        <Container size="narrow">
          <Link
            href={`/jobs/${job.slug}`}
            className="inline-flex items-center gap-1.5 text-body-sm font-medium text-text-muted transition-colors hover:text-accent"
          >
            <ArrowLeft size={16} aria-hidden /> Back to role
          </Link>

          <div className="mb-10 mt-6 text-center">
            <p className="text-body-sm font-medium text-accent">{job.company}</p>
            <h1 className="mt-1 font-display text-h1 md:text-h1-md">Apply for {job.title}</h1>
            <p className="mt-3 text-body-sm text-text-muted">
              {citiesLabel(job.cities)} · {jobTypeLabel(job.type)} · 100% free for candidates
            </p>
          </div>

          <ApplicationForm job={job} prefill={prefill} />
        </Container>
      </main>
      <Footer />
    </>
  );
}
