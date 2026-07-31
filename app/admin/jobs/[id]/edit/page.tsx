"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Copy, Lock, RotateCcw, Trash2, Users } from "lucide-react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { AdminPageHeader, StatusBadge } from "@/components/admin/ui";
import JobForm from "@/components/admin/JobForm";

export default function EditJobPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { jobs, updateJob, deleteJob, setJobStatus, createJob, applicationsForJob } = useAdmin();
  const job = jobs.find((j) => j.id === id);

  if (!job) {
    return (
      <div className="rounded-xl border border-dashed border-border-strong bg-surface-2 px-6 py-16 text-center">
        <p className="text-h4 font-semibold text-text">Job not found</p>
        <p className="mt-2 text-body-sm text-text-muted">
          It may have been deleted, or created in a session that has since reloaded (mock data resets on reload).
        </p>
        <Link href="/admin/jobs" className="mt-6 inline-flex h-11 items-center rounded-full bg-accent px-5 text-body-sm font-semibold text-accent-fg">
          Back to jobs
        </Link>
      </div>
    );
  }

  const appCount = applicationsForJob(job.id).length;

  const duplicate = () => {
    const now = new Date().toISOString();
    createJob({
      ...job,
      id: crypto.randomUUID(),
      slug: `${job.slug}-copy`,
      title: `${job.title} (copy)`,
      status: "draft",
      postedAt: now,
      createdAt: now,
      updatedAt: now,
    });
    router.push("/admin/jobs");
  };

  return (
    <>
      <Link
        href="/admin/jobs"
        className="mb-4 inline-flex items-center gap-1.5 text-body-sm font-medium text-text-muted hover:text-accent"
      >
        <ArrowLeft size={16} aria-hidden /> Back to jobs
      </Link>
      <AdminPageHeader
        title="Edit job"
        description={job.company}
        action={<StatusBadge status={job.status} />}
      />

      {/* Quick actions */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Link
          href={`/admin/applications?job=${job.id}`}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-body-sm font-medium text-text-muted hover:border-accent hover:text-text"
        >
          <Users size={15} aria-hidden /> {appCount} application{appCount === 1 ? "" : "s"}
        </Link>
        {job.status === "active" ? (
          <button onClick={() => setJobStatus(job.id, "closed")} className={actionBtn}>
            <Lock size={15} aria-hidden /> Close
          </button>
        ) : (
          <button onClick={() => setJobStatus(job.id, "active")} className={actionBtn}>
            <RotateCcw size={15} aria-hidden /> Reopen
          </button>
        )}
        <button onClick={duplicate} className={actionBtn}>
          <Copy size={15} aria-hidden /> Duplicate
        </button>
        <button
          onClick={() => {
            if (window.confirm(`Delete "${job.title}"?`)) {
              deleteJob(job.id);
              router.push("/admin/jobs");
            }
          }}
          className={`${actionBtn} hover:border-danger hover:text-danger`}
        >
          <Trash2 size={15} aria-hidden /> Delete
        </button>
      </div>

      <JobForm
        job={job}
        onSave={(updated) => {
          updateJob(updated.id, updated);
          router.push("/admin/jobs");
        }}
      />
    </>
  );
}

const actionBtn =
  "inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-body-sm font-medium text-text-muted transition-colors hover:border-accent hover:text-text";
