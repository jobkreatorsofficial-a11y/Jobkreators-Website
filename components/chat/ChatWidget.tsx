"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MessageCircle, X, Send, Bot, UploadCloud, FileText, RotateCcw } from "lucide-react";
import { CITIES, CITY_LABELS } from "@/lib/constants";
import { formatSalary, citiesLabel } from "@/lib/jobs";
import { validateCv, CV_ACCEPT } from "@/lib/forms";
import type { Job, City, Department } from "@/lib/schema";

/**
 * ChatWidget — the (mocked) JOBKREATORS assistant. A useReducer state machine
 * walks the candidate through: greet → role → experience → cities → salary →
 * recommendations, then two exits — Apply (opens the application form prefilled)
 * or "no match" (a mini CV capture). 800ms delays make replies feel natural.
 * Global via app/layout.tsx, but hidden on /admin.
 *
 * TODO Phase 2: swap the scripted responder for a real LLM behind the same steps.
 */

type Step = "intro" | "role" | "experience" | "cities" | "salary" | "recommendations" | "fallback" | "done";
type Msg = { role: "user" | "assistant"; content: string; jobs?: Job[] };
type Ctx = {
  desiredRole?: string;
  yearsOfExperience?: number;
  preferredCities?: City[];
  minSalaryLpa?: number;
};
type State = { open: boolean; step: Step; messages: Msg[]; ctx: Ctx; typing: boolean };

const GREETING =
  "Hi! I'm the JOBKREATORS assistant. I can help you find roles that match your background. Would you like to explore?";

const initialState: State = { open: false, step: "intro", messages: [{ role: "assistant", content: GREETING }], ctx: {}, typing: false };

type Action =
  | { type: "open" }
  | { type: "close" }
  | { type: "reset" }
  | { type: "user"; content: string; ctx?: Ctx }
  | { type: "assistant"; content: string; step: Step; jobs?: Job[] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "open":
      return { ...state, open: true };
    case "close":
      return { ...state, open: false };
    case "reset":
      return { ...initialState, open: true };
    case "user":
      return {
        ...state,
        messages: [...state.messages, { role: "user", content: action.content }],
        ctx: { ...state.ctx, ...action.ctx },
        typing: true,
      };
    case "assistant":
      return {
        ...state,
        messages: [...state.messages, { role: "assistant", content: action.content, jobs: action.jobs }],
        step: action.step,
        typing: false,
      };
  }
}

// --- Scripted recommendation matching (Phase 2: LLM) ---
const ROLE_DEPT: { re: RegExp; dept: Department }[] = [
  { re: /engineer|developer|backend|frontend|devops|software|sde/i, dept: "engineering" },
  { re: /product manager|\bpm\b|product/i, dept: "product" },
  { re: /design|ux|ui/i, dept: "design" },
  { re: /sales|account|business dev|\bbd\b/i, dept: "sales" },
  { re: /marketing|growth|seo|content/i, dept: "marketing" },
  { re: /data|analyst|analytics|scientist/i, dept: "data-analytics" },
  { re: /operations|\bops\b/i, dept: "operations" },
  { re: /finance|account/i, dept: "finance" },
  { re: /\bhr\b|recruit|people/i, dept: "hr" },
  { re: /customer success|support/i, dept: "customer-success" },
];

function recommend(ctx: Ctx, jobs: Job[]): Job[] {
  const dept = ctx.desiredRole ? ROLE_DEPT.find((r) => r.re.test(ctx.desiredRole!))?.dept : undefined;
  const role = ctx.desiredRole?.toLowerCase() ?? "";
  return jobs.map((j) => {
    let score = 0;
    if (dept && j.department === dept) score += 5;
    if (role && j.title.toLowerCase().includes(role)) score += 4;
    if (ctx.preferredCities?.length) {
      // Match if any preferred city overlaps the job's cities, or the job is
      // location-flexible (remote / pan-india / multiple-locations).
      const overlap = j.cities.some((c) => ctx.preferredCities!.includes(c));
      const flexible = j.cities.some((c) => c === "remote" || c === "pan-india" || c === "multiple-locations");
      if (overlap || flexible) score += 3;
    } else score += 1;
    if (ctx.yearsOfExperience != null && ctx.yearsOfExperience >= j.minYears && ctx.yearsOfExperience <= j.maxYears + 2) score += 2;
    if (ctx.minSalaryLpa != null && j.maxSalaryLpa != null && j.maxSalaryLpa >= ctx.minSalaryLpa) score += 1;
    return { j, score };
  })
    .sort((a, b) => b.score - a.score || b.j.postedAt.localeCompare(a.j.postedAt))
    .slice(0, 3)
    .map((x) => x.j);
}

