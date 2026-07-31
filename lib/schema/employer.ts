// EmployerInquiry — mirrors the future Postgres `employer_inquiries` table. The
// intake form on /for-employers/submit-role produces exactly this shape.

import type { City, Department, JobType } from "./job";

export type EmployerInquiryStatus = "new" | "contacted" | "qualified" | "closed";

export type EmployerInquiry = {
  id: string;
  companyName: string;
  companyWebsite: string | null;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  designation: string; // Contact's role, e.g. "Head of Talent"
  roleTitle: string; // The role they're hiring for
  department: Department;
  city: City;
  type: JobType;
  minYears: number;
  maxYears: number;
  minSalaryLpa: number | null;
  maxSalaryLpa: number | null;
  openings: number; // How many positions
  jdText: string | null; // Pasted JD text
  jdFileUrl: string | null; // If they upload a JD file
  additionalNotes: string | null;
  status: EmployerInquiryStatus;
  submittedAt: string;
  updatedAt: string;
};
