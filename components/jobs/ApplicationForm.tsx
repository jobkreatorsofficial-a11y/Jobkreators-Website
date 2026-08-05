"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, UploadCloud, FileText, X, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import type { Job, JobApplication, City } from "@/lib/schema";
import { CITIES } from "@/lib/constants";
import {
  applicationFormSchema,
  type ApplicationFormInput,
  type ApplicationFormValues,
  validateCv,
  CV_ACCEPT,
} from "@/lib/forms";
import { SITE } from "@/lib/data";

const STEPS = ["Personal", "Experience", "CV & Cover", "Review"] as const;

const STEP_FIELDS: (keyof ApplicationFormInput)[][] = [
  ["candidateName", "candidateEmail", "candidatePhone", "candidateCity"],
  [
    "yearsOfExperience",
    "currentCompany",
    "currentRole",
    "currentSalaryLpa",
    "expectedSalaryLpa",
    "noticePeriodDays",
    "linkedinUrl",
    "portfolioUrl",
  ],
  ["coverMessage"],
  [],
];

const inputCls =
  "h-11 w-full rounded-xl border border-border bg-surface px-4 text-base text-text placeholder:text-text-subtle focus:border-accent focus:outline-none md:text-body-sm";

/**
 * ApplicationForm — 4-step stepper (Personal → Experience → CV & Cover → Review).
 * Used for a specific role (`job` set, source "direct") and for the general
 * /submit-cv flow (`job` null, source "unmatched-general"). Zod validates text
 * inputs per step; the CV file is validated imperatively. On submit it maps to the
 * `JobApplication` DB shape and logs it (Phase 2 replaces the log with an API call).
 */
