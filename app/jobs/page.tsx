import { Suspense } from "react";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import JobsBrowser from "@/components/jobs/JobsBrowser";
import JobsGridSkeleton from "@/components/jobs/JobsGridSkeleton";
import { getActiveJobs } from "@/db/queries";

export const metadata: Metadata = {
  title: "Open Roles — JOBKREATORS",
  description:
    "Browse open roles across India — engineering, product, design, sales and more. 100% free for candidates. Apply in minutes.",
  alternates: { canonical: "/jobs" },
};

// ISR: rebuild at most once a minute; admin mutations also revalidate on demand.
export const revalidate = 60;

export default async function JobsPage() {
  const jobs = await getActiveJobs();

  return (
    <>
      <Navbar />
      <main id="main" className="min-h-screen pb-24 pt-28 md:pt-32">
        <Container>
          {/* Hero header */}
          <div className="mb-10 max-w-2xl">
            <Eyebrow dot>NOW HIRING · PAN-INDIA</Eyebrow>
            <h1 className="mt-3 font-display text-display md:text-display-md">
              Find your <span className="text-accent">next role.</span>
            </h1>
            <p className="mt-4 text-body-lg text-text-muted">
              {jobs.length} open {jobs.length === 1 ? "role" : "roles"}
              {" across India's best companies. Free for candidates, always."}
            </p>
          </div>

          {/* useSearchParams requires a Suspense boundary; its fallback IS the
              skeleton loading state. */}
          <Suspense fallback={<JobsGridSkeleton />}>
            <JobsBrowser jobs={jobs} />
          </Suspense>
        </Container>
      </main>
      <Footer />
    </>
  );
}
