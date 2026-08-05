// Typed data-access layer over Drizzle — the ONLY place server code (admin Route
// Handlers) touches the tables. Keeps SQL out of routes and gives every caller
// inferred row types from db/types.ts.

import { and, or, eq, ilike, gte, lte, inArray, desc, sql } from "drizzle-orm";
import { db } from "./index";
import { jobs, jobApplications, employerInquiries, chatSessions } from "./schema";
import type {
  Job,
  NewJob,
  JobApplication,
  EmployerInquiry,
  ChatSession,
} from "./types";
import type {
  JobStatus,
  Department,
  City,
  ApplicationStatus,
  EmployerInquiryStatus,
} from "@/lib/schema";

// --- Filter shapes (all optional; routes parse these from query params) ---
export type JobFilters = {
  status?: JobStatus;
  department?: Department;
  city?: City;
  search?: string;
  limit?: number;
  offset?: number;
};
export type ApplicationFilters = {
  status?: ApplicationStatus;
  jobId?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
};
export type InquiryFilters = {
  status?: EmployerInquiryStatus;
  search?: string;
  limit?: number;
  offset?: number;
};
export type ChatFilters = {
  status?: ChatSession["status"];
  limit?: number;
  offset?: number;
};

// --- Jobs ---
export function listJobs(f: JobFilters = {}): Promise<Job[]> {
  const where = and(
    f.status ? eq(jobs.status, f.status) : undefined,
    f.department ? eq(jobs.department, f.department) : undefined,
    f.city ? eq(jobs.city, f.city) : undefined,
    f.search ? or(ilike(jobs.title, `%${f.search}%`), ilike(jobs.company, `%${f.search}%`)) : undefined,
  );
  return db
    .select()
    .from(jobs)
    .where(where)
    .orderBy(desc(jobs.postedAt))
    .limit(f.limit ?? 200)
    .offset(f.offset ?? 0);
}

export async function getJob(id: string): Promise<Job | undefined> {
  const [row] = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
  return row;
}

export async function insertJob(
  data: Omit<NewJob, "postedAt"> & { postedAt?: string | null },
): Promise<Job> {
  // posted_at is NOT NULL with no DB default (it's a business "published on" date,
  // not an audit field). The admin JobForm always sends it, but default it here so
  // a malformed body can't 500 the route. id/created_at/updated_at have DB defaults.
  const [row] = await db
    .insert(jobs)
    .values({ ...data, postedAt: data.postedAt ?? new Date().toISOString() })
    .returning();
  return row;
}

export async function patchJob(id: string, patch: Partial<NewJob>): Promise<Job | undefined> {
  // Never let a client-supplied id/createdAt overwrite the row; always stamp a
  // fresh updatedAt server-side (authoritative over the optimistic client value).
  const { id: _id, createdAt: _createdAt, ...rest } = patch;
  void _id;
  void _createdAt;
  const [row] = await db
    .update(jobs)
    .set({ ...rest, updatedAt: new Date().toISOString() })
    .where(eq(jobs.id, id))
    .returning();
  return row;
}

export async function removeJob(id: string): Promise<void> {
  await db.delete(jobs).where(eq(jobs.id, id));
}

export async function removeJobs(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  await db.delete(jobs).where(inArray(jobs.id, ids));
}

// --- Applications (created via the public flow in 2C; admin reads + updates) ---
export function listApplications(f: ApplicationFilters = {}): Promise<JobApplication[]> {
  const where = and(
    f.status ? eq(jobApplications.status, f.status) : undefined,
    f.jobId ? eq(jobApplications.jobId, f.jobId) : undefined,
    f.search
      ? or(
          ilike(jobApplications.candidateName, `%${f.search}%`),
          ilike(jobApplications.candidateEmail, `%${f.search}%`),
        )
      : undefined,
    f.dateFrom ? gte(jobApplications.submittedAt, f.dateFrom) : undefined,
    f.dateTo ? lte(jobApplications.submittedAt, `${f.dateTo}T23:59:59.999Z`) : undefined,
  );
  return db
    .select()
    .from(jobApplications)
    .where(where)
    .orderBy(desc(jobApplications.submittedAt))
    .limit(f.limit ?? 200)
    .offset(f.offset ?? 0);
}

