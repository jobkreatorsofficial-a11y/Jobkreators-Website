"use client";

// TanStack Query hooks — the admin portal's client data layer. Queries fetch from
// the /api/admin/* Route Handlers; mutations optimistically update the cache for
// instant UI, then invalidate to reconcile with the DB. Import these in admin
// pages instead of the old useAdmin() context.

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Job,
  JobApplication,
  EmployerInquiry,
  ChatSession,
  JobStatus,
  ApplicationStatus,
  EmployerInquiryStatus,
} from "@/lib/schema";
import type { AdminStats } from "@/db/queries"; // type-only: erased, no server code shipped

async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? `GET ${url} failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

async function sendJSON<T>(url: string, method: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const b = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(b.error ?? `${method} ${url} failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

// Query keys — collections are plain arrays; details are [collection, id].
export const qk = {
  jobs: ["jobs"] as const,
  job: (id: string) => ["jobs", id] as const,
  applications: ["applications"] as const,
  application: (id: string) => ["applications", id] as const,
  inquiries: ["inquiries"] as const,
  inquiry: (id: string) => ["inquiries", id] as const,
  chatSessions: ["chat-sessions"] as const,
  stats: ["stats"] as const,
};

// --- Queries ---
export function useJobs() {
  return useQuery({ queryKey: qk.jobs, queryFn: () => getJSON<Job[]>("/api/admin/jobs") });
}
export function useJob(id: string) {
  return useQuery({ queryKey: qk.job(id), queryFn: () => getJSON<Job>(`/api/admin/jobs/${id}`), enabled: !!id });
}
export function useApplications() {
  return useQuery({ queryKey: qk.applications, queryFn: () => getJSON<JobApplication[]>("/api/admin/applications") });
}
export function useApplication(id: string) {
  return useQuery({
    queryKey: qk.application(id),
    queryFn: () => getJSON<JobApplication>(`/api/admin/applications/${id}`),
    enabled: !!id,
  });
}
export function useInquiries() {
  return useQuery({ queryKey: qk.inquiries, queryFn: () => getJSON<EmployerInquiry[]>("/api/admin/employer-inquiries") });
}
export function useInquiry(id: string) {
  return useQuery({
    queryKey: qk.inquiry(id),
    queryFn: () => getJSON<EmployerInquiry>(`/api/admin/employer-inquiries/${id}`),
    enabled: !!id,
  });
}
export function useChatSessions() {
  return useQuery({ queryKey: qk.chatSessions, queryFn: () => getJSON<ChatSession[]>("/api/admin/chat-sessions") });
}
export function useStats() {
  return useQuery({ queryKey: qk.stats, queryFn: () => getJSON<AdminStats>("/api/admin/stats") });
}

// --- Job mutations ---
export function useCreateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (job: Job) => sendJSON<Job>("/api/admin/jobs", "POST", job),
    onMutate: async (job) => {
      await qc.cancelQueries({ queryKey: qk.jobs });
      const prev = qc.getQueryData<Job[]>(qk.jobs);
      qc.setQueryData<Job[]>(qk.jobs, (old) => (old ? [job, ...old] : old));
      return { prev };
    },
    onError: (_e, _v, ctx) => ctx?.prev && qc.setQueryData(qk.jobs, ctx.prev),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: qk.jobs });
      qc.invalidateQueries({ queryKey: qk.stats });
    },
  });
}

export function useUpdateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Job> }) =>
      sendJSON<Job>(`/api/admin/jobs/${id}`, "PATCH", patch),
    onMutate: async ({ id, patch }) => {
      await qc.cancelQueries({ queryKey: qk.jobs });
      const prev = qc.getQueryData<Job[]>(qk.jobs);
      qc.setQueryData<Job[]>(qk.jobs, (old) => old?.map((j) => (j.id === id ? { ...j, ...patch } : j)));
      qc.setQueryData<Job>(qk.job(id), (old) => (old ? { ...old, ...patch } : old));
      return { prev };
    },
    onError: (_e, _v, ctx) => ctx?.prev && qc.setQueryData(qk.jobs, ctx.prev),
    onSettled: (_d, _e, { id }) => {
      qc.invalidateQueries({ queryKey: qk.jobs });
      qc.invalidateQueries({ queryKey: qk.job(id) });
      qc.invalidateQueries({ queryKey: qk.stats });
    },
  });
}

