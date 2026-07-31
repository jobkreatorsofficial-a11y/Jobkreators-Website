"use client";

import Link from "next/link";
import { Briefcase, Inbox, Building2, Clock } from "lucide-react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { AdminPageHeader, StatusBadge, Table } from "@/components/admin/ui";
import { formatDate } from "@/lib/jobs";

const daysSince = (iso: string) => (Date.now() - new Date(iso).getTime()) / 86_400_000;

export default function AdminDashboard() {
  const { jobs, applications, inquiries } = useAdmin();

  const activeJobs = jobs.filter((j) => j.status === "active").length;
  const appsThisWeek = applications.filter((a) => daysSince(a.submittedAt) <= 7).length;
  const inquiriesThisWeek = inquiries.filter((i) => daysSince(i.submittedAt) <= 7).length;

  const hired = applications.filter((a) => a.status === "hired");
  const avgFill =
    hired.length > 0
      ? Math.round(
          hired.reduce((sum, a) => sum + (new Date(a.updatedAt).getTime() - new Date(a.submittedAt).getTime()) / 86_400_000, 0) /
            hired.length,
        )
      : null;

  const recentApps = [...applications].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)).slice(0, 5);
  const recentInq = [...inquiries].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)).slice(0, 5);

  const metrics = [
    { icon: Briefcase, label: "Active jobs", value: String(activeJobs) },
    { icon: Inbox, label: "Applications this week", value: String(appsThisWeek) },
    { icon: Building2, label: "Employer inquiries this week", value: String(inquiriesThisWeek) },
    { icon: Clock, label: "Avg. time to fill", value: avgFill != null ? `${avgFill} days` : "—" },
  ];

  return (
    <>
      <AdminPageHeader title="Dashboard" description="A snapshot of hiring activity." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-xl border border-border bg-surface p-5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2">
              <m.icon size={18} className="text-accent" aria-hidden />
            </div>
            <p className="text-h2 font-bold text-text">{m.value}</p>
            <p className="mt-0.5 text-body-sm text-text-muted">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Panel title="Recent applications" href="/admin/applications">
          <Table
            head={["Candidate", "Role", "Submitted", "Status"]}
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
        </Panel>

        <Panel title="Recent employer inquiries" href="/admin/employer-inquiries">
          <Table
            head={["Company", "Role", "Submitted", "Status"]}
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

