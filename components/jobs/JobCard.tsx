import Link from "next/link";
import { MapPin, Briefcase, ArrowUpRight, Clock } from "lucide-react";
import type { Job } from "@/lib/schema";
import {
  formatSalary,
  formatExperience,
  formatDate,
  cityLabel,
  departmentLabel,
  jobTypeLabel,
} from "@/lib/jobs";

/**
 * JobCard — the listing + related-jobs card. Plain (server-renderable) component;
 * the whole card is a link to the role detail.
 */
export default function JobCard({ job }: { job: Job }) {
  return (
    <Link
      href={`/jobs/${job.slug}`}
      className="group/card flex h-full flex-col rounded-xl border border-border bg-surface p-6 transition-[border-color,box-shadow] duration-[var(--duration-base)] hover:border-accent hover:shadow-[var(--shadow-glow-accent)]"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-h4 font-semibold text-text group-hover/card:text-accent">
            {job.title}
          </h3>
          <p className="mt-0.5 text-body-sm text-text-muted">{job.company}</p>
        </div>
        <ArrowUpRight
          size={18}
          className="mt-1 shrink-0 text-text-subtle transition-transform group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5 group-hover/card:text-accent"
          aria-hidden
        />
      </div>

      <div className="mb-4 flex flex-wrap gap-x-4 gap-y-1.5 text-body-sm text-text-muted">
        <span className="inline-flex items-center gap-1.5">
          <MapPin size={14} className="text-text-subtle" aria-hidden />
          {cityLabel(job.city)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Briefcase size={14} className="text-text-subtle" aria-hidden />
          {formatExperience(job.minYears, job.maxYears)}
        </span>
      </div>

      <p className="mb-5 text-h4 font-bold text-accent">
        {formatSalary(job.minSalaryLpa, job.maxSalaryLpa)}
      </p>

      <div className="mt-auto flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-border bg-surface-2 px-3 py-1 text-caption text-text-muted">
          {departmentLabel(job.department)}
        </span>
        <span className="rounded-full border border-border bg-surface-2 px-3 py-1 text-caption text-text-muted">
          {jobTypeLabel(job.type)}
        </span>
        <span className="ml-auto inline-flex items-center gap-1 text-caption text-text-subtle">
          <Clock size={12} aria-hidden />
          {formatDate(job.postedAt)}
        </span>
      </div>
    </Link>
  );
}