const ROLE_CHIPS = ["Software Engineer", "Product Manager", "Designer", "Sales", "Marketing", "Data Analyst"];
const EXP_CHIPS = [
  { label: "0–2 years", val: 1 },
  { label: "2–5 years", val: 3 },
  { label: "5–10 years", val: 7 },
  { label: "10+ years", val: 12 },
];
const SALARY_CHIPS = [10, 20, 30, 40];

export default function ChatWidget() {
  const pathname = usePathname();
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [roleInput, setRoleInput] = useState("");
  const [cityDraft, setCityDraft] = useState<City[]>([]);
  const [fb, setFb] = useState({ name: "", email: "", phone: "" });
  const [cv, setCv] = useState<File | null>(null);
  const [cvErr, setCvErr] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const timeoutRef = useRef<number | undefined>(undefined);
  const threadRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the newest message.
  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" });
  }, [state.messages, state.typing]);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  // Lazily load active jobs (from the DB) the first time the widget opens — the
  // matcher recommends from these, so admin-created jobs show up immediately.
  useEffect(() => {
    if (!state.open || jobs.length) return;
    let alive = true;
    fetch("/api/jobs")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Job[]) => alive && setJobs(data))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [state.open, jobs.length]);

  // Hidden on the admin portal.
  if (pathname.startsWith("/admin")) return null;

  const say = (content: string, step: Step, jobs?: Job[]) => {
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => dispatch({ type: "assistant", content, step, jobs }), 800);
  };

  const start = () => {
    dispatch({ type: "user", content: "Yes, let's explore" });
    say("Great — what kind of role are you looking for? Type it, or pick one below.", "role");
  };
  const decline = () => {
    dispatch({ type: "user", content: "Just browsing" });
    say("No problem! A team member from Recruitment.Team will follow up whenever you're ready.", "done");
  };
  const sendRole = (role: string) => {
    if (!role.trim()) return;
    setRoleInput("");
    dispatch({ type: "user", content: role, ctx: { desiredRole: role } });
    say("Got it. How many years of experience do you have?", "experience");
  };
  const answerExp = (label: string, val: number) => {
    dispatch({ type: "user", content: label, ctx: { yearsOfExperience: val } });
    say("Where would you like to work? Pick any that apply.", "cities");
  };
  const confirmCities = () => {
    const label = cityDraft.length ? cityDraft.map((c) => CITY_LABELS[c]).join(", ") : "Anywhere";
    dispatch({ type: "user", content: label, ctx: { preferredCities: cityDraft } });
    say("Any salary expectation? This is optional.", "salary");
  };
  const answerSalary = (label: string, val: number | null) => {
    const patch: Ctx = val != null ? { minSalaryLpa: val } : {};
    dispatch({ type: "user", content: label, ctx: patch });
    const recs = recommend({ ...state.ctx, ...patch }, jobs);
    const content = recs.length
      ? "Here are the roles that best fit your background:"
      : "I couldn't find a strong match right now — let me take your CV instead.";
    say(content, recs.length ? "recommendations" : "fallback", recs);
  };
  const noMatch = () => {
    dispatch({ type: "user", content: "None of these match" });
    say("No problem! Let me grab your CV so our team can reach out when a better fit opens up.", "fallback");
  };
  const apply = (job: Job) => {
    const p = new URLSearchParams();
    if (state.ctx.preferredCities?.[0]) p.set("city", state.ctx.preferredCities[0]);
    if (state.ctx.yearsOfExperience != null) p.set("exp", String(state.ctx.yearsOfExperience));
    if (state.ctx.minSalaryLpa != null) p.set("salary", String(state.ctx.minSalaryLpa));
    const qs = p.toString();
    router.push(`/jobs/${job.slug}/apply${qs ? `?${qs}` : ""}`);
    dispatch({ type: "close" });
  };
  const submitFallback = () => {
    const err = validateCv(cv);
    if (err) {
      setCvErr(err);
      return;
    }
    if (!fb.name.trim() || !fb.email.trim() || !fb.phone.trim()) return;
    // TODO Phase 2: replace with API call to POST /api/applications (source unmatched-general)
    if (process.env.NODE_ENV === "development") {
      console.log("[JobApplication submitted (chat, unmatched-general)]", {
        source: "chatbot",
        candidateName: fb.name,
        candidateEmail: fb.email,
        candidatePhone: fb.phone,
        cvFileName: cv!.name,
        context: state.ctx,
      });
    }
    dispatch({ type: "user", content: `Shared my CV (${cv!.name})` });
    say("Thanks! A team member from Recruitment.Team will follow up. Is there anything else I can help with?", "done");
  };

  const disabled = state.typing;

  if (!state.open) {
    return (
      <button
        type="button"
        onClick={() => dispatch({ type: "open" })}
        aria-label="Open the JOBKREATORS assistant"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-fg shadow-[var(--shadow-lg)] transition-transform hover:scale-105"
      >
        <MessageCircle size={24} aria-hidden />
      </button>
    );
  }

  return (
    <div
      role="dialog"
      aria-label="JOBKREATORS assistant"
      className="fixed inset-0 z-50 flex flex-col border-border bg-surface sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[600px] sm:max-h-[calc(100vh-3rem)] sm:w-[380px] sm:rounded-2xl sm:border sm:shadow-[var(--shadow-lg)]"
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent" aria-hidden>
          <Bot size={20} />
        </span>
        <div className="flex-1">
          <p className="text-body-sm font-semibold text-text">JOBKREATORS Assistant</p>
          <p className="text-caption text-text-subtle">Typically replies instantly</p>
        </div>
        <button
          type="button"
          onClick={() => dispatch({ type: "close" })}
          className="flex h-9 w-9 items-center justify-center rounded-full text-text-muted hover:bg-surface-2 hover:text-text"
          aria-label="Close chat"
        >
          <X size={20} aria-hidden />
        </button>
      </div>

      {/* Thread */}
      <div ref={threadRef} className="flex-1 space-y-3 overflow-y-auto bg-bg/40 px-4 py-4">
        {state.messages.map((m, i) => (
          <div key={i}>
            <div className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              {m.role === "assistant" && (
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent" aria-hidden>
                  <Bot size={13} />
                </span>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-body-sm ${
                  m.role === "assistant" ? "bg-surface text-text shadow-[var(--shadow-sm)]" : "bg-accent text-accent-fg"
                }`}
              >
                {m.content}
              </div>
            </div>
            {m.jobs && m.jobs.length > 0 && (
              <div className="ml-8 mt-2 flex flex-col gap-2">
                {m.jobs.map((job) => (
                  <ChatJobCard key={job.id} job={job} onApply={() => apply(job)} />
                ))}
              </div>
            )}
          </div>
        ))}
        {state.typing && (
          <div className="flex gap-2">
            <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent" aria-hidden>
              <Bot size={13} />
            </span>
            <div className="rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-sm)]">
              <span className="flex gap-1">
                {[0, 1, 2].map((d) => (
                  <span key={d} className="h-1.5 w-1.5 animate-pulse rounded-full bg-text-subtle" style={{ animationDelay: `${d * 150}ms` }} />
                ))}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer — contextual input */}
      <div className="border-t border-border px-4 py-3">
        {state.step === "intro" && (
          <Chips>
            <Chip onClick={start} disabled={disabled}>Yes, let&apos;s explore</Chip>
            <Chip onClick={decline} disabled={disabled} variant="ghost">Just browsing</Chip>
          </Chips>
        )}

        {state.step === "role" && (
          <div className="flex flex-col gap-2">
            <Chips>
              {ROLE_CHIPS.map((r) => (
                <Chip key={r} onClick={() => sendRole(r)} disabled={disabled}>{r}</Chip>
              ))}
            </Chips>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendRole(roleInput);
              }}
              className="flex items-center gap-2"
            >
              <input
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                placeholder="Type a role…"
                disabled={disabled}
                className="h-10 flex-1 rounded-full border border-border-strong bg-surface px-4 text-base text-text placeholder:text-text-subtle focus:border-accent focus:outline-none md:text-body-sm"
              />
              <button type="submit" disabled={disabled || !roleInput.trim()} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-fg disabled:opacity-40" aria-label="Send">
                <Send size={16} aria-hidden />
              </button>
            </form>
          </div>
        )}

        {state.step === "experience" && (
          <Chips>
            {EXP_CHIPS.map((e) => (
              <Chip key={e.val} onClick={() => answerExp(e.label, e.val)} disabled={disabled}>{e.label}</Chip>
            ))}
          </Chips>
        )}

        {state.step === "cities" && (
          <div className="flex flex-col gap-2">
            <Chips>
              {CITIES.map((c) => (
                <Chip key={c.value} onClick={() => setCityDraft((d) => (d.includes(c.value) ? d.filter((x) => x !== c.value) : [...d, c.value]))} active={cityDraft.includes(c.value)} disabled={disabled}>
                  {c.label}
                </Chip>
              ))}
            </Chips>
            <button onClick={confirmCities} disabled={disabled} className="h-10 rounded-full bg-accent text-body-sm font-semibold text-accent-fg disabled:opacity-40">
              Continue
            </button>
          </div>
        )}

        {state.step === "salary" && (
          <div className="flex flex-col gap-2">
            <Chips>
              {SALARY_CHIPS.map((s) => (
                <Chip key={s} onClick={() => answerSalary(`₹${s}+ LPA`, s)} disabled={disabled}>₹{s}+ LPA</Chip>
              ))}
            </Chips>
            <button onClick={() => answerSalary("Skip", null)} disabled={disabled} className="text-body-sm font-medium text-text-muted hover:text-accent">
              Skip
            </button>
          </div>
        )}

        {state.step === "recommendations" && (
          <button onClick={noMatch} disabled={disabled} className="w-full rounded-full border border-border-strong bg-surface py-2.5 text-body-sm font-medium text-text hover:border-accent">
            None of these match →
          </button>
        )}

        {state.step === "fallback" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitFallback();
            }}
            className="flex flex-col gap-2"
          >
            <input required value={fb.name} onChange={(e) => setFb({ ...fb, name: e.target.value })} placeholder="Full name" className={fbInput} />
            <input required type="email" value={fb.email} onChange={(e) => setFb({ ...fb, email: e.target.value })} placeholder="Email" className={fbInput} />
            <input required value={fb.phone} onChange={(e) => setFb({ ...fb, phone: e.target.value })} placeholder="Phone" className={fbInput} />
            {cv ? (
              <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-2 text-body-sm">
                <FileText size={16} className="text-accent" aria-hidden />
                <span className="flex-1 truncate">{cv.name}</span>
                <button type="button" onClick={() => setCv(null)} aria-label="Remove CV"><X size={16} /></button>
              </div>
            ) : (
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border-strong bg-surface py-3 text-body-sm text-text-muted hover:border-accent">
                <UploadCloud size={16} className="text-accent" aria-hidden /> Attach CV (PDF/DOC)
                <input type="file" accept={CV_ACCEPT} className="sr-only" onChange={(e) => { setCv(e.target.files?.[0] ?? null); setCvErr(null); }} />
              </label>
            )}
            {cvErr && <p className="text-caption text-danger">{cvErr}</p>}
            <button type="submit" className="h-10 rounded-full bg-accent text-body-sm font-semibold text-accent-fg">
              Submit CV
            </button>
          </form>
        )}

        {state.step === "done" && (
          <button onClick={() => { dispatch({ type: "reset" }); setCityDraft([]); setFb({ name: "", email: "", phone: "" }); setCv(null); }} className="flex w-full items-center justify-center gap-1.5 rounded-full border border-border-strong bg-surface py-2.5 text-body-sm font-medium text-text hover:border-accent">
            <RotateCcw size={14} aria-hidden /> Start over
          </button>
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
        <button onClick={onApply} className="inline-flex h-8 items-center rounded-full bg-accent px-4 text-caption font-semibold text-accent-fg hover:bg-accent-2">
          Apply
        </button>
      </div>
    </div>
  );
}

function Chips({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-1.5">{children}</div>;
}

function Chip({
  children,
  onClick,
  active,
  disabled,
  variant = "solid",
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  variant?: "solid" | "ghost";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`h-8 rounded-full border px-3 text-body-sm font-medium transition-colors disabled:opacity-40 ${
        active
          ? "border-accent bg-accent/10 text-accent"
          : variant === "ghost"
            ? "border-transparent text-text-muted hover:text-text"
            : "border-border-strong bg-surface text-text hover:border-accent"
      }`}
    >
      {children}
    </button>
  );
}

const fbInput =
  "h-10 rounded-lg border border-border bg-surface px-3 text-base text-text placeholder:text-text-subtle focus:border-accent focus:outline-none md:text-body-sm";
