"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, Download, X } from "lucide-react";
import { useApplications, useJobs, useUpdateApplication } from "@/lib/admin/hooks";
import { AdminPageHeader, StatusBadge, ErrorState, LoadingState } from "@/components/admin/ui";
import { APPLICATION_STATUSES } from "@/lib/constants";
import { formatDate } from "@/lib/jobs";
import type { ApplicationStatus } from "@/lib/schema";

export default function AdminApplicationsPage() {
  return (
    <Suspense fallback={null}>
      <ApplicationsInner />
    </Suspense>
  );
}

function ApplicationsInner() {
  const searchParams = useSearchParams();
  const jobFilter = searchParams.get("job"); // set by the edit-job "N applications" link
  const appsQuery = useApplications();
  const { data: jobs } = useJobs();
  const updateApp = useUpdateApplication();

  const applications = useMemo(() => appsQuery.data ?? [], [appsQuery.data]);

  const [status, setStatus] = useState<ApplicationStatus | "all">("all");
  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<ApplicationStatus | "">("");

  const jobTitle = jobFilter ? jobs?.find((j) => j.id === jobFilter)?.title : null;

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return applications
      .filter((a) => (jobFilter ? a.jobId === jobFilter : true))
      .filter((a) => (status === "all" ? true : a.status === status))
      .filter((a) => !query || a.candidateName.toLowerCase().includes(query) || a.candidateEmail.toLowerCase().includes(query))
      .filter((a) => (from ? a.submittedAt.slice(0, 10) >= from : true))
      .filter((a) => (to ? a.submittedAt.slice(0, 10) <= to : true))
      .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  }, [applications, jobFilter, status, q, from, to]);

  const allSelected = filtered.length > 0 && filtered.every((a) => selected.has(a.id));
  const toggle = (id: string) =>
    setSelected((p) => {
      const n = new Set(p);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  const applyBulk = () => {
    if (!bulkStatus) return;
    selected.forEach((id) => updateApp.mutate({ id, status: bulkStatus }));
    setSelected(new Set());
    setBulkStatus("");
  };

  return (
    <>
      <AdminPageHeader title="Applications" description={appsQuery.data ? `${applications.length} total` : undefined} />

      {jobTitle && (
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-3 py-1.5 text-body-sm">
          Filtered by role: <span className="font-medium text-text">{jobTitle}</span>
          <Link href="/admin/applications" className="text-text-subtle hover:text-danger" aria-label="Clear job filter">
            <X size={14} aria-hidden />
          </Link>
        </div>
      )}

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="inline-flex flex-wrap rounded-lg border border-border bg-surface p-1">
          {(["all", ...APPLICATION_STATUSES.map((s) => s.value)] as (ApplicationStatus | "all")[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`h-8 rounded-md px-3 text-body-sm font-medium capitalize transition-colors ${
                status === s ? "bg-accent/10 text-accent" : "text-text-muted hover:text-text"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={dateCls} aria-label="From date" />
          <span className="text-text-subtle">–</span>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={dateCls} aria-label="To date" />
          <label className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle" aria-hidden />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Name or email…"
              className="h-10 w-full rounded-lg border border-border-strong bg-surface pl-9 pr-3 text-base text-text placeholder:text-text-subtle focus:border-accent focus:outline-none md:text-body-sm lg:w-52"
            />
          </label>
        </div>
      </div>

      {selected.size > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-3 rounded-lg border border-accent/30 bg-accent/5 px-4 py-2.5 text-body-sm">
          <span className="font-medium text-text">{selected.size} selected</span>
          <select value={bulkStatus} onChange={(e) => setBulkStatus(e.target.value as ApplicationStatus)} className={dateCls}>
            <option value="">Set status…</option>
            {APPLICATION_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <button onClick={applyBulk} disabled={!bulkStatus} className="font-medium text-accent disabled:opacity-40">
            Apply
          </button>
          <button onClick={() => setSelected(new Set())} className="ml-auto text-text-subtle hover:text-text">
            Clear
          </button>
        </div>
      )}

      {appsQuery.isLoading ? (
        <LoadingState rows={6} />
      ) : appsQuery.isError ? (
        <ErrorState message={(appsQuery.error as Error)?.message} onRetry={() => appsQuery.refetch()} />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full text-left text-body-sm">
            <thead>
              <tr className="border-b border-border text-caption uppercase tracking-wide text-text-subtle">
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={() => setSelected(allSelected ? new Set() : new Set(filtered.map((a) => a.id)))}
                    aria-label="Select all"
                  />
                </th>
                <th className="px-4 py-3 font-medium">Candidate</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Submitted</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-text-subtle">
                    No applications match.
                  </td>
                </tr>
              )}
              {filtered.map((a) => (
                <tr key={a.id} className="border-b border-border last:border-0 hover:bg-surface-2/50">
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.has(a.id)} onChange={() => toggle(a.id)} aria-label={`Select ${a.candidateName}`} />
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/applications/${a.id}`} className="font-medium text-text hover:text-accent">
                      {a.candidateName}
                    </Link>
                    <div className="text-caption text-text-subtle">{a.candidateEmail}</div>
                  </td>
                  <td className="px-4 py-3 text-text-muted">{a.jobTitle ? `${a.jobTitle} · ${a.jobCompany}` : "General"}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-text-muted">{formatDate(a.submittedAt)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <select
                        value={a.status}
                        onChange={(e) => updateApp.mutate({ id: a.id, status: e.target.value as ApplicationStatus })}
                        className="h-8 rounded-lg border border-border bg-surface px-2 text-caption text-text focus:border-accent focus:outline-none"
                        aria-label="Update status"
                      >
                        {APPLICATION_STATUSES.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                      <a
                        href={a.cvFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:bg-surface-2 hover:text-accent"
                        aria-label="Download CV"
                      >
                        <Download size={16} aria-hidden />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

const dateCls = "h-10 rounded-lg border border-border-strong bg-surface px-3 text-body-sm text-text focus:border-accent focus:outline-none";
