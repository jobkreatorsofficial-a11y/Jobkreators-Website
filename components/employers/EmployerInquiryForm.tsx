"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, UploadCloud, FileText, X, ArrowLeft, ArrowRight, CheckCircle2, Lock } from "lucide-react";
import type { EmployerInquiry, Department, City, JobType } from "@/lib/schema";
import { DEPARTMENTS, CITIES, JOB_TYPES } from "@/lib/constants";
import {
  employerInquiryFormSchema,
  type EmployerFormInput,
  type EmployerFormValues,
  validateJd,
  type JdMode,
  CV_ACCEPT,
} from "@/lib/forms";

const STEPS = ["Company", "Role", "JD & notes", "Review"] as const;

const STEP_FIELDS: (keyof EmployerFormInput)[][] = [
  ["companyName", "companyWebsite", "contactPerson", "contactEmail", "contactPhone", "designation"],
  ["roleTitle", "department", "city", "type", "minYears", "maxYears", "minSalaryLpa", "maxSalaryLpa", "openings"],
  ["jdText", "additionalNotes"],
  [],
];

const inputCls =
  "h-11 w-full rounded-xl border border-border bg-surface px-4 text-base text-text placeholder:text-text-subtle focus:border-accent focus:outline-none md:text-body-sm";

/**
 * EmployerInquiryForm — 4-step intake (Company → Role → JD & notes → Review) that
 * maps to the `EmployerInquiry` DB shape. The JD is provided either as pasted text
 * or an uploaded file (toggle). On submit it logs the payload (dev only); Phase 2
 * replaces the log with an API call.
 */