export default function ApplicationForm({
  job,
  prefill,
}: {
  job: Job | null;
  /** Optional prefill (e.g. from the chatbot): city value, years, expected salary. */
  prefill?: { city?: string; exp?: string; salary?: string };
}) {
  const [step, setStep] = useState(0);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvError, setCvError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<ApplicationFormInput, unknown, ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    mode: "onTouched",
    defaultValues: {
      candidateCity: prefill?.city ?? "",
      yearsOfExperience: prefill?.exp ?? "",
      expectedSalaryLpa: prefill?.salary ?? "",
    } as Partial<ApplicationFormInput>,
  });

  const setCv = (file: File | null) => {
    setCvFile(file);
    setCvError(file ? validateCv(file) : null);
  };

  const goNext = async () => {
    if (step === 2) {
      const err = validateCv(cvFile);
      setCvError(err);
      if (err) return;
    }
    const fields = STEP_FIELDS[step];
    const ok = fields.length === 0 ? true : await trigger(fields);
    if (ok) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const onSubmit = (values: ApplicationFormValues) => {
    const err = validateCv(cvFile);
    if (err) {
      setCvError(err);
      setStep(2);
      return;
    }
    const payload: JobApplication = {
      id: crypto.randomUUID(),
      jobId: job?.id ?? null,
      jobSlug: job?.slug ?? null,
      jobTitle: job?.title ?? null,
      jobCompany: job?.company ?? null,
      candidateName: values.candidateName,
      candidateEmail: values.candidateEmail,
      candidatePhone: values.candidatePhone,
      candidateCity: values.candidateCity as City,
      currentCompany: values.currentCompany?.trim() || null,
      currentRole: values.currentRole?.trim() || null,
      yearsOfExperience: values.yearsOfExperience,
      currentSalaryLpa: values.currentSalaryLpa ?? null,
      expectedSalaryLpa: values.expectedSalaryLpa ?? null,
      noticePeriodDays: values.noticePeriodDays ?? null,
      linkedinUrl: values.linkedinUrl?.trim() || null,
      portfolioUrl: values.portfolioUrl?.trim() || null,
      // Phase 2: the file is uploaded to Cloudinary and this becomes the real URL.
      cvFileUrl: `mock://cloudinary/pending/${encodeURIComponent(cvFile!.name)}`,
      cvFileName: cvFile!.name,
      coverMessage: values.coverMessage?.trim() || null,
      internalNotes: null, // admin-only; never set from the public form
      status: "submitted",
      source: job ? "direct" : "unmatched-general",
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    // TODO Phase 2: replace with API call to POST /api/applications
    if (process.env.NODE_ENV === "development") {
      console.log("[JobApplication submitted]", payload);
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-border bg-surface-2 px-6 py-14 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
          <CheckCircle2 size={32} className="text-accent" aria-hidden />
        </div>
        <h2 className="font-display text-h2 md:text-h2-md">Application submitted!</h2>
        <p className="mx-auto mt-3 max-w-md text-body text-text-muted">
          Thanks{job ? ` for applying to ${job.title} at ${job.company}` : ""}. Our team reviews every
          application and will reach out from{" "}
          <span className="font-medium text-accent">{SITE.email}</span> within 48 hours.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/jobs"
            className="inline-flex h-11 items-center rounded-full bg-accent px-6 text-body-sm font-semibold text-accent-fg hover:bg-accent-2"
          >
            Browse more roles
          </Link>
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-full border border-border-strong bg-surface px-6 text-body-sm font-medium text-text hover:border-accent"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  // Snapshot for the review step (reached via a re-render, so this is current).
  const values = getValues();

  return (
    <div className="mx-auto max-w-2xl">
      {/* Stepper */}
      <ol className="mb-8 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-body-sm font-semibold transition-colors ${
                i < step
                  ? "bg-accent text-accent-fg"
                  : i === step
                    ? "border-2 border-accent text-accent"
                    : "border border-border-strong text-text-subtle"
              }`}
            >
              {i < step ? <Check size={16} aria-hidden /> : i + 1}
            </span>
            <span className={`hidden text-body-sm sm:block ${i === step ? "font-medium text-text" : "text-text-subtle"}`}>
              {label}
            </span>
            {i < STEPS.length - 1 && <span className="h-px flex-1 bg-border" aria-hidden />}
          </li>
        ))}
      </ol>

      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") e.preventDefault();
        }}
        className="rounded-2xl border border-border bg-surface-2 p-6 md:p-8"
      >
        {step === 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Full name" required error={errors.candidateName?.message} className="sm:col-span-2">
              <input className={inputCls} placeholder="Rahul Sharma" {...register("candidateName")} />
            </Field>
            <Field label="Email" required error={errors.candidateEmail?.message}>
              <input type="email" className={inputCls} placeholder="rahul@email.com" {...register("candidateEmail")} />
            </Field>
            <Field label="Phone" required error={errors.candidatePhone?.message}>
              <input className={inputCls} placeholder="+91 98765 43210" {...register("candidatePhone")} />
            </Field>
            <Field label="Current city" required error={errors.candidateCity?.message} className="sm:col-span-2">
              <select className={inputCls} {...register("candidateCity")}>
                <option value="" disabled>
                  Select your city
                </option>
                {CITIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        )}

        {step === 1 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Current company" error={errors.currentCompany?.message}>
              <input className={inputCls} placeholder="Flipkart" {...register("currentCompany")} />
            </Field>
            <Field label="Current role" error={errors.currentRole?.message}>
              <input className={inputCls} placeholder="Frontend Engineer" {...register("currentRole")} />
            </Field>
            <Field label="Years of experience" required error={errors.yearsOfExperience?.message}>
              <input type="number" min={0} className={inputCls} placeholder="5" {...register("yearsOfExperience")} />
            </Field>
            <Field label="Notice period (days)" error={errors.noticePeriodDays?.message}>
              <input type="number" min={0} className={inputCls} placeholder="60" {...register("noticePeriodDays")} />
            </Field>
            <Field label="Current salary (₹ LPA)" error={errors.currentSalaryLpa?.message}>
              <input type="number" min={0} className={inputCls} placeholder="24" {...register("currentSalaryLpa")} />
            </Field>
            <Field label="Expected salary (₹ LPA)" error={errors.expectedSalaryLpa?.message}>
              <input type="number" min={0} className={inputCls} placeholder="36" {...register("expectedSalaryLpa")} />
            </Field>
            <Field label="LinkedIn URL" error={errors.linkedinUrl?.message}>
              <input className={inputCls} placeholder="https://linkedin.com/in/…" {...register("linkedinUrl")} />
            </Field>
            <Field label="Portfolio / GitHub URL" error={errors.portfolioUrl?.message}>
              <input className={inputCls} placeholder="https://…" {...register("portfolioUrl")} />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-5">
            <div>
              <span className="mb-2 block text-body-sm font-semibold text-text">
                CV / Resume <span className="text-danger">*</span>
              </span>
              {cvFile ? (
                <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4">
                  <FileText size={22} className="shrink-0 text-accent" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-body-sm font-medium text-text">{cvFile.name}</p>
                    <p className="text-caption text-text-subtle">{(cvFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCv(null)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-text-muted hover:bg-surface-2 hover:text-danger"
                    aria-label="Remove CV"
                  >
                    <X size={18} aria-hidden />
                  </button>
                </div>
              ) : (
                <label
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    if (e.dataTransfer.files?.[0]) setCv(e.dataTransfer.files[0]);
                  }}
                  className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
                    dragging ? "border-accent bg-accent/5" : "border-border-strong bg-surface hover:border-accent"
                  }`}
                >
                  <UploadCloud size={28} className="text-accent" aria-hidden />
                  <span className="text-body-sm font-medium text-text">
                    Drag &amp; drop your CV, or <span className="text-accent">browse</span>
                  </span>
                  <span className="text-caption text-text-subtle">PDF, DOC or DOCX · up to 5MB</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={CV_ACCEPT}
                    className="sr-only"
                    onChange={(e) => setCv(e.target.files?.[0] ?? null)}
                  />
                </label>
              )}
              {cvError && <p className="mt-1.5 text-caption text-danger">{cvError}</p>}
            </div>

            <Field label="Cover message" error={errors.coverMessage?.message}>
              <textarea
                rows={5}
                className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-base text-text placeholder:text-text-subtle focus:border-accent focus:outline-none md:text-body-sm"
                placeholder="Anything you'd like us to know? (optional)"
                {...register("coverMessage")}
              />
            </Field>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="mb-4 text-h4 font-semibold text-text">Review your application</h3>
            <dl className="divide-y divide-border rounded-xl border border-border bg-surface">
              <Row label="Applying for">{job ? `${job.title} · ${job.company}` : "General application"}</Row>
              <Row label="Name">{values.candidateName}</Row>
              <Row label="Email">{values.candidateEmail}</Row>
              <Row label="Phone">{values.candidatePhone}</Row>
              <Row label="City">{CITIES.find((c) => c.value === values.candidateCity)?.label ?? "—"}</Row>
              <Row label="Experience">
                {values.yearsOfExperience ? `${String(values.yearsOfExperience)} yrs` : "—"}
                {values.currentRole ? ` · ${values.currentRole}` : ""}
                {values.currentCompany ? ` at ${values.currentCompany}` : ""}
              </Row>
              <Row label="Expected salary">
                {values.expectedSalaryLpa ? `₹${String(values.expectedSalaryLpa)} LPA` : "—"}
              </Row>
              <Row label="CV">{cvFile?.name ?? "—"}</Row>
            </dl>
            <p className="mt-4 text-caption text-text-subtle">
              By submitting, you agree to be contacted by JOBKREATORS about relevant roles. We never charge candidates.
            </p>
          </div>
        )}

        {/* Nav */}
        <div className="mt-8 flex items-center justify-between gap-3">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(s - 1, 0))}
              className="inline-flex h-11 items-center gap-1.5 rounded-full border border-border-strong bg-surface px-5 text-body-sm font-medium text-text hover:border-accent"
            >
              <ArrowLeft size={16} aria-hidden /> Back
            </button>
          ) : (
            <span />
          )}
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              className="inline-flex h-11 items-center gap-1.5 rounded-full bg-accent px-6 text-body-sm font-semibold text-accent-fg hover:bg-accent-2"
            >
              Continue <ArrowRight size={16} aria-hidden />
            </button>
          ) : (
            <button
              type="submit"
              className="inline-flex h-11 items-center gap-1.5 rounded-full bg-accent px-6 text-body-sm font-semibold text-accent-fg hover:bg-accent-2"
            >
              Submit application
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="mb-2 block text-body-sm font-semibold text-text">
        {label} {required && <span className="text-danger">*</span>}
      </span>
      {children}
      {error && <span className="mt-1.5 block text-caption text-danger">{error}</span>}
    </label>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3">
      <dt className="text-body-sm text-text-subtle">{label}</dt>
      <dd className="text-right text-body-sm font-medium text-text">{children || "—"}</dd>
    </div>
  );
}
