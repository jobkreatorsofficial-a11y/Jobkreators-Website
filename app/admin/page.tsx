"use client";

import Link from "next/link";
import { Briefcase, Inbox, Building2, Clock } from "lucide-react";
import { useStats, useApplications, useInquiries } from "@/lib/admin/hooks";
import { AdminPageHeader, StatusBadge, Table, ErrorState } from "@/components/admin/ui";
import { formatDate } from "@/lib/jobs";

export default function AdminDashboard() {
  const stats = useStats();
  const apps = useApplications();
  const inq = useInquiries();

  const recentApps = [...(apps.data ?? [])].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)).slice(0, 5);
  const recentInq = [...(inq.data ?? [])].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)).slice(0, 5);

  const s = stats.data;
  const metrics = [
    { icon: Briefcase, label: "Active jobs", value: s ? String(s.activeJobs) : "—" },
    { icon: Inbox, label: "Applications this week", value: s ? String(s.appsThisWeek) : "—" },
    { icon: Building2, label: "Employer inquiries this week", value: s ? String(s.inquiriesThisWeek) : "—" },
    {
      icon: Clock,
      label: "Avg. time to fill",
      value: s?.avgTimeToFillDays != null ? `${s.avgTimeToFillDays} days` : "—",
      tooltip: s && s.avgTimeToFillDays == null ? "No hires yet" : undefined,
    },
  ];

  return (
    <>
      <AdminPageHeader title="Dashboard" description="A snapshot of hiring activity." />

      {stats.isError ? (
        <ErrorState message={(stats.error as Error)?.message} onRetry={() => stats.refetch()} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-xl border border-border bg-surface p-5">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2">
                <m.icon size={18} className="text-accent" aria-hidden />
              </div>
              <p className={`text-h2 font-bold text-text ${stats.isLoading ? "animate-pulse" : ""}`} title={m.tooltip}>
                {m.value}
              </p>
              <p className="mt-0.5 text-body-sm text-text-muted">{m.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Panel title="Recent applications" href="/admin/applications">
          {apps.isError ? (
            <div className="p-5"><ErrorState message={(apps.error as Error)?.message} onRetry={() => apps.refetch()} /></div>
          ) : (
            <Table
              head={["Candidate", "Role", "Submitted", "Status"]}
              emptyText={apps.isLoading ? "Loading…" : "No applications yet."}
              rows={recentApps.map((a) => ({
                key: a.id,
                href: `/admin/applications/${a.id}`,
                cells: [
                  <span key="c" className="font-medium text-text">{a.candidateName}</span>,
                  a.jobTitle ? `${a.jobTitle} · ${a.jobCompany}` : "General application",
                  formatDate(a.submittedAt),
                  <StatusBadge key="s" status={a.status} />,
                ],
              }))}
            />
          )}
        </Panel>

        <Panel title="Recent employer inquiries" href="/admin/employer-inquiries">
          {inq.isError ? (
            <div className="p-5"><ErrorState message={(inq.error as Error)?.message} onRetry={() => inq.refetch()} /></div>
          ) : (
            <Table
              head={["Company", "Role", "Submitted", "Status"]}
              emptyText={inq.isLoading ? "Loading…" : "No inquiries yet."}
              rows={recentInq.map((i) => ({
                key: i.id,
                href: `/admin/employer-inquiries/${i.id}`,
                cells: [
                  <span key="c" className="font-medium text-text">{i.companyName}</span>,
                  i.roleTitle,
                  formatDate(i.submittedAt),
                  <StatusBadge key="s" status={i.status} />,
                ],
              }))}
            />
          )}
        </Panel>
      </div>
    </>
  );
}

function Panel({ title, href, children }: { title: string; href: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <h2 className="text-body font-semibold text-text">{title}</h2>
        <Link href={href} className="text-body-sm font-medium text-accent hover:text-accent-2">
          View all
        </Link>
      </div>
      {children}
    </section>
  );
}
