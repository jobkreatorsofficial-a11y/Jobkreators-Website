"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Download, ExternalLink, FileText } from "lucide-react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { AdminPageHeader, StatusBadge, formatDateTime } from "@/components/admin/ui";
import { APPLICATION_STATUSES } from "@/lib/constants";
import { cityLabel } from "@/lib/jobs";
import type { ApplicationStatus } from "@/lib/schema";

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { applications, setApplicationStatus } = useAdmin();
  const app = applications.find((a) => a.id === id);
  const [note, setNote] = useState("");

  if (!app) {
    return (
      <NotFound />
    );
  }

  const ext = app.cvFileName.split(".").pop()?.toUpperCase() ?? "FILE";
  const lpa = (n: number | null) => (n != null ? `₹${n} LPA` : "—");

  return (
    <>
      <Link href="/admin/applications" className="mb-4 inline-flex items-center gap-1.5 text-body-sm font-medium text-text-muted hover:text-accent">
        <ArrowLeft size={16} aria-hidden /> Back to applications
      </Link>
      <AdminPageHeader
        title={app.candidateName}
        description={app.jobTitle ? `${app.jobTitle} · ${app.jobCompany}` : "General application"}
        action={<StatusBadge status={app.status} />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          {/* Candidate details */}
          <Card title="Candidate">
            <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              <Item label="Email">
                <a href={`mailto:${app.candidateEmail}`} className="text-accent hover:underline">{app.candidateEmail}</a>
              </Item>
              <Item label="Phone">
                <a href={`tel:${app.candidatePhone}`} className="text-accent hover:underline">{app.candidatePhone}</a>
              </Item>
              <Item label="City">{cityLabel(app.candidateCity)}</Item>
              <Item label="Experience">{app.yearsOfExperience} yrs</Item>
              <Item label="Current">{app.currentRole ? `${app.currentRole}${app.currentCompany ? ` at ${app.currentCompany}` : ""}` : "—"}</Item>
              <Item label="Notice period">{app.noticePeriodDays != null ? `${app.noticePeriodDays} days` : "—"}</Item>
              <Item label="Current salary">{lpa(app.currentSalaryLpa)}</Item>
              <Item label="Expected salary">{lpa(app.expectedSalaryLpa)}</Item>
              <Item label="LinkedIn">{app.linkedinUrl ? <Ext href={app.linkedinUrl} /> : "—"}</Item>
              <Item label="Portfolio">{app.portfolioUrl ? <Ext href={app.portfolioUrl} /> : "—"}</Item>
            </dl>
            {app.coverMessage && (
              <div className="mt-5 border-t border-border pt-5">
                <p className="mb-1.5 text-body-sm font-semibold text-text">Cover message</p>
                <p className="text-body text-text-muted">{app.coverMessage}</p>
              </div>
            )}
          </Card>

          {/* CV — Phase 1 has no file storage, so this is a placeholder (same
              visual weight as the eventual preview). Phase 2 renders the real PDF. */}
          <Card title="CV">
            <div className="flex min-h-[440px] flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border bg-surface-2 p-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-surface">
                <FileText size={30} className="text-accent" aria-hidden />
              </div>
              <div>
                <p className="text-body font-medium text-text">{app.cvFileName}</p>
                <p className="mt-0.5 text-caption uppercase tracking-wide text-text-subtle">{ext} file</p>
              </div>
              <p className="max-w-xs text-body-sm text-text-muted">
                CV preview available once file storage is connected (Phase 2).
              </p>
              <button
                type="button"
                disabled
                title="Available in Phase 2"
                className="inline-flex h-10 cursor-not-allowed items-center gap-1.5 rounded-lg border border-border-strong bg-surface px-4 text-body-sm font-medium text-text-subtle opacity-60"
              >
                <Download size={15} aria-hidden /> Download CV
              </button>
            </div>
          </Card>
        </div>

        {/* Sidebar: status + notes + timeline */}
        <div className="flex flex-col gap-6">
          <Card title="Status">
            <select
              value={app.status}
              onChange={(e) => setApplicationStatus(app.id, e.target.value as ApplicationStatus)}
              className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-body-sm text-text focus:border-accent focus:outline-none"
            >
              {APPLICATION_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <label className="mt-4 block">
              <span className="mb-1.5 block text-body-sm font-semibold text-text">Internal note</span>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a private note…"
                className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-base text-text placeholder:text-text-subtle focus:border-accent focus:outline-none md:text-body-sm"
              />
            </label>
            <button
              type="button"
              onClick={() => {
                // TODO Phase 2: persist the note against the application.
                if (process.env.NODE_ENV === "development") console.log("[admin] note", { id: app.id, note });
                setNote("");
              }}
              disabled={!note.trim()}
              className="mt-2 inline-flex h-9 items-center rounded-lg bg-accent px-4 text-body-sm font-semibold text-accent-fg hover:bg-accent-2 disabled:opacity-40"
            >
              Save note
            </button>
          </Card>

          <Card title="Timeline">
            {/* Phase 1: derived from submitted/updated. Phase 2 stores real history. */}
            <ol className="relative ml-1.5 border-l border-border pl-5">
              <TimelineItem label="Application submitted" at={app.submittedAt} />
              {app.updatedAt !== app.submittedAt && (
                <TimelineItem label={`Status → ${app.status}`} at={app.updatedAt} />
              )}
            </ol>
          </Card>
        </div>
      </div>
    </>
  );
}

function NotFound() {
  return (
    <div className="rounded-xl border border-dashed border-border-strong bg-surface-2 px-6 py-16 text-center">
      <p className="text-h4 font-semibold text-text">Application not found</p>
      <Link href="/admin/applications" className="mt-6 inline-flex h-11 items-center rounded-full bg-accent px-5 text-body-sm font-semibold text-accent-fg">
        Back to applications
      </Link>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-surface p-5 md:p-6">
      <h2 className="mb-4 text-body font-semibold text-text">{title}</h2>
      {children}
    </section>
  );
}

function Item({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-caption uppercase tracking-wide text-text-subtle">{label}</dt>
      <dd className="mt-0.5 text-body-sm text-text">{children}</dd>
    </div>
  );
}

function Ext({ href }: { href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-accent hover:underline">
      Open <ExternalLink size={13} aria-hidden />
    </a>
  );
}

function TimelineItem({ label, at }: { label: string; at: string }) {
  return (
    <li className="mb-4 last:mb-0">
      <span className="absolute -left-[7px] mt-1 h-3 w-3 rounded-full border-2 border-accent bg-surface" aria-hidden />
      <p className="text-body-sm font-medium capitalize text-text">{label}</p>
      <p className="text-caption text-text-subtle">{formatDateTime(at)}</p>
    </li>
  );
}
