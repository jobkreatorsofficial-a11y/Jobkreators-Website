"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MessageCircle, X, Send, Sparkles, Bot, UploadCloud, FileText } from "lucide-react";
import Logo from "@/components/Logo";
import { CITIES } from "@/lib/constants";
import { formatSalary, citiesLabel } from "@/lib/jobs";
import { validateCv, CV_ACCEPT } from "@/lib/forms";
import type { Job } from "@/lib/schema";
import type { ChatStage, CollectedContext } from "@/lib/gemini/prompt";

/**
 * ChatWidget — the JOBKREATORS assistant, powered by Gemini 2.0 Flash via
 * /api/chat/message. Free-text conversation; the API returns reply text, a stage,
 * collected candidate context, tap-able suggested actions, and server-matched job
 * cards. On "closing" with no match it captures a CV. Hidden on /admin.
 */

const GREETING = "Hi! I'm the JOBKREATORS assistant. What kind of role are you looking for?";
const POPULAR_CITIES = ["delhi-ncr", "bangalore", "mumbai", "hyderabad", "remote"] as const;

type Msg = { role: "user" | "assistant"; content: string; jobs?: Job[]; actions?: string[] };

export default function ChatWidget() {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [messages, setMessages] = useState<Msg[]>([{ role: "assistant", content: GREETING, actions: [] }]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [stage, setStage] = useState<ChatStage>("greeting");
  const [context, setContext] = useState<CollectedContext>({});
  const [cvMode, setCvMode] = useState(false);
  const [unread, setUnread] = useState(false);

  const threadRef = useRef<HTMLDivElement>(null);

  // The widget lives in the layout, so messages already survive close/reopen and
  // client-side navigation without extra persistence.
  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending, cvMode]);

  if (pathname.startsWith("/admin")) return null;

  async function send(text: string) {
    const msg = text.trim();
    if (!msg || sending) return;
    setInput("");
    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    setMessages((m) => [...m, { role: "user", content: msg }]);
    setSending(true);
    try {
      const res = await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: msg, history }),
      });
      if (res.status === 429) {
        setMessages((m) => [...m, { role: "assistant", content: "Message limit reached for now — please continue later." }]);
        return;
      }
      const data = await res.json();
      setStage(data.stage ?? stage);
      setContext((c) => ({ ...c, ...(data.collected_context ?? {}) }));
      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.reply_text ?? "…", jobs: data.jobs ?? [], actions: data.suggested_actions ?? [] },
      ]);
      if (data.stage === "closing") setCvMode(true);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Something went wrong. You can email us at Recruitment.Team@jobkreators.com." },
      ]);
    } finally {
      setSending(false);
    }
  }

  function openWidget() {
    setOpen(true);
    setUnread(false);
  }

  function applyToJob(job: Job) {
    const p = new URLSearchParams();
    if (context.name) p.set("name", context.name);
    if (context.email) p.set("email", context.email);
    if (context.phone) p.set("phone", context.phone);
    if (context.currentRole) p.set("role", context.currentRole);
    if (context.currentCompany) p.set("company", context.currentCompany);
    if (context.yearsOfExperience != null) p.set("exp", String(context.yearsOfExperience));
    if (context.preferredCities?.[0]) p.set("city", context.preferredCities[0]);
    if (context.minSalaryLpa != null) p.set("salary", String(context.minSalaryLpa));
    const qs = p.toString();
    router.push(`/jobs/${job.slug}/apply${qs ? `?${qs}` : ""}`);
    setOpen(false);
  }

  // City typeahead: show up to 8 matching cities when the user is typing a city name.
  const cityMatches =
    input.trim().length >= 2
      ? CITIES.filter((c) => c.label.toLowerCase().includes(input.trim().toLowerCase())).slice(0, 8)
      : [];

  // Show popular-city shortcuts when the assistant just asked about location.
  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant")?.content.toLowerCase() ?? "";
  const askedLocation =
    stage === "discovering" &&
    !context.preferredCities?.length &&
    /where|work|locat|city|based/.test(lastAssistant);

  if (!open) {
    return (
      <button
        type="button"
        onClick={openWidget}
        aria-label="Open the JOBKREATORS assistant"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-fg shadow-[var(--shadow-lg)] transition-transform hover:scale-105 motion-reduce:transition-none"
      >
        <MessageCircle size={24} aria-hidden />
        {unread && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-bright px-1 text-[10px] font-bold text-[#0a1520]">
            1
          </span>
        )}
      </button>
    );
  }

  return (
    <div
      role="dialog"
      aria-label="JOBKREATORS assistant"
      className="fixed inset-0 z-50 flex flex-col bg-surface animate-[chat-in_180ms_cubic-bezier(0.34,1.3,0.64,1)] motion-reduce:animate-none sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[600px] sm:max-h-[80vh] sm:w-[380px] sm:rounded-2xl sm:border sm:border-border sm:shadow-[var(--shadow-lg)]"
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
        <Logo variant="mark" size={22} />
        <div className="flex-1">
          <p className="flex items-center gap-1.5 text-body-sm font-semibold text-text">
            JOBKREATORS Assistant
            <span className="inline-flex items-center gap-0.5 rounded-full bg-accent/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent">
              <Sparkles size={9} aria-hidden /> AI
            </span>
          </p>
          <p className="text-caption text-text-subtle">Typically replies instantly</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-text-muted hover:bg-surface-2 hover:text-text"
          aria-label="Close chat"
        >
          <X size={20} aria-hidden />
        </button>
      </div>

      {/* Thread */}
      <div ref={threadRef} className="flex-1 space-y-3 overflow-y-auto bg-bg/40 px-4 py-4">
        {messages.map((m, i) => (
          <div key={i}>
            <div className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              {m.role === "assistant" && (
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent" aria-hidden>
                  <Bot size={13} />
                </span>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-body-sm ${
                  m.role === "assistant" ? "bg-surface-2 text-text shadow-[var(--shadow-sm)]" : "bg-accent text-accent-fg"
                }`}
              >
                {m.content}
              </div>
            </div>

            {m.jobs && m.jobs.length > 0 && (
              <div className="ml-8 mt-2 flex flex-col gap-2">
                {m.jobs.map((job) => (
                  <ChatJobCard key={job.id} job={job} onApply={() => applyToJob(job)} />
                ))}
              </div>
            )}

            {m.role === "assistant" && i === messages.length - 1 && m.actions && m.actions.length > 0 && !cvMode && (
              <div className="ml-8 mt-2 flex flex-wrap gap-1.5">
                {m.actions.map((a) => (
                  <Chip key={a} onClick={() => send(a)}>
                    {a}
                  </Chip>
                ))}
              </div>
            )}
          </div>
        ))}

        {sending && (
          <div className="flex gap-2">
            <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent" aria-hidden>
              <Bot size={13} />
            </span>
            <div className="rounded-2xl bg-surface-2 px-4 py-2.5 shadow-[var(--shadow-sm)]" aria-label="Assistant is typing">
              <span className="flex gap-1">
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className="h-1.5 w-1.5 animate-pulse rounded-full bg-text-subtle motion-reduce:animate-none"
                    style={{ animationDelay: `${d * 150}ms` }}
                  />
                ))}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border px-4 py-3">
        {cvMode ? (
          <CvForm context={context} onDone={(text) => { setCvMode(false); setMessages((m) => [...m, { role: "assistant", content: text }]); }} />
        ) : (
          <>
            {/* Popular-city shortcuts when the assistant asks about location */}
            {askedLocation && (
              <div className="mb-2 flex flex-wrap gap-1.5">
                {POPULAR_CITIES.map((v) => {
                  const label = CITIES.find((c) => c.value === v)?.label ?? v;
                  return (
                    <Chip key={v} onClick={() => send(label)}>
                      {label}
                    </Chip>
                  );
                })}
              </div>
            )}

            {/* City typeahead as the user types a city name */}
            {cityMatches.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1.5">
                {cityMatches.map((c) => (
                  <Chip key={c.value} onClick={() => send(c.label)}>
                    {c.label}
                  </Chip>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message…"
                disabled={sending}
                className="h-10 flex-1 rounded-full border border-border-strong bg-surface px-4 text-base text-text placeholder:text-text-subtle focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-body-sm"
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-fg disabled:opacity-40"
                aria-label="Send message"
              >
                <Send size={16} aria-hidden />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function ChatJobCard({ job, onApply }: { job: Job; onApply: () => void }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-3">
      <p className="text-body-sm font-semibold text-text">{job.title}</p>
      <p className="text-caption text-text-muted">
        {job.company} · {citiesLabel(job.cities)}
      </p>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-caption font-medium text-accent">{formatSalary(job.minSalaryLpa, job.maxSalaryLpa)}</span>
        <button
          onClick={onApply}
          className="inline-flex h-8 items-center rounded-full bg-accent px-4 text-caption font-semibold text-accent-fg hover:bg-accent-2"
        >
          Apply for this role
        </button>
      </div>
    </div>
  );
}

function CvForm({
  context,
  onDone,
}: {
  context: CollectedContext;
  onDone: (text: string) => void;
}) {
  const [fb, setFb] = useState({
    name: context.name ?? "",
    email: context.email ?? "",
    phone: context.phone ?? "",
  });
  const [cv, setCv] = useState<File | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const cvErr = validateCv(cv);
    if (cvErr) return setErr(cvErr);
    if (!fb.name.trim() || !fb.email.trim() || !fb.phone.trim()) return setErr("Please fill in all fields.");
    setBusy(true);
    setErr(null);
    try {
      const fd = new FormData();
      fd.set("jobId", "");
      fd.set("candidateName", fb.name);
      fd.set("candidateEmail", fb.email);
      fd.set("candidatePhone", fb.phone);
      fd.set("candidateCity", context.preferredCities?.[0] ?? "pan-india");
      fd.set("currentRole", context.currentRole ?? "");
      fd.set("currentCompany", context.currentCompany ?? "");
      fd.set("yearsOfExperience", context.yearsOfExperience != null ? String(context.yearsOfExperience) : "0");
      fd.set("expectedSalaryLpa", context.minSalaryLpa != null ? String(context.minSalaryLpa) : "");
      fd.set(
        "coverMessage",
        `Via chatbot. Interested in: ${context.desiredRole ?? "open to roles"}. Preferred: ${(context.preferredCities ?? []).join(", ") || "flexible"}.`,
      );
      fd.set("source", "chatbot");
      fd.set("cvFile", cv!);
      const res = await fetch("/api/applications", { method: "POST", body: fd });
      if (res.ok) {
        onDone("Thanks! A team member from Recruitment.Team will reach out when a role fits.");
      } else if (res.status === 413) setErr("Your CV is too large (max 5MB).");
      else if (res.status === 415) setErr("Upload a PDF, DOC or DOCX.");
      else setErr("Couldn't submit. Please try again.");
    } catch {
      setErr("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <input required value={fb.name} onChange={(e) => setFb({ ...fb, name: e.target.value })} placeholder="Full name" className={cvInput} />
      <input required type="email" value={fb.email} onChange={(e) => setFb({ ...fb, email: e.target.value })} placeholder="Email" className={cvInput} />
      <input required value={fb.phone} onChange={(e) => setFb({ ...fb, phone: e.target.value })} placeholder="Phone" className={cvInput} />
      {cv ? (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-2 text-body-sm">
          <FileText size={16} className="text-accent" aria-hidden />
          <span className="flex-1 truncate">{cv.name}</span>
          <button type="button" onClick={() => setCv(null)} aria-label="Remove CV">
            <X size={16} />
          </button>
        </div>
      ) : (
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border-strong bg-surface py-3 text-body-sm text-text-muted hover:border-accent">
          <UploadCloud size={16} className="text-accent" aria-hidden /> Attach CV (PDF/DOC)
          <input type="file" accept={CV_ACCEPT} className="sr-only" onChange={(e) => { setCv(e.target.files?.[0] ?? null); setErr(null); }} />
        </label>
      )}
      {err && <p className="text-caption text-danger">{err}</p>}
      <button type="submit" disabled={busy} className="h-10 rounded-full bg-accent text-body-sm font-semibold text-accent-fg disabled:opacity-50">
        {busy ? "Submitting…" : "Submit CV anyway"}
      </button>
    </form>
  );
}

function Chip({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-8 rounded-full border border-border-strong bg-surface px-3 text-body-sm font-medium text-text transition-colors hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {children}
    </button>
  );
}

const cvInput =
  "h-10 rounded-lg border border-border bg-surface px-3 text-base text-text placeholder:text-text-subtle focus:border-accent focus:outline-none md:text-body-sm";
