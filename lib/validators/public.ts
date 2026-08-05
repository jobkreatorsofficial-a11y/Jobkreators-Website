// Zod schemas for the PUBLIC submission endpoints. Values may arrive as strings
// (multipart form-data) or already-typed (JSON), so numbers are coerced and empty
// strings are normalised to null via z.preprocess — one schema handles both.

import { z } from "zod";
import { citySchema, departmentSchema, jobTypeSchema } from "./admin";

// "" / null → null ; else trimmed string (capped at max).
const optStr = (max: number) =>
  z.preprocess((v) => {
    const s = typeof v === "string" ? v.trim() : v == null ? "" : String(v);
    return s === "" ? null : s;
  }, z.string().max(max).nullable());

// Required trimmed string.
const reqStr = (max: number, msg = "Required") =>
  z.preprocess((v) => (typeof v === "string" ? v.trim() : v), z.string().min(1, msg).max(max));

// Whole-number fields. Coerce strings/JSON numbers and ROUND fractional input to
// the nearest integer (the DB columns are integer, and a strict integer check would
// reject a value like 2.5). "" / null → null. NaN passes through so zod rejects it.
const optNum = (min: number, max: number) =>
  z.preprocess((v) => {
    if (v === "" || v == null) return null;
    const n = Number(v);
    return Number.isNaN(n) ? v : Math.round(n);
  }, z.number().min(min).max(max).nullable());

const reqNum = (min: number, max: number) =>
  z.preprocess((v) => {
    if (v === "" || v == null) return v;
    const n = Number(v);
    return Number.isNaN(n) ? v : Math.round(n);
  }, z.number().min(min).max(max));

const optUrl = (max: number) =>
  z.preprocess((v) => {
    const s = typeof v === "string" ? v.trim() : "";
    return s === "" ? null : s;
  }, z.string().url("Enter a valid URL").max(max).nullable());

const optUuid = z.preprocess(
  (v) => (typeof v === "string" && v.trim() !== "" ? v.trim() : null),
  z.string().uuid().nullable(),
);

// --- Public application (candidate) ---
export const applicationSchema = z.object({
  jobId: optUuid,
  jobSlug: optStr(200),
  jobTitle: optStr(200),
  jobCompany: optStr(200),
  candidateName: reqStr(150, "Name is required"),
  candidateEmail: z.preprocess((v) => (typeof v === "string" ? v.trim() : v), z.string().email("Enter a valid email")),
  candidatePhone: reqStr(20, "Phone is required"),
  candidateCity: citySchema,
  currentCompany: optStr(150),
  currentRole: optStr(150),
  yearsOfExperience: reqNum(0, 60),
  currentSalaryLpa: optNum(0, 1000),
  expectedSalaryLpa: optNum(0, 1000),
  noticePeriodDays: optNum(0, 365),
  linkedinUrl: optUrl(300),
  portfolioUrl: optUrl(300),
  coverMessage: optStr(2000),
  source: z.enum(["direct", "chatbot", "unmatched-general"]),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

// --- Public employer inquiry ---
// jdFile (a File) is validated in the route; the "exactly one of jdText/jdFile"
// rule is also enforced there since zod can't see the File.
export const employerInquirySchema = z.object({
  companyName: reqStr(200, "Company name is required"),
  companyWebsite: optUrl(300),
  contactPerson: reqStr(150, "Contact name is required"),
  contactEmail: z.preprocess((v) => (typeof v === "string" ? v.trim() : v), z.string().email("Enter a valid email")),
  contactPhone: reqStr(20, "Phone is required"),
  designation: reqStr(150, "Designation is required"),
  roleTitle: reqStr(200, "Role title is required"),
  department: departmentSchema,
  city: citySchema,
  type: jobTypeSchema,
  minYears: reqNum(0, 50),
  maxYears: reqNum(0, 50),
  minSalaryLpa: optNum(0, 1000),
  maxSalaryLpa: optNum(0, 1000),
  openings: reqNum(1, 1000),
  jdText: optStr(10000),
  additionalNotes: optStr(2000),
});

export type EmployerInquiryInput = z.infer<typeof employerInquirySchema>;
