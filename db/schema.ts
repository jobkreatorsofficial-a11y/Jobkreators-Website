// Drizzle schema — the real Postgres tables for the JOBKREATORS jobs portal.
// Columns are snake_case in the DB (Postgres convention) and map back to the
// camelCase TypeScript field names from lib/schema/*.ts. Enum values, nullability
// and shapes are copied verbatim from those contracts so data round-trips cleanly.
//
// Timestamps use { mode: "string" } so the inferred TS type is `string` (ISO),
// matching the lib/schema contracts (which type dates as ISO strings).

import { pgTable, pgEnum, uuid, text, integer, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import type { ChatMessage, ChatSession } from "@/lib/schema";

// --- Enums (values copied from lib/schema + lib/constants) ---
export const jobTypeEnum = pgEnum("job_type", ["full-time", "contract", "internship", "part-time"]);
export const experienceLevelEnum = pgEnum("experience_level", ["entry", "mid", "senior", "lead"]);
export const jobStatusEnum = pgEnum("job_status", ["active", "closed", "draft"]);
export const departmentEnum = pgEnum("department", [
  "engineering",
  "product",
  "design",
  "sales",
  "marketing",
  "operations",
  "finance",
  "hr",
  "legal",
  "data-analytics",
  "customer-success",
  "other",
]);
export const cityEnum = pgEnum("city", [
  "agra",
  "ahmedabad",
  "amritsar",
  "bangalore",
  "bhopal",
  "bhubaneswar",
  "chandigarh",
  "chennai",
  "coimbatore",
  "dehradun",
  "delhi-ncr",
  "faridabad",
  "ghaziabad",
  "gurgaon",
  "guwahati",
  "hyderabad",
  "indore",
  "jaipur",
  "jodhpur",
  "kanpur",
  "kochi",
  "kolkata",
  "lucknow",
  "ludhiana",
  "madurai",
  "mangalore",
  "mumbai",
  "multiple-locations",
  "mysuru",
  "nagpur",
  "nashik",
  "noida",
  "pan-india",
  "patna",
  "pune",
  "raipur",
  "ranchi",
  "remote",
  "surat",
  "thiruvananthapuram",
  "tiruchirappalli",
  "vadodara",
  "varanasi",
  "vijayawada",
  "visakhapatnam",
]);
export const applicationStatusEnum = pgEnum("application_status", [
  "submitted",
  "reviewing",
  "shortlisted",
  "rejected",
  "hired",
]);
export const applicationSourceEnum = pgEnum("application_source", ["direct", "chatbot", "unmatched-general"]);
export const employerInquiryStatusEnum = pgEnum("employer_inquiry_status", ["new", "contacted", "qualified", "closed"]);
export const chatSessionStatusEnum = pgEnum("chat_session_status", ["active", "cv-submitted", "closed"]);

// Shared timestamp column config — timestamptz, ISO-string mode.
const ts = { withTimezone: true, mode: "string" as const };

// --- jobs ---
export const jobs = pgTable(
  "jobs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    company: text("company").notNull(),
    companyLogoUrl: text("company_logo_url"),
    department: departmentEnum("department").notNull(),
    cities: cityEnum("cities").array().notNull(), // one or more locations (min 1)
    type: jobTypeEnum("type").notNull(),
    experienceLevel: experienceLevelEnum("experience_level").notNull(),
    minYears: integer("min_years").notNull(),
    maxYears: integer("max_years").notNull(),
    minAge: integer("min_age"), // nullable — no age preference when null
    maxAge: integer("max_age"),
    minSalaryLpa: integer("min_salary_lpa"),
    maxSalaryLpa: integer("max_salary_lpa"),
    description: text("description").notNull(),
    responsibilities: text("responsibilities").array().notNull(),
    requirements: text("requirements").array().notNull(),
    niceToHave: text("nice_to_have").array().notNull(),
    benefits: text("benefits").array().notNull(),
    status: jobStatusEnum("status").notNull().default("draft"),
    postedAt: timestamp("posted_at", ts).notNull(),
    closesAt: timestamp("closes_at", ts),
    createdAt: timestamp("created_at", ts).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", ts)
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date().toISOString()),
  },
  (t) => [
    index("jobs_status_idx").on(t.status),
    index("jobs_department_idx").on(t.department),
    // GIN index so "cities @> ARRAY[...]" / overlap filters stay fast on the array.
    index("jobs_cities_idx").using("gin", t.cities),
    index("jobs_posted_at_idx").on(t.postedAt),
  ],
);

