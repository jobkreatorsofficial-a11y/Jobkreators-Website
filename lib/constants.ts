// Value/label pairs for every enum in the schema — the single source for filter
// dropdowns, chips, form selects and admin badges. `satisfies` pins each `value`
// to its schema union at compile time, so a typo or a drifted enum fails the build.

import type {
  City,
  Department,
  JobType,
  ExperienceLevel,
  JobStatus,
  ApplicationStatus,
  EmployerInquiryStatus,
} from "@/lib/schema";

export const CITIES = [
  { value: "delhi-ncr", label: "Delhi NCR" },
  { value: "bangalore", label: "Bangalore" },
  { value: "mumbai", label: "Mumbai" },
  { value: "pune", label: "Pune" },
  { value: "hyderabad", label: "Hyderabad" },
  { value: "chennai", label: "Chennai" },
  { value: "kolkata", label: "Kolkata" },
  { value: "ahmedabad", label: "Ahmedabad" },
  { value: "remote", label: "Remote" },
  { value: "pan-india", label: "Pan-India" },
] as const satisfies readonly { value: City; label: string }[];

export const DEPARTMENTS = [
  { value: "engineering", label: "Engineering" },
  { value: "product", label: "Product" },
  { value: "design", label: "Design" },
  { value: "sales", label: "Sales" },
  { value: "marketing", label: "Marketing" },
  { value: "operations", label: "Operations" },
  { value: "finance", label: "Finance" },
  { value: "hr", label: "HR" },
  { value: "legal", label: "Legal" },
  { value: "data-analytics", label: "Data & Analytics" },
  { value: "customer-success", label: "Customer Success" },
  { value: "other", label: "Other" },
] as const satisfies readonly { value: Department; label: string }[];

export const JOB_TYPES = [
  { value: "full-time", label: "Full-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "part-time", label: "Part-time" },
] as const satisfies readonly { value: JobType; label: string }[];

export const EXPERIENCE_LEVELS = [
  { value: "entry", label: "Entry level" },
  { value: "mid", label: "Mid level" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead / Principal" },
] as const satisfies readonly { value: ExperienceLevel; label: string }[];

// Status enums — used for admin filters + colored badges.
export const JOB_STATUSES = [
  { value: "active", label: "Active" },
  { value: "closed", label: "Closed" },
  { value: "draft", label: "Draft" },
] as const satisfies readonly { value: JobStatus; label: string }[];

export const APPLICATION_STATUSES = [
  { value: "submitted", label: "Submitted" },
  { value: "reviewing", label: "Reviewing" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "rejected", label: "Rejected" },
  { value: "hired", label: "Hired" },
] as const satisfies readonly { value: ApplicationStatus; label: string }[];

export const EMPLOYER_INQUIRY_STATUSES = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "closed", label: "Closed" },
] as const satisfies readonly { value: EmployerInquiryStatus; label: string }[];

// Small label lookups for rendering a single stored value.
export const CITY_LABELS: Record<City, string> = Object.fromEntries(
  CITIES.map((c) => [c.value, c.label]),
) as Record<City, string>;

export const DEPARTMENT_LABELS: Record<Department, string> = Object.fromEntries(
  DEPARTMENTS.map((d) => [d.value, d.label]),
) as Record<Department, string>;

export const JOB_TYPE_LABELS: Record<JobType, string> = Object.fromEntries(
  JOB_TYPES.map((t) => [t.value, t.label]),
) as Record<JobType, string>;

export const EXPERIENCE_LEVEL_LABELS: Record<ExperienceLevel, string> = Object.fromEntries(
  EXPERIENCE_LEVELS.map((e) => [e.value, e.label]),
) as Record<ExperienceLevel, string>;