export default function EmployerInquiryForm() {
  const [step, setStep] = useState(0);
  const [jdMode, setJdMode] = useState<JdMode>("paste");
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [jdError, setJdError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<EmployerFormInput, unknown, EmployerFormValues>({
    resolver: zodResolver(employerInquiryFormSchema),
    mode: "onTouched",
  });

  const goNext = async () => {
    if (step === 2) {
      const err = validateJd(jdMode, getValues("jdText"), jdFile);
      setJdError(err);
      if (err) return;
    }
    const fields = STEP_FIELDS[step];
    const ok = fields.length === 0 ? true : await trigger(fields);
    if (ok) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const onSubmit = (values: EmployerFormValues) => {
    const err = validateJd(jdMode, values.jdText, jdFile);
    if (err) {
      setJdError(err);
      setStep(2);
      return;
    }
    const payload: EmployerInquiry = {
      id: crypto.randomUUID(),
      companyName: values.companyName,
      companyWebsite: values.companyWebsite?.trim() || null,
      contactPerson: values.contactPerson,
      contactEmail: values.contactEmail,
      contactPhone: values.contactPhone,
      designation: values.designation,
      roleTitle: values.roleTitle,
      department: values.department as Department,
      city: values.city as City,
      type: values.type as JobType,
      minYears: values.minYears,
      maxYears: values.maxYears,
      minSalaryLpa: values.minSalaryLpa ?? null,
      maxSalaryLpa: values.maxSalaryLpa ?? null,
      openings: values.openings,
      jdText: jdMode === "paste" ? values.jdText?.trim() || null : null,
      // Phase 2: the file is uploaded to Cloudinary and this becomes the real URL.
      jdFileUrl: jdMode === "upload" && jdFile ? `mock://cloudinary/jd/${encodeURIComponent(jdFile.name)}` : null,
      additionalNotes: values.additionalNotes?.trim() || null,
      status: "new",
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    // TODO Phase 2: replace with API call to POST /api/employer-inquiries
    if (process.env.NODE_ENV === "development") {
      console.log("[EmployerInquiry submitted]", payload);
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-border bg-surface-2 px-6 py-14 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
          <CheckCircle2 size={32} className="text-accent" aria-hidden />
        </div>
        <h2 className="font-display text-h2 md:text-h2-md">Inquiry received</h2>
        <p className="mx-auto mt-3 max-w-md text-body text-text-muted">
          Thanks — our team will connect from{" "}
          <span className="font-medium text-accent">admin@jobkreators.com</span> within 24 hours to
          scope your search.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/for-employers"
            className="inline-flex h-11 items-center rounded-full bg-accent px-6 text-body-sm font-semibold text-accent-fg hover:bg-accent-2"
          >
            Back to For Employers
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

  const v = getValues();

  return (
    <div className="mx-auto max-w-2xl">
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
            <Field label="Company name" required error={errors.companyName?.message}>
              <input className={inputCls} placeholder="Acme Corp" {...register("companyName")} />
            </Field>
            <Field label="Company website" error={errors.companyWebsite?.message}>
              <input className={inputCls} placeholder="https://acme.com" {...register("companyWebsite")} />
            </Field>
            <Field label="Contact person" required error={errors.contactPerson?.message}>
              <input className={inputCls} placeholder="Priya Kapoor" {...register("contactPerson")} />
            </Field>
            <Field label="Designation" required error={errors.designation?.message}>
              <input className={inputCls} placeholder="Head of Talent" {...register("designation")} />
            </Field>
            <Field label="Work email" required error={errors.contactEmail?.message}>
              <input type="email" className={inputCls} placeholder="priya@acme.com" {...register("contactEmail")} />
            </Field>
            <Field label="Phone" required error={errors.contactPhone?.message}>
              <input className={inputCls} placeholder="+91 98765 43210" {...register("contactPhone")} />
            </Field>
          </div>
        )}

        {step === 1 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Role title" required error={errors.roleTitle?.message} className="sm:col-span-2">
              <input className={inputCls} placeholder="Senior Backend Engineer" {...register("roleTitle")} />
            </Field>
            <Field label="Department" required error={errors.department?.message}>
              <select className={inputCls} defaultValue="" {...register("department")}>
                <option value="" disabled>
                  Select department
                </option>
                {DEPARTMENTS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Location" required error={errors.city?.message}>
              <select className={inputCls} defaultValue="" {...register("city")}>
                <option value="" disabled>
                  Select location
                </option>
                {CITIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Employment type" required error={errors.type?.message}>
              <select className={inputCls} defaultValue="" {...register("type")}>
                <option value="" disabled>
                  Select type
                </option>
                {JOB_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Openings" required error={errors.openings?.message}>
              <input type="number" min={1} className={inputCls} placeholder="2" {...register("openings")} />
            </Field>
            <Field label="Min experience (yrs)" required error={errors.minYears?.message}>
              <input type="number" min={0} className={inputCls} placeholder="3" {...register("minYears")} />
            </Field>
            <Field label="Max experience (yrs)" required error={errors.maxYears?.message}>
              <input type="number" min={0} className={inputCls} placeholder="6" {...register("maxYears")} />
            </Field>
            <Field label="Min salary (₹ LPA)" error={errors.minSalaryLpa?.message}>
              <input type="number" min={0} className={inputCls} placeholder="25" {...register("minSalaryLpa")} />
            </Field>
            <Field label="Max salary (₹ LPA)" error={errors.maxSalaryLpa?.message}>
              <input type="number" min={0} className={inputCls} placeholder="45" {...register("maxSalaryLpa")} />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-5">
            <div>
              <span className="mb-2 block text-body-sm font-semibold text-text">
                Job description <span className="text-danger">*</span>
              </span>
              <div className="mb-3 inline-flex rounded-full border border-border bg-surface p-1">
                {(["paste", "upload"] as JdMode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setJdMode(m);
                      setJdError(null);
                    }}
                    className={`h-9 rounded-full px-4 text-body-sm font-medium transition-colors ${
                      jdMode === m ? "bg-accent text-accent-fg" : "text-text-muted hover:text-text"
                    }`}
                  >
                    {m === "paste" ? "Paste text" : "Upload file"}
                  </button>
                ))}
              </div>

              {jdMode === "paste" ? (
                <textarea
                  rows={7}
                  className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-base text-text placeholder:text-text-subtle focus:border-accent focus:outline-none md:text-body-sm"
                  placeholder="Paste the full job description here…"
                  {...register("jdText")}
                />
              ) : jdFile ? (
                <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4">
                  <FileText size={22} className="shrink-0 text-accent" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-body-sm font-medium text-text">{jdFile.name}</p>
                    <p className="text-caption text-text-subtle">{(jdFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setJdFile(null)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-text-muted hover:bg-surface-2 hover:text-danger"
                    aria-label="Remove JD file"
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
                    if (e.dataTransfer.files?.[0]) {
                      setJdFile(e.dataTransfer.files[0]);
                      setJdError(null);
                    }
                  }}
                  className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
                    dragging ? "border-accent bg-accent/5" : "border-border-strong bg-surface hover:border-accent"
                  }`}
                >
                  <UploadCloud size={28} className="text-accent" aria-hidden />
                  <span className="text-body-sm font-medium text-text">
                    Drag &amp; drop the JD, or <span className="text-accent">browse</span>
                  </span>
                  <span className="text-caption text-text-subtle">PDF, DOC or DOCX · up to 5MB</span>
                  <input
                    type="file"
                    accept={CV_ACCEPT}
                    className="sr-only"
                    onChange={(e) => {
                      setJdFile(e.target.files?.[0] ?? null);
                      setJdError(null);
                    }}
                  />
                </label>
              )}
              {jdError && <p className="mt-1.5 text-caption text-danger">{jdError}</p>}
            </div>

            <Field label="Additional notes" error={errors.additionalNotes?.message}>
              <textarea
                rows={3}
                className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-base text-text placeholder:text-text-subtle focus:border-accent focus:outline-none md:text-body-sm"
                placeholder="Anything else we should know?"
                {...register("additionalNotes")}
              />
              <span className="mt-2 flex items-center gap-1.5 text-caption text-text-subtle">
                <Lock size={12} aria-hidden />
                For confidential searches, mention it here — we&apos;ll keep your company name private.
              </span>
            </Field>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="mb-4 text-h4 font-semibold text-text">Review your inquiry</h3>
            <dl className="divide-y divide-border rounded-xl border border-border bg-surface">
              <Row label="Company">{v.companyName}</Row>
              <Row label="Contact">
                {v.contactPerson}
                {v.designation ? ` · ${v.designation}` : ""}
              </Row>
              <Row label="Email">{v.contactEmail}</Row>
              <Row label="Role">{v.roleTitle}</Row>
              <Row label="Department">{DEPARTMENTS.find((d) => d.value === v.department)?.label ?? "—"}</Row>
              <Row label="Location">{CITIES.find((c) => c.value === v.city)?.label ?? "—"}</Row>
              <Row label="Openings">{v.openings ? String(v.openings) : "—"}</Row>
              <Row label="Experience">
                {v.minYears || v.maxYears ? `${String(v.minYears)}–${String(v.maxYears)} yrs` : "—"}
              </Row>
              <Row label="JD">{jdMode === "upload" ? (jdFile?.name ?? "—") : "Pasted text"}</Row>
            </dl>
          </div>
        )}

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
              Submit inquiry
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