export async function getApplication(id: string): Promise<JobApplication | undefined> {
  const [row] = await db.select().from(jobApplications).where(eq(jobApplications.id, id)).limit(1);
  return row;
}

export async function patchApplication(
  id: string,
  patch: { status?: ApplicationStatus; internalNotes?: string },
): Promise<JobApplication | undefined> {
  const [row] = await db
    .update(jobApplications)
    .set({ ...patch, updatedAt: new Date().toISOString() })
    .where(eq(jobApplications.id, id))
    .returning();
  return row;
}

// --- Employer inquiries (created via the public flow in 2C) ---
export function listEmployerInquiries(f: InquiryFilters = {}): Promise<EmployerInquiry[]> {
  const where = and(
    f.status ? eq(employerInquiries.status, f.status) : undefined,
    f.search
      ? or(
          ilike(employerInquiries.companyName, `%${f.search}%`),
          ilike(employerInquiries.roleTitle, `%${f.search}%`),
        )
      : undefined,
  );
  return db
    .select()
    .from(employerInquiries)
    .where(where)
    .orderBy(desc(employerInquiries.submittedAt))
    .limit(f.limit ?? 200)
    .offset(f.offset ?? 0);
}

export async function getEmployerInquiry(id: string): Promise<EmployerInquiry | undefined> {
  const [row] = await db.select().from(employerInquiries).where(eq(employerInquiries.id, id)).limit(1);
  return row;
}

export async function patchInquiryStatus(
  id: string,
  status: EmployerInquiryStatus,
): Promise<EmployerInquiry | undefined> {
  const [row] = await db
    .update(employerInquiries)
    .set({ status, updatedAt: new Date().toISOString() })
    .where(eq(employerInquiries.id, id))
    .returning();
  return row;
}

export async function removeInquiry(id: string): Promise<void> {
  await db.delete(employerInquiries).where(eq(employerInquiries.id, id));
}

// --- Chat sessions (read-only in admin) ---
export function listChatSessions(f: ChatFilters = {}): Promise<ChatSession[]> {
  const where = f.status ? eq(chatSessions.status, f.status) : undefined;
  return db
    .select()
    .from(chatSessions)
    .where(where)
    .orderBy(desc(chatSessions.updatedAt))
    .limit(f.limit ?? 200)
    .offset(f.offset ?? 0);
}

export async function getChatSession(id: string): Promise<ChatSession | undefined> {
  const [row] = await db.select().from(chatSessions).where(eq(chatSessions.id, id)).limit(1);
  return row;
}

// --- Dashboard stats (single round-trip) ---
export type AdminStats = {
  activeJobs: number;
  appsThisWeek: number;
  inquiriesThisWeek: number;
  // Days from application to hire decision, averaged over hired applications.
  // (See NOTE in the stats route / report: the seed's submitted_at predates some
  // job posted_at, so a posted_at-based formula would be negative; updated_at −
  // submitted_at is the stable, always-positive "time to fill" proxy.)
  avgTimeToFillDays: number | null;
};

export async function getStats(): Promise<AdminStats> {
  const result = await db.execute(sql`
    SELECT
      (SELECT count(*) FROM jobs WHERE status = 'active')::int AS active_jobs,
      (SELECT count(*) FROM job_applications WHERE submitted_at >= now() - interval '7 days')::int AS apps_this_week,
      (SELECT count(*) FROM employer_inquiries WHERE submitted_at >= now() - interval '7 days')::int AS inquiries_this_week,
      (SELECT round(avg(extract(epoch FROM (updated_at - submitted_at)) / 86400))
         FROM job_applications WHERE status = 'hired')::int AS avg_time_to_fill
  `);
  const row = (result as unknown as Array<{
    active_jobs: number;
    apps_this_week: number;
    inquiries_this_week: number;
    avg_time_to_fill: number | null;
  }>)[0];
  return {
    activeJobs: Number(row.active_jobs),
    appsThisWeek: Number(row.apps_this_week),
    inquiriesThisWeek: Number(row.inquiries_this_week),
    avgTimeToFillDays: row.avg_time_to_fill == null ? null : Number(row.avg_time_to_fill),
  };
}