export function useSetJobStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: JobStatus }) =>
      sendJSON<Job>(`/api/admin/jobs/${id}`, "PATCH", { status }),
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: qk.jobs });
      const prev = qc.getQueryData<Job[]>(qk.jobs);
      qc.setQueryData<Job[]>(qk.jobs, (old) => old?.map((j) => (j.id === id ? { ...j, status } : j)));
      return { prev };
    },
    onError: (_e, _v, ctx) => ctx?.prev && qc.setQueryData(qk.jobs, ctx.prev),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: qk.jobs });
      qc.invalidateQueries({ queryKey: qk.stats });
    },
  });
}

export function useDeleteJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sendJSON<{ deleted: string }>(`/api/admin/jobs/${id}`, "DELETE"),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: qk.jobs });
      const prev = qc.getQueryData<Job[]>(qk.jobs);
      qc.setQueryData<Job[]>(qk.jobs, (old) => old?.filter((j) => j.id !== id));
      return { prev };
    },
    onError: (_e, _v, ctx) => ctx?.prev && qc.setQueryData(qk.jobs, ctx.prev),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: qk.jobs });
      qc.invalidateQueries({ queryKey: qk.stats });
      qc.invalidateQueries({ queryKey: qk.applications }); // deleted job nulls their jobId
    },
  });
}

export function useDeleteJobs() {
  const qc = useQueryClient();
  return useMutation({
    // No bulk endpoint by design — fan out to DELETE /jobs/[id] in parallel.
    mutationFn: (ids: string[]) => Promise.all(ids.map((id) => sendJSON(`/api/admin/jobs/${id}`, "DELETE"))),
    onMutate: async (ids) => {
      await qc.cancelQueries({ queryKey: qk.jobs });
      const prev = qc.getQueryData<Job[]>(qk.jobs);
      const set = new Set(ids);
      qc.setQueryData<Job[]>(qk.jobs, (old) => old?.filter((j) => !set.has(j.id)));
      return { prev };
    },
    onError: (_e, _v, ctx) => ctx?.prev && qc.setQueryData(qk.jobs, ctx.prev),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: qk.jobs });
      qc.invalidateQueries({ queryKey: qk.stats });
      qc.invalidateQueries({ queryKey: qk.applications });
    },
  });
}

// --- Application mutations (status and/or internal note) ---
export function useUpdateApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, internalNote }: { id: string; status?: ApplicationStatus; internalNote?: string }) =>
      sendJSON<JobApplication>(`/api/admin/applications/${id}`, "PATCH", { status, internalNote }),
    onMutate: async ({ id, status, internalNote }) => {
      await qc.cancelQueries({ queryKey: qk.applications });
      const prev = qc.getQueryData<JobApplication[]>(qk.applications);
      const apply = (a: JobApplication) => ({
        ...a,
        ...(status !== undefined ? { status } : {}),
        ...(internalNote !== undefined ? { internalNotes: internalNote } : {}),
      });
      qc.setQueryData<JobApplication[]>(qk.applications, (old) => old?.map((a) => (a.id === id ? apply(a) : a)));
      qc.setQueryData<JobApplication>(qk.application(id), (old) => (old ? apply(old) : old));
      return { prev };
    },
    onError: (_e, _v, ctx) => ctx?.prev && qc.setQueryData(qk.applications, ctx.prev),
    onSettled: (_d, _e, { id }) => {
      qc.invalidateQueries({ queryKey: qk.applications });
      qc.invalidateQueries({ queryKey: qk.application(id) });
      qc.invalidateQueries({ queryKey: qk.stats }); // "hired" affects avg time-to-fill
    },
  });
}

// --- Employer inquiry mutations ---
export function useSetInquiryStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: EmployerInquiryStatus }) =>
      sendJSON<EmployerInquiry>(`/api/admin/employer-inquiries/${id}`, "PATCH", { status }),
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: qk.inquiries });
      const prev = qc.getQueryData<EmployerInquiry[]>(qk.inquiries);
      qc.setQueryData<EmployerInquiry[]>(qk.inquiries, (old) => old?.map((i) => (i.id === id ? { ...i, status } : i)));
      qc.setQueryData<EmployerInquiry>(qk.inquiry(id), (old) => (old ? { ...old, status } : old));
      return { prev };
    },
    onError: (_e, _v, ctx) => ctx?.prev && qc.setQueryData(qk.inquiries, ctx.prev),
    onSettled: (_d, _e, { id }) => {
      qc.invalidateQueries({ queryKey: qk.inquiries });
      qc.invalidateQueries({ queryKey: qk.inquiry(id) });
    },
  });
}

export function useDeleteInquiry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sendJSON<{ deleted: string }>(`/api/admin/employer-inquiries/${id}`, "DELETE"),
    onSettled: () => qc.invalidateQueries({ queryKey: qk.inquiries }),
  });
}
