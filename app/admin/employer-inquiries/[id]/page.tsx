"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ExternalLink, FileText, Plus, Lock } from "lucide-react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { AdminPageHeader, StatusBadge, formatDateTime } from "@/components/admin/ui";
import { EMPLOYER_INQUIRY_STATUSES } from "@/lib/constants";
import { departmentLabel, cityLabel, jobTypeLabel, formatSalary, formatExperience } from "@/lib/jobs";
import type { EmployerInquiryStatus } from "@/lib/schema";

export default function InquiryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { inquiries, setInquiryStatus } = useAdmin();
  const inq = inquiries.find((i) => i.id === id);

  if (!inq) {
    return (
      <div className="rounded-xl border border-dashed border-border-strong bg-surface-2 px-6 py-16 text-center">
        <p className="text-h4 font-semibold text-text">Inquiry not found</p>
        <Link href="/admin/employer-inquiries" className="mt-6 inline-flex h-11 items-center rounded-full bg-accent px-5 text-body-sm font-semibold text-accent-fg">
          Back to inquiries
        </Link>
      </div>
    );
  }

  const confidential = /confidential/i.test(inq.additionalNotes ?? "") || /confidential/i.test(inq.companyName);

  return (
    <>
      <Link href="/admin/employer-inquiries" className="mb-4 inline-flex items-center gap-1.5 text-body-sm font-medium text-text-muted hover:text-accent">
        <ArrowLeft size={16} aria-hidden /> Back to inquiries
      </Link>
      <AdminPageHeader title={inq.companyName} description={inq.roleTitle} action={<StatusBadge status={inq.status} />} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          {confidential && (
            <div className="flex items-center gap-2 rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-body-sm text-warning">
              <Lock size={16} aria-hidden /> Confidential search — do not disclose the company to candidates.
            </div>
          )}

          <Card title="Company & contact">
            <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              <Item label="Company">{inq.companyName}</Item>
              <Item label="Website">{inq.companyWebsite ? <Ext href={inq.companyWebsite} /> : "—"}</Item>
              <Item label="Contact">{inq.contactPerson}</Item>
              <Item label="Designation">{inq.designation}</Item>
              <Item label="Email"><a href={`mailto:${inq.contactEmail}`} className="text-accent hover:underline">{inq.contactEmail}</a></Item>
              <Item label="Phone"><a href={`tel:${inq.contactPhone}`} className="text-accent hover:underline">{inq.contactPhone}</a></Item>
            </dl>
          </Card>

          <Card title="Role">
            <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              <Item label="Title">{inq.roleTitle}</Item>
              <Item label="Openings">{inq.openings}</Item>
              <Item label="Department">{departmentLabel(inq.department)}</Item>
              <Item label="Location">{cityLabel(inq.city)}</Item>
              <Item label="Type">{jobTypeLabel(inq.type)}</Item>
              <Item label="Experience">{formatExperience(inq.minYears, inq.maxYears)}</Item>
              <Item label="Salary">{formatSalary(inq.minSalaryLpa, inq.maxSalaryLpa)}</Item>
            </dl>
          </Card>

          <Card title="Job description">
            {inq.jdText ? (
              <p className="whitespace-pre-line text-body text-text-muted">{inq.jdText}</p>
            ) : inq.jdFileUrl ? (
              <a
                href={inq.jdFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-4 py-3 text-body-sm font-medium text-text hover:border-accent"
              >
                <FileText size={18} className="text-accent" aria-hidden /> View uploaded JD
              </a>
            ) : (
              <p className="text-body-sm text-text-subtle">No JD provided.</p>
            )}
            {inq.additionalNotes && (
              <div className="mt-5 border-t border-border pt-5">
                <p className="mb-1.5 text-body-sm font-semibold text-text">Additional notes</p>
                <p className="text-body text-text-muted">{inq.additionalNotes}</p>
              </div>
            )}
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card title="Status">
            <select
              value={inq.status}
              onChange={(e) => setInquiryStatus(inq.id, e.target.value as EmployerInquiryStatus)}
              className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-body-sm text-text focus:border-accent focus:outline-none"
            >
              {EMPLOYER_INQUIRY_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <p className="mt-3 text-caption text-text-subtle">Submitted {formatDateTime(inq.submittedAt)}</p>
          </Card>

          <Card title="Quick action">
            <Link
              href={`/admin/jobs/new?fromInquiry=${inq.id}`}
              className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-lg bg-accent px-4 text-body-sm font-semibold text-accent-fg hover:bg-accent-2"
            >
              <Plus size={16} aria-hidden /> Create job post from this
            </Link>
            <p className="mt-2 text-caption text-text-subtle">Pre-fills the job form with these role details.</p>
          </Card>
        </div>
      </div>
    </>
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
      {href.replace(/^https?:\/\//, "")} <ExternalLink size={13} aria-hidden />
    </a>
  );
}
