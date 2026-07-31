// JobApplication — mirrors the future Postgres `job_applications` table. Several
// job fields are DENORMALIZED (jobSlug/jobTitle/jobCompany) so the admin list can
// render without a join and history survives if the job is later edited/deleted.

import type { City } from "./job";

export type ApplicationStatus =
  | "submitted"
  | "reviewing"
  | "shortlisted"
  | "rejected"
  | "hired";

export type JobApplication = {
  id: string; // UUID
  // Job fields are nullable: an "unmatched-general" submission (the /submit-cv
  // landing) has no specific job, so all four are null. The type system forces
  // every consumer to handle that case explicitly (no sentinel values).
  jobId: string | null; // FK to Job.id, null for general applications
  jobSlug: string | null; // Denormalized for admin display
  jobTitle: string | null; // Denormalized
  jobCompany: string | null; // Denormalized
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string; // E.164 format ideally
  candidateCity: City;
  currentCompany: string | null;
  currentRole: string | null;
  yearsOfExperience: number;
  currentSalaryLpa: number | null;
  expectedSalaryLpa: number | null;
  noticePeriodDays: number | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  cvFileUrl: string; // Cloudinary URL
  cvFileName: string; // Original filename for display
  coverMessage: string | null; // Free text from candidate
  status: ApplicationStatus;
  source: "direct" | "chatbot" | "unmatched-general";
  submittedAt: string;
  updatedAt: string;
};
