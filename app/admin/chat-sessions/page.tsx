"use client";

import { useMemo, useState } from "react";
import { ChevronDown, User, Bot } from "lucide-react";
import { useChatSessions } from "@/lib/admin/hooks";
import { AdminPageHeader, StatusBadge, ErrorState, LoadingState, formatDateTime } from "@/components/admin/ui";
import type { ChatSession } from "@/lib/schema";

const STATUSES = ["all", "active", "cv-submitted", "closed"] as const;

export default function AdminChatSessionsPage() {
  const sessionsQuery = useChatSessions();
  const chatSessions = useMemo(() => sessionsQuery.data ?? [], [sessionsQuery.data]);
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      chatSessions
        .filter((s) => (status === "all" ? true : s.status === status))
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [chatSessions, status],
  );

  return (
    <>
      <AdminPageHeader title="Chat sessions" description={sessionsQuery.data ? `${chatSessions.length} total` : undefined} />

      <div className="mb-4 inline-flex flex-wrap rounded-lg border border-border bg-surface p-1">
        {STATUSES.map((s) => (
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

      {sessionsQuery.isLoading ? (
        <LoadingState rows={4} />
      ) : sessionsQuery.isError ? (
        <ErrorState message={(sessionsQuery.error as Error)?.message} onRetry={() => sessionsQuery.refetch()} />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.length === 0 && (
            <p className="rounded-xl border border-border bg-surface px-5 py-10 text-center text-body-sm text-text-subtle">
              No sessions match.
            </p>
          )}
          {filtered.map((s) => {
            const open = openId === s.id;
            const who = s.candidateContext.name || s.candidateContext.email || "Anonymous visitor";
            return (
              <div key={s.id} className="overflow-hidden rounded-xl border border-border bg-surface">
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : s.id)}
                  aria-expanded={open}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-surface-2/50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-body-sm font-medium text-text">{who}</p>
                    <p className="text-caption text-text-subtle">
                      {s.messages.length} messages · last active {formatDateTime(s.updatedAt)}
                    </p>
                  </div>
                  <StatusBadge status={s.status} />
                  <ChevronDown size={18} className={`shrink-0 text-text-subtle transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
                </button>

                {open && <Conversation session={s} />}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

function Conversation({ session }: { session: ChatSession }) {
  const ctx = session.candidateContext;
  const ctxEntries = [
    ctx.desiredRole && ["Desired role", ctx.desiredRole],
    ctx.yearsOfExperience != null && ["Experience", `${ctx.yearsOfExperience} yrs`],
    ctx.preferredCities?.length && ["Cities", ctx.preferredCities.join(", ")],
    ctx.email && ["Email", ctx.email],
  ].filter(Boolean) as [string, string][];

  return (
    <div className="border-t border-border bg-surface-2/40 p-5">
      {ctxEntries.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-x-6 gap-y-1 text-caption text-text-muted">
          {ctxEntries.map(([k, v]) => (
            <span key={k}>
              <span className="text-text-subtle">{k}:</span> <span className="font-medium text-text">{v}</span>
            </span>
          ))}
        </div>
      )}
      <ol className="flex flex-col gap-3">
        {session.messages.map((m) => (
          <li key={m.id} className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                m.role === "assistant" ? "bg-accent/10 text-accent" : "bg-surface-3 text-text-muted"
              }`}
              aria-hidden
            >
              {m.role === "assistant" ? <Bot size={15} /> : <User size={15} />}
            </span>
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-body-sm ${
                m.role === "assistant" ? "bg-surface text-text" : "bg-accent text-accent-fg"
              }`}
            >
              {m.content}
              {m.jobRecommendations && m.jobRecommendations.length > 0 && (
                <span className="mt-1 block text-caption opacity-80">
                  · recommended {m.jobRecommendations.length} role{m.jobRecommendations.length === 1 ? "" : "s"}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
