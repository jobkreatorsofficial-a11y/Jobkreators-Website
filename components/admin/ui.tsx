import Link from "next/link";
import { formatDate } from "@/lib/jobs";

// Tone + label for every status value across the four enums (+ chat).
const TONE = {
  green: "bg-success/10 text-success",
  accent: "bg-accent/10 text-accent",
  amber: "bg-warning/10 text-warning",
  red: "bg-danger/10 text-danger",
  muted: "bg-surface-3 text-text-muted",
} as const;

const STATUS: Record<string, { label: string; tone: keyof typeof TONE }> = {
  // job
  active: { label: "Active", tone: "green" },
  closed: { label: "Closed", tone: "muted" },
  draft: { label: "Draft", tone: "amber" },
  // application
  submitted: { label: "Submitted", tone: "accent" },
  reviewing: { label: "Reviewing", tone: "amber" },
  shortlisted: { label: "Shortlisted", tone: "accent" },
  rejected: { label: "Rejected", tone: "red" },
  hired: { label: "Hired", tone: "green" },
  // employer inquiry
  new: { label: "New", tone: "accent" },
  contacted: { label: "Contacted", tone: "amber" },
  qualified: { label: "Qualified", tone: "green" },
  // chat
  "cv-submitted": { label: "CV submitted", tone: "green" },
};

export function StatusBadge({ status }: { status: string }) {
  const s = STATUS[status] ?? { label: status, tone: "muted" as const };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-caption font-medium ${TONE[s.tone]}`}>
      {s.label}
    </span>
  );
}

/** ISO → "18 Jul 2026, 09:30" (UTC clock; deterministic, no tz drift). */
export function formatDateTime(iso: string): string {
  return `${formatDate(iso)}, ${iso.slice(11, 16)}`;
}

/** Shared list table used across admin pages. First cell links to `href`. */
export function Table({
  head,
  rows,
  emptyText = "Nothing here yet.",
}: {
  head: string[];
  rows: { key: string; href?: string; cells: React.ReactNode[] }[];
  emptyText?: string;
}) {
  if (rows.length === 0) {
    return <p className="px-5 py-10 text-center text-body-sm text-text-subtle">{emptyText}</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-body-sm">
        <thead>
          <tr className="border-b border-border text-caption uppercase tracking-wide text-text-subtle">
            {head.map((h) => (
              <th key={h} className="whitespace-nowrap px-5 py-3 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key} className="border-b border-border last:border-0 hover:bg-surface-2/50">
              {r.cells.map((cell, i) => (
                <td key={i} className="whitespace-nowrap px-5 py-3 text-text-muted">
                  {r.href && i === 0 ? (
                    <Link href={r.href} className="hover:text-accent">
                      {cell}
                    </Link>
                  ) : (
                    cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-h2 font-semibold text-text">{title}</h1>
        {description && <p className="mt-1 text-body-sm text-text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
