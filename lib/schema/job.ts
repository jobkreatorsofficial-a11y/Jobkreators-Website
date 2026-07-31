// Job — mirrors the future Postgres `jobs` table exactly (field names, types,
// nullability). This is the contract the Phase 2 backend implements. Phase 1
// ships mock data shaped to this type; no field may be added/renamed/loosened
// without updating the backend contract.

export type JobType = "full-time" | "contract" | "internship" | "part-time";
export type ExperienceLevel = "entry" | "mid" | "senior" | "lead";
export type JobStatus = "active" | "closed" | "draft";

export type Department =
  | "engineering"
  | "product"
  | "design"
  | "sales"
  | "marketing"
  | "operations"
  | "finance"
  | "hr"
  | "legal"
  | "data-analytics"
  | "customer-success"
  | "other";

export type City =
  | "delhi-ncr"
  | "bangalore"
  | "mumbai"
  | "pune"
  | "hyderabad"
  | "chennai"
  | "kolkata"
  | "ahmedabad"
  | "remote"
  | "pan-india";

export type Job = {
  id: string; // UUID
  slug: string; // URL slug e.g. "senior-frontend-engineer-scaler"
  title: string; // e.g. "Senior Frontend Engineer"
  company: string; // e.g. "Scaler"
  companyLogoUrl: string | null; // Cloudinary URL, null until admin uploads
  department: Department;
  city: City;
  type: JobType;
  experienceLevel: ExperienceLevel;
  minYears: number; // e.g. 3
  maxYears: number; // e.g. 6
  minSalaryLpa: number | null; // Lakhs per annum, null = "competitive"
  maxSalaryLpa: number | null;
  description: string; // Markdown-supported body
  responsibilities: string[]; // Bullet list
  requirements: string[]; // Bullet list
  niceToHave: string[]; // Bullet list, optional (can be empty)
  benefits: string[]; // Bullet list, optional (can be empty)
  status: JobStatus;
  postedAt: string; // ISO date
  closesAt: string | null; // ISO date, null = open indefinitely
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
};
