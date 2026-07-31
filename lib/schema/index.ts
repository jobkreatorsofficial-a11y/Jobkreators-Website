// Barrel re-export for the jobs-portal schema. Import from "@/lib/schema".
export type {
  Job,
  JobType,
  ExperienceLevel,
  JobStatus,
  Department,
  City,
} from "./job";
export type { JobApplication, ApplicationStatus } from "./application";
export type { EmployerInquiry, EmployerInquiryStatus } from "./employer";
export type { ChatMessage, ChatSession } from "./chat";
