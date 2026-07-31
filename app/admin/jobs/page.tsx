"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search, Eye, Pencil, Trash2, Lock, RotateCcw } from "lucide-react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { AdminPageHeader, StatusBadge } from "@/components/admin/ui";
import { JOB_STATUSES } from "@/lib/constants";
import { departmentLabel, cityLabel, formatDate } from "@/lib/jobs";
import type { JobStatus } from "@/lib/schema";

export default function AdminJobsPage() {
  const { jobs, applicationsForJob, setJobStatus, deleteJob, deleteJobs } = useAdmin();
  const [status, setStatus] = useState<JobStatus | "all">("all");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return jobs
      .filter((j) => (status === "all" ? true : j.status === status))
      .filter((j) => !query || j.title.toLowerCase().includes(query) || j.company.toLowerCase().includes(query))
      .sort((a, b) => b.postedAt.localeCompare(a.postedAt));
  }, [jobs, status, q]);

  const allSelected = filtered.length > 0 && filtered.every((j) => selected.has(j.id));
  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(filtered.map((j) => j.id)));

  const bulkClose = () => {
    selected.forEach((id) => setJobStatus(id, "closed"));
    setSelected(new Set());
  };
  const bulkDelete = () => {
    if (!window.confirm(`Delete ${selected.size} job(s)? This can't be undone.`)) return;
    deleteJobs([...selected]);
    setSelected(new Set());
  };

  return (
    <>
      <AdminPageHeader
        title="Jobs"
        description={`${jobs.length} total`}
        action={
          <Link
            href="/admin/jobs/new"
            className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-accent px-4 text-body-sm font-semibold text-accent-fg hover:bg-accent-2"
          >
            <Plus size={16} aria-hidden /> Create job
          </Link>
        }
      />

      {/* Controls */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex rounded-lg border border-border bg-surface p-1">
          {(["all", ...JOB_STATUSES.map((s) => s.value)] as (JobStatus | "all")[]).map((s) => (
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
        <label className="relative sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle" aria-hidden />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title or company…"
            className="h-10 w-full rounded-lg border border-border-strong bg-surface pl-9 pr-3 text-base text-text placeholder:text-text-subtle focus:border-accent focus:outline-none md:text-body-sm"
          />
        </label>
      </div>

      {/* Bulk bar */}
      {selected.size > 0 && (
        <div className="mb-3 flex items-center gap-3 rounded-lg border border-accent/30 bg-accent/5 px-4 py-2.5 text-body-sm">
          <span className="font-medium text-text">{selected.size} selected</span>
          <button onClick={bulkClose} className="font-medium text-text-muted hover:text-accent">
            Close
          </button>
          <button onClick={bulkDelete} className="font-medium text-text-muted hover:text-danger">
            Delete
          </button>
          <button onClick={() => setSelected(new Set())} className="ml-auto text-text-subtle hover:text-text">
            Clear
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full text-left text-body-sm">
          <thead>
            <tr className="border-b border-border text-caption uppercase tracking-wide text-text-subtle">
              <th className="px-4 py-3">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} aria-label="Select all" />
              </th>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Department</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Apps</th>
              <th className="px-4 py-3 font-medium">Posted</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-text-subtle">
                  No jobs match.
                </td>
              </tr>
            )}
            {filtered.map((job) => (
              <tr key={job.id} className="border-b border-border last:border-0 hover:bg-surface-2/50">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(job.id)}
                    onChange={() => toggle(job.id)}
                    aria-label={`Select ${job.title}`}
                  />
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/jobs/${job.id}/edit`} className="font-medium text-text hover:text-accent">
                    {job.title}
                  </Link>
                  <div className="text-caption text-text-subtle">{job.company}</div>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-text-muted">{departmentLabel(job.department)}</td>
                <td className="whitespace-nowrap px-4 py-3 text-text-muted">{cityLabel(job.city)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={job.status} />
                </td>
                <td className="px-4 py-3 text-text-muted">{applicationsForJob(job.id).length}</td>
                <td className="whitespace-nowrap px-4 py-3 text-text-muted">{formatDate(job.postedAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/jobs/${job.slug}`} target="_blank" className={iconBtn} aria-label="View public page">
                      <Eye size={16} aria-hidden />
                    </Link>
                    <Link href={`/admin/jobs/${job.id}/edit`} className={iconBtn} aria-label="Edit">
                      <Pencil size={16} aria-hidden />
                    </Link>
                    {job.status === "active" ? (
                      <button onClick={() => setJobStatus(job.id, "closed")} className={iconBtn} aria-label="Close">
                        <Lock size={16} aria-hidden />
                      </button>
                    ) : (
                      <button onClick={() => setJobStatus(job.id, "active")} className={iconBtn} aria-label="Reopen">
                        <RotateCcw size={16} aria-hidden />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete "${job.title}"?`)) deleteJob(job.id);
                      }}
                      className={`${iconBtn} hover:text-danger`}
                      aria-label="Delete"
                    >
                      <Trash2 size={16} aria-hidden />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

const iconBtn =
  "flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-surface-2 hover:text-accent";
