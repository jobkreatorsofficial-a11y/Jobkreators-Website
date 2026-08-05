// Pure, client-safe display formatting for jobs. Data access moved to db/queries.ts
// (getActiveJobs / getJobBySlug / getRelatedJobs) in Phase 2C so public pages read
// Neon. This module stays free of any DB/server imports so client components (e.g.
// ChatWidget) can use the formatters.

import { CITY_LABELS, DEPARTMENT_LABELS, JOB_TYPE_LABELS } from "@/lib/constants";
import type { Job, City } from "@/lib/schema";

export function formatSalary(min: number | null, max: number | null): string {
  if (min == null || max == null) return "Competitive";
  if (min === max) return `₹${min} LPA`;
  return `₹${min}–${max} LPA`;
}

export function formatExperience(min: number, max: number): string {
  if (max <= 1 && min === 0) return "0–1 yr";
  return `${min}–${max} yrs`;
}

/** "25–35 yrs" when BOTH age bounds are set, else null (so callers can hide it). */
export function formatAgeRange(min: number | null, max: number | null): string | null {
  if (min == null || max == null) return null;
  return min === max ? `${min} yrs` : `${min}–${max} yrs`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** ISO → "18 Jul 2026". Parsed from the date part so it's timezone-independent
 *  (no server/client hydration drift). */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  if (!y || !m || !d) return "";
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/** Single-city label — for candidateCity / employer city, which stay singular. */
export const cityLabel = (c: City) => CITY_LABELS[c];

/** Compact multi-city label for a job's `cities` array:
 *  1 → "Bangalore" · 2 → "Bangalore, Mumbai" · 3+ → "Bangalore + 2 more". */
export function citiesLabel(cities: City[]): string {
  if (cities.length === 0) return "";
  if (cities.length === 1) return CITY_LABELS[cities[0]];
  if (cities.length === 2) return `${CITY_LABELS[cities[0]]}, ${CITY_LABELS[cities[1]]}`;
  return `${CITY_LABELS[cities[0]]} + ${cities.length - 1} more`;
}

export const departmentLabel = (d: Job["department"]) => DEPARTMENT_LABELS[d];
export const jobTypeLabel = (t: Job["type"]) => JOB_TYPE_LABELS[t];