// --- job_applications ---
export const jobApplications = pgTable(
  "job_applications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // Nullable + ON DELETE SET NULL: an unmatched-general submission has no job,
    // and if a job is later deleted we keep the application (denormalized fields
    // below preserve which role it was for).
    jobId: uuid("job_id").references(() => jobs.id, { onDelete: "set null" }),
    jobSlug: text("job_slug"),
    jobTitle: text("job_title"),
    jobCompany: text("job_company"),
    candidateName: text("candidate_name").notNull(),
    candidateEmail: text("candidate_email").notNull(),
    candidatePhone: text("candidate_phone").notNull(),
    candidateCity: cityEnum("candidate_city").notNull(),
    currentCompany: text("current_company"),
    currentRole: text("current_role"),
    yearsOfExperience: integer("years_of_experience").notNull(),
    currentSalaryLpa: integer("current_salary_lpa"),
    expectedSalaryLpa: integer("expected_salary_lpa"),
    noticePeriodDays: integer("notice_period_days"),
    linkedinUrl: text("linkedin_url"),
    portfolioUrl: text("portfolio_url"),
    cvFileUrl: text("cv_file_url").notNull(),
    cvFileName: text("cv_file_name").notNull(),
    coverMessage: text("cover_message"),
    internalNotes: text("internal_notes"), // private recruiter note (not shown to candidate)
    status: applicationStatusEnum("status").notNull().default("submitted"),
    source: applicationSourceEnum("source").notNull(),
    submittedAt: timestamp("submitted_at", ts).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", ts)
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date().toISOString()),
  },
  (t) => [
    index("job_applications_job_id_idx").on(t.jobId),
    index("job_applications_status_idx").on(t.status),
    index("job_applications_submitted_at_idx").on(t.submittedAt),
    index("job_applications_candidate_email_idx").on(t.candidateEmail),
  ],
);

// --- employer_inquiries ---
export const employerInquiries = pgTable(
  "employer_inquiries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyName: text("company_name").notNull(),
    companyWebsite: text("company_website"),
    contactPerson: text("contact_person").notNull(),
    contactEmail: text("contact_email").notNull(),
    contactPhone: text("contact_phone").notNull(),
    designation: text("designation").notNull(),
    roleTitle: text("role_title").notNull(),
    department: departmentEnum("department").notNull(),
    city: cityEnum("city").notNull(),
    type: jobTypeEnum("type").notNull(),
    minYears: integer("min_years").notNull(),
    maxYears: integer("max_years").notNull(),
    minSalaryLpa: integer("min_salary_lpa"),
    maxSalaryLpa: integer("max_salary_lpa"),
    openings: integer("openings").notNull(),
    jdText: text("jd_text"),
    jdFileUrl: text("jd_file_url"),
    additionalNotes: text("additional_notes"),
    status: employerInquiryStatusEnum("status").notNull().default("new"),
    submittedAt: timestamp("submitted_at", ts).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", ts)
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date().toISOString()),
  },
  (t) => [
    index("employer_inquiries_status_idx").on(t.status),
    index("employer_inquiries_submitted_at_idx").on(t.submittedAt),
  ],
);

// --- chat_sessions ---
// messages + candidate_context are jsonb: they're read/written as whole blobs,
// never queried relationally, so jsonb is the right fit. $type pins the shape to
// the lib/schema contracts.
export const chatSessions = pgTable(
  "chat_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    messages: jsonb("messages").$type<ChatMessage[]>().notNull(),
    candidateContext: jsonb("candidate_context").$type<ChatSession["candidateContext"]>().notNull(),
    status: chatSessionStatusEnum("status").notNull().default("active"),
    startedAt: timestamp("started_at", ts).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", ts)
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date().toISOString()),
  },
  (t) => [
    index("chat_sessions_status_idx").on(t.status),
    index("chat_sessions_updated_at_idx").on(t.updatedAt),
  ],
);
