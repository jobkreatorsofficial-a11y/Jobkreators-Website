"use client";

import { createContext, useContext, useState } from "react";
import {
  MOCK_JOBS,
  MOCK_APPLICATIONS,
  MOCK_EMPLOYER_INQUIRIES,
  MOCK_CHAT_SESSIONS,
} from "@/lib/mock";
import type {
  Job,
  JobApplication,
  EmployerInquiry,
  ChatSession,
  ApplicationStatus,
  EmployerInquiryStatus,
  JobStatus,
} from "@/lib/schema";

/**
 * AdminProvider — the Phase 1 admin data layer. Collections are seeded from the
 * mock (the useState initializers run on the server too, so SSR renders real data)
 * and mutated IN MEMORY only; a reload resets to the mock. Every mutation also logs
 * its intent in dev.
 *
 * TODO Phase 2: replace this with server actions / API routes backed by Postgres,
 * behind the same method signatures.
 */

type AdminContext = {
  jobs: Job[];
  applications: JobApplication[];
  inquiries: EmployerInquiry[];
  chatSessions: ChatSession[];
  createJob: (job: Job) => void;
  updateJob: (id: string, patch: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  deleteJobs: (ids: string[]) => void;
  setJobStatus: (id: string, status: JobStatus) => void;
  setApplicationStatus: (id: string, status: ApplicationStatus) => void;
  setInquiryStatus: (id: string, status: EmployerInquiryStatus) => void;
  applicationsForJob: (jobId: string) => JobApplication[];
};

const Ctx = createContext<AdminContext | null>(null);

export function useAdmin(): AdminContext {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAdmin must be used within <AdminProvider>");
  return ctx;
}

const log = (msg: string, data: unknown) => {
  // TODO Phase 2: replace with API mutation.
  if (process.env.NODE_ENV === "development") console.log(msg, data);
};

export default function AdminProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>(() => MOCK_JOBS);
  const [applications, setApplications] = useState<JobApplication[]>(() => MOCK_APPLICATIONS);
  const [inquiries, setInquiries] = useState<EmployerInquiry[]>(() => MOCK_EMPLOYER_INQUIRIES);
  const [chatSessions] = useState<ChatSession[]>(() => MOCK_CHAT_SESSIONS);

  const value: AdminContext = {
    jobs,
    applications,
    inquiries,
    chatSessions,
    createJob: (job) => {
      log("[admin] createJob", job);
      setJobs((prev) => [job, ...prev]);
    },
    updateJob: (id, patch) => {
      log("[admin] updateJob", { id, patch });
      setJobs((prev) =>
        prev.map((j) => (j.id === id ? { ...j, ...patch, updatedAt: new Date().toISOString() } : j)),
      );
    },
    deleteJob: (id) => {
      log("[admin] deleteJob", { id });
      setJobs((prev) => prev.filter((j) => j.id !== id));
    },
    deleteJobs: (ids) => {
      log("[admin] deleteJobs", { ids });
      setJobs((prev) => prev.filter((j) => !ids.includes(j.id)));
    },
    setJobStatus: (id, status) => {
      log("[admin] setJobStatus", { id, status });
      setJobs((prev) =>
        prev.map((j) => (j.id === id ? { ...j, status, updatedAt: new Date().toISOString() } : j)),
      );
    },
    setApplicationStatus: (id, status) => {
      log("[admin] setApplicationStatus", { id, status });
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status, updatedAt: new Date().toISOString() } : a)),
      );
    },
    setInquiryStatus: (id, status) => {
      log("[admin] setInquiryStatus", { id, status });
      setInquiries((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status, updatedAt: new Date().toISOString() } : i)),
      );
    },
    applicationsForJob: (jobId) => applications.filter((a) => a.jobId === jobId),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
