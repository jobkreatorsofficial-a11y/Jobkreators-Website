import { Mail, Users, Bell, ShieldCheck } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/ui";

// Placeholder — real settings (email templates, roles, notifications) land in
// Phase 2+ once auth and persistence exist.
const PLANNED = [
  { icon: Mail, title: "Email templates", desc: "Customise candidate + employer notification emails." },
  { icon: Users, title: "Team & roles", desc: "Invite recruiters and manage admin permissions." },
  { icon: Bell, title: "Notifications", desc: "Choose what pings you on new applications and inquiries." },
  { icon: ShieldCheck, title: "Security", desc: "SSO, audit log and data-retention controls." },
];

export default function AdminSettingsPage() {
  return (
    <>
      <AdminPageHeader title="Settings" description="Coming in a later phase." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PLANNED.map((p) => (
          <div key={p.title} className="flex items-start gap-4 rounded-xl border border-border bg-surface p-5 opacity-80">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-2">
              <p.icon size={20} className="text-text-subtle" aria-hidden />
            </span>
            <div>
              <p className="text-body font-semibold text-text">{p.title}</p>
              <p className="mt-1 text-body-sm text-text-muted">{p.desc}</p>
              <span className="mt-2 inline-block rounded-full bg-surface-3 px-2 py-0.5 text-caption text-text-subtle">
                Phase 2+
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
