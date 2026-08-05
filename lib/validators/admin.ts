// Zod schemas for every admin POST/PATCH body. Enum values are derived from
// lib/constants (single source of truth) so they can't drift from the DB enums.

import { z } from "zod";
import {
  JOB_STATUSES,
  DEPARTMENTS,
  CITIES,
  JOB_TYPES,
  EXPERIENCE_LEVELS,
  APPLICATION_STATUSES,
  EMPLOYER_INQUIRY_STATUSES,
} from "@/lib/constants";

// Build a z.enum from a constants array without re-typing the values.
function enumOf<T extends string>(items: readonly { value: T }[]) {
  return z.enum(items.map((i) => i.value) as [T, ...T[]]);
}

// Whole-number field: coerces strings / JSON numbers and ROUNDS fractional input to
// the nearest integer. A strict integer check rejects a value like 2.5 with
// "expected int, received number" (this bit prod), and the number inputs accept
// decimals — so we normalise to an integer instead of rejecting.
const wholeNumber = (min: number, max: number) =>
  z.coerce.number().min(min).max(max).transform((n) => Math.round(n));

export const jobStatusSchema = enumOf(JOB_STATUSES);
export const departmentSchema = enumOf(DEPARTMENTS);
export const citySchema = enumOf(CITIES);
// A job has one OR MORE cities (min 1). Candidate/inquiry cities stay single.
export const citiesSchema = z.array(citySchema).min(1, "At least one city is required");
export const jobTypeSchema = enumOf(JOB_TYPES);
export const experienceLevelSchema = enumOf(EXPERIENCE_LEVELS);
export const applicationStatusSchema = enumOf(APPLICATION_STATUSES);
export const inquiryStatusSchema = enumOf(EMPLOYER_INQUIRY_STATUSES);

// --- Jobs ---
// Mirrors the Job shape. Server-managed fields (id / postedAt / createdAt /
// updatedAt) are accepted-but-optional: the admin JobForm sends them, but the DB
// fills sensible defaults if absent.
const jobObjectSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, digits and hyphens"),
  title: z.string().min(1).max(200),
  company: z.string().min(1).max(200),
  companyLogoUrl: z.string().url().nullable().optional(),
  department: departmentSchema,
  cities: citiesSchema,
  type: jobTypeSchema,
  experienceLevel: experienceLevelSchema,
  minYears: wholeNumber(0, 50),
  maxYears: wholeNumber(0, 50),
  minAge: wholeNumber(18, 70).nullable().optional(),
  maxAge: wholeNumber(18, 70).nullable().optional(),
  minSalaryLpa: wholeNumber(0, 1000).nullable(),
  maxSalaryLpa: wholeNumber(0, 1000).nullable(),
  description: z.string().min(1),
  responsibilities: z.array(z.string()),
  requirements: z.array(z.string()),
  niceToHave: z.array(z.string()),
  benefits: z.array(z.string()),
  status: jobStatusSchema,
  postedAt: z.string().optional(),
  closesAt: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// If both age bounds are provided, maxAge must be >= minAge (hard block).
// The "unusual range" hint (minAge < 21 or maxAge > 65) is intentionally NOT a
// zod refine — it's a soft, non-blocking warning surfaced in the JobForm UI (2C.1),
// since a refine failure would block the submit.
function ageBoundsValid(d: { minAge?: number | null; maxAge?: number | null }): boolean {
  return d.minAge == null || d.maxAge == null || d.maxAge >= d.minAge;
}
const ageError = { message: "Maximum age must be greater than or equal to minimum age", path: ["maxAge"] };

export const createJobSchema = jobObjectSchema.refine(ageBoundsValid, ageError);
export const updateJobSchema = jobObjectSchema.partial().refine(ageBoundsValid, ageError);

export const deleteJobsSchema = z.object({
  ids: z.array(z.string().uuid()),
});

// --- Applications ---
// A PATCH may change status, save an internal note, or both.
export const updateApplicationSchema = z
  .object({
    status: applicationStatusSchema.optional(),
    internalNote: z.string().max(5000).optional(),
  })
  .refine((d) => d.status !== undefined || d.internalNote !== undefined, {
    message: "Provide a status and/or an internalNote",
  });

// --- Employer inquiries ---
export const updateInquiryStatusSchema = z.object({
  status: inquiryStatusSchema,
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
