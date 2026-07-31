"use client";

import { useMemo, useState } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { AdminPageHeader, StatusBadge, Table } from "@/components/admin/ui";
import { EMPLOYER_INQUIRY_STATUSES } from "@/lib/constants";
import { formatDate } from "@/lib/jobs";
import type { EmployerInquiryStatus } from "@/lib/schema";

export default function AdminEmployerInquiriesPage() {
  const { inquiries } = useAdmin();
  const [status, setStatus] = useState<EmployerInquiryStatus | "all">("all");

  const filtered = useMemo(
    () =>
      inquiries
        .filter((i) => (status === "all" ? true : i.status === status))
        .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)),
    [inquiries, status],
  );

  return (
    <>
      <AdminPageHeader title="Employer inquiries" description={`${inquiries.length} total`} />

      <div className="mb-4 inline-flex flex-wrap rounded-lg border border-border bg-surface p-1">
        {(["all", ...EMPLOYER_INQUIRY_STATUSES.map((s) => s.value)] as (EmployerInquiryStatus | "all")[]).map((s) => (
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

      <div className="rounded-xl border border-border bg-surface">
        <Table
          head={["Company", "Contact", "Role", "Openings", "Submitted", "Status"]}
          emptyText="No inquiries match."
          rows={filtered.map((i) => ({
            key: i.id,
            href: `/admin/employer-inquiries/${i.id}`,
            cells: [
              <span key="c" className="font-medium text-text">{i.companyName}</span>,
              `${i.contactPerson} · ${i.designation}`,
              i.roleTitle,
              String(i.openings),
              formatDate(i.submittedAt),
              <StatusBadge key="s" status={i.status} />,
            ],
          }))}
        />
      </div>
    </>
  );
}
