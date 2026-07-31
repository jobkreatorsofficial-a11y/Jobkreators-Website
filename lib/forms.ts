// Client-side form validation schemas (Zod). These validate USER INPUT shapes,
// which differ from the DB schema (e.g. numbers arrive as strings, optionals are
// "" not null). The submit handlers map a validated form into the `@/lib/schema`
// DB shape.

import { z } from "zod";
import { CITIES, DEPARTMENTS, JOB_TYPES } from "@/lib/constants";
import type { City, Department, JobType } from "@/lib/schema";

const cityValues = CITIES.map((c) => c.value) as readonly string[];
const departmentValues = DEPARTMENTS.map((d) => d.value) as readonly Department[];
const cityValuesTyped = CITIES.map((c) => c.value) as readonly City[];
const jobTypeValues = JOB_TYPES.map((t) => t.value) as readonly JobType[];

// z.string() that must be one of `values`; the type-guard narrows the OUTPUT to
// the union (so submit handlers get `Department`/`City`/`JobType`, not string).
function enumField<T extends string>(values: readonly T[], message: string) {
  return z.string().refine((v): v is T => (values as readonly string[]).includes(v), { message });
}

// Required number from a text input ("" → fails with `message`).
const requiredNumber = (min: number, max: number, message: string) =>
  z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? NaN : Number(v)),
    z.number({ message }).min(min, `Must be at least ${min}`).max(max, "That value looks too high"),
  );

// Optional number from a text input: "" → undefined, else a bounded number.
const optionalNumber = (max: number) =>
  z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
    z.number().min(0, "Cannot be negative").max(max, "That value looks too high").optional(),
  );

// Optional URL that also accepts empty string.
const optionalUrl = z
  .union([z.literal(""), z.string().trim().url("Enter a valid URL (include https://)")])
  .optional();

export const applicationFormSchema = z.object({
  // Step 1 — personal
  candidateName: z.string().trim().min(2, "Please enter your full name"),
  candidateEmail: z.string().trim().email("Enter a valid email address"),
  candidatePhone: z
    .string()
    .trim()
    .regex(/^[+]?[\d][\d\s-]{7,14}$/, "Enter a valid phone number"),
  candidateCity: z
    .string()
    .refine((v): v is City => cityValues.includes(v), { message: "Select your city" }),

  // Step 2 — experience
  currentCompany: z.string().trim().optional(),
  currentRole: z.string().trim().optional(),
  yearsOfExperience: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? NaN : Number(v)),
    z
      .number({ message: "Enter your years of experience" })
      .min(0, "Cannot be negative")
      .max(50, "That value looks too high"),
  ),
  currentSalaryLpa: optionalNumber(1000),
  expectedSalaryLpa: optionalNumber(1000),
  noticePeriodDays: optionalNumber(365),
  linkedinUrl: optionalUrl,
  portfolioUrl: optionalUrl,

  // Step 3 — cover (CV file is validated separately, outside RHF)
  coverMessage: z.string().trim().max(1000, "Keep it under 1000 characters").optional(),
});

// The schema transforms (numbers coerced, city narrowed), so the form INPUT type
// (what the <input>s hold — strings) differs from the OUTPUT type (what the submit
// handler receives). react-hook-form takes both.
export type ApplicationFormInput = z.input<typeof applicationFormSchema>;
export type ApplicationFormValues = z.output<typeof applicationFormSchema>;

// CV upload constraints (validated imperatively since File isn't in the RHF form).
export const CV_MAX_BYTES = 5 * 1024 * 1024; // 5MB
export const CV_ACCEPT = ".pdf,.doc,.docx";
export const CV_MIME = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export function validateCv(file: File | null): string | null {
  if (!file) return "Please attach your CV";
  const okExt = /\.(pdf|docx?|DOC|DOCX|PDF)$/i.test(file.name);
  const okMime = CV_MIME.includes(file.type) || file.type === "";
  if (!okExt || !okMime) return "CV must be a PDF, DOC or DOCX";
  if (file.size > CV_MAX_BYTES) return "CV must be under 5MB";
  return null;
}

// ---- Employer intake (/for-employers/submit-role) ----

export const employerInquiryFormSchema = z
  .object({
    // Step 1 — company + contact
    companyName: z.string().trim().min(2, "Enter your company name"),
    companyWebsite: optionalUrl,
    contactPerson: z.string().trim().min(2, "Enter the contact name"),
    contactEmail: z.string().trim().email("Enter a valid email address"),
    contactPhone: z
      .string()
      .trim()
      .regex(/^[+]?[\d][\d\s-]{7,14}$/, "Enter a valid phone number"),
    designation: z.string().trim().min(2, "Enter your role, e.g. Head of Talent"),

    // Step 2 — role
    roleTitle: z.string().trim().min(2, "Enter the role title"),
    department: enumField(departmentValues, "Select a department"),
    city: enumField(cityValuesTyped, "Select a location"),
    type: enumField(jobTypeValues, "Select an employment type"),
    minYears: requiredNumber(0, 50, "Enter minimum years"),
    maxYears: requiredNumber(0, 50, "Enter maximum years"),
    minSalaryLpa: optionalNumber(1000),
    maxSalaryLpa: optionalNumber(1000),
    openings: requiredNumber(1, 1000, "Enter number of openings"),

    // Step 3 — JD text (the JD file is validated separately) + notes
    jdText: z.string().trim().max(5000, "Keep it under 5000 characters").optional(),
    additionalNotes: z.string().trim().max(2000, "Keep it under 2000 characters").optional(),
  })
  .refine((d) => d.maxYears >= d.minYears, {
    message: "Max years must be greater than or equal to min years",
    path: ["maxYears"],
  });

export type EmployerFormInput = z.input<typeof employerInquiryFormSchema>;
export type EmployerFormValues = z.output<typeof employerInquiryFormSchema>;

export type JdMode = "paste" | "upload";

/** JD must be provided either as pasted text (≥20 chars) or a PDF/DOC/DOCX ≤5MB. */
export function validateJd(mode: JdMode, jdText: string | undefined, jdFile: File | null): string | null {
  if (mode === "upload") {
    if (!jdFile) return "Attach a JD file, or switch to paste";
    const okExt = /\.(pdf|docx?|DOC|DOCX|PDF)$/i.test(jdFile.name);
    if (!okExt || !(CV_MIME.includes(jdFile.type) || jdFile.type === "")) {
      return "JD must be a PDF, DOC or DOCX";
    }
    if (jdFile.size > CV_MAX_BYTES) return "JD must be under 5MB";
    return null;
  }
  return jdText && jdText.trim().length >= 20 ? null : "Paste the job description (at least 20 characters)";
}
