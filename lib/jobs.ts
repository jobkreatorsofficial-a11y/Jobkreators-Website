// Job data access + display formatting over the Phase 1 mock. Phase 2 swaps the
// MOCK_JOBS source for a DB read behind these same function signatures.

import { MOCK_JOBS } from "@/lib/mock";
import { CITY_LABELS, DEPARTMENT_LABELS, JOB_TYPE_LABELS } from "@/lib/constants";
import type { Job } from "@/lib/schema";

/** Jobs visible to the public seeker site — active only (closed/draft are admin-only). */
export function getPublicJobs(): Job[] {
  return MOCK_JOBS.filter((j) => j.status === "active");
}

export function getJobBySlug(slug: string): Job | undefined {
  return MOCK_JOBS.find((j) => j.slug === slug);
}

/** "Also open at <company>" (preferred) → else similar by department. */
export function getRelatedJobs(job: Job, limit = 3): { jobs: Job[]; sameCompany: boolean } {
  const pool = getPublicJobs().filter((j) => j.id !== job.id);
  const sameCompany = pool.filter((j) => j.company === job.company);
  if (sameCompany.length > 0) return { jobs: sameCompany.slice(0, limit), sameCompany: true };
  const sameDept = pool.filter((j) => j.department === job.department);
  return { jobs: (sameDept.length ? sameDept : pool).slice(0, limit), sameCompany: false };
}

// ---- Display formatting (deterministic — safe for SSR, no Date.now()) ----

export function formatSalary(min: number | null, max: number | null): string {
  if (min == null || max == null) return "Competitive";
  if (min === max) return `₹${min} LPA`;
  return `₹${min}–${max} LPA`;
}

export function formatExperience(min: number, max: number): string {
  if (max <= 1 && min === 0) return "0–1 yr";
  return `${min}–${max} yrs`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** ISO → "18 Jul 2026". Parsed from the date part so it's timezone-independent
 *  (no server/client hydration drift). */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  if (!y || !m || !d) return "";
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

export const cityLabel = (c: Job["city"]) => CITY_LABELS[c];
export const departmentLabel = (d: Job["department"]) => DEPARTMENT_LABELS[d];
export const jobTypeLabel = (t: Job["type"]) => JOB_TYPE_LABELS[t];
