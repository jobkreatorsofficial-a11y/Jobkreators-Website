"use client";

import { useState } from "react";
import { Plus, X, Eye, PenLine } from "lucide-react";
import type { Job, Department, City, JobType, ExperienceLevel } from "@/lib/schema";
import { DEPARTMENTS, CITIES, CITY_LABELS, JOB_TYPES, EXPERIENCE_LEVELS } from "@/lib/constants";
import FilterDropdown from "@/components/jobs/FilterDropdown";

const inputCls =
  "h-11 w-full rounded-lg border border-border bg-surface px-3.5 text-base text-text placeholder:text-text-subtle focus:border-accent focus:outline-none md:text-body-sm";
const labelCls = "mb-1.5 block text-body-sm font-semibold text-text";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const num = (s: string): number => (s.trim() === "" ? 0 : Number(s));
const numOrNull = (s: string): number | null => (s.trim() === "" ? null : Number(s));

/**
 * JobForm — shared create/edit form. Assembles a full `Job` (computing id/slug/
 * timestamps for new jobs, preserving them on edit) and hands it to `onSave`.
 * Description is markdown with a Write/Preview toggle; the four bullet lists are
 * dynamic add/remove rows.
 */
export default function JobForm({
  job,
  seed,
  onSave,
}: {
  job?: Job;
  seed?: Partial<Job>; // create-mode prefill (e.g. "create job from inquiry")
  onSave: (job: Job) => void;
}) {
  const src = job ?? seed; // initial field values (edit uses job; create may use seed)
  const [title, setTitle] = useState(src?.title ?? "");
  const [company, setCompany] = useState(src?.company ?? "");
  const [slug, setSlug] = useState(job?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(job)); // create (incl. seed) auto-slugs
  const [department, setDepartment] = useState<Department | "">(src?.department ?? "");
  const [cities, setCities] = useState<City[]>(src?.cities ?? []);
  const [type, setType] = useState<JobType | "">(src?.type ?? "");
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | "">(src?.experienceLevel ?? "");
  const [minYears, setMinYears] = useState(src?.minYears != null ? String(src.minYears) : "");
  const [maxYears, setMaxYears] = useState(src?.maxYears != null ? String(src.maxYears) : "");
  const [minAge, setMinAge] = useState(src?.minAge != null ? String(src.minAge) : "");
  const [maxAge, setMaxAge] = useState(src?.maxAge != null ? String(src.maxAge) : "");
  const [minSalary, setMinSalary] = useState(src?.minSalaryLpa != null ? String(src.minSalaryLpa) : "");
  const [maxSalary, setMaxSalary] = useState(src?.maxSalaryLpa != null ? String(src.maxSalaryLpa) : "");
  const [description, setDescription] = useState(src?.description ?? "");
  const [closesAt, setClosesAt] = useState(job?.closesAt ? job.closesAt.slice(0, 10) : "");
  const [responsibilities, setResponsibilities] = useState<string[]>(src?.responsibilities?.length ? src.responsibilities : [""]);
  const [requirements, setRequirements] = useState<string[]>(src?.requirements?.length ? src.requirements : [""]);
  const [niceToHave, setNiceToHave] = useState<string[]>(src?.niceToHave?.length ? src.niceToHave : [""]);
  const [benefits, setBenefits] = useState<string[]>(src?.benefits?.length ? src.benefits : [""]);
  const [preview, setPreview] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-slug from title + company until the user edits the slug manually.
  const onTitle = (val: string) => {
    setTitle(val);
    if (!slugEdited) setSlug(slugify(`${val} ${company}`));
  };
  const onCompany = (val: string) => {
    setCompany(val);
    if (!slugEdited) setSlug(slugify(`${title} ${val}`));
  };

  const build = (status: Job["status"]): Job | null => {
    const errs: Record<string, string> = {};
    if (title.trim().length < 2) errs.title = "Title is required";
    if (company.trim().length < 2) errs.company = "Company is required";
    if (!department) errs.department = "Required";
    if (cities.length === 0) errs.cities = "Add at least one city";
    if (!type) errs.type = "Required";
    if (!experienceLevel) errs.experienceLevel = "Required";
    if (description.trim().length < 10) errs.description = "Add a description";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return null;

    const now = new Date().toISOString();
    const clean = (arr: string[]) => arr.map((s) => s.trim()).filter(Boolean);
    return {
      id: job?.id ?? crypto.randomUUID(),
      slug: slug || slugify(`${title} ${company}`),
      title: title.trim(),
      company: company.trim(),
      companyLogoUrl: job?.companyLogoUrl ?? null,
      department: department as Department,
      cities,
      type: type as JobType,
      experienceLevel: experienceLevel as ExperienceLevel,
      minYears: num(minYears),
      maxYears: num(maxYears),
      minAge: numOrNull(minAge),
      maxAge: numOrNull(maxAge),
      minSalaryLpa: numOrNull(minSalary),
      maxSalaryLpa: numOrNull(maxSalary),
      description: description.trim(),
      responsibilities: clean(responsibilities),
      requirements: clean(requirements),
      niceToHave: clean(niceToHave),
      benefits: clean(benefits),
      status,
      postedAt: job?.postedAt ?? now,
      closesAt: closesAt ? new Date(closesAt).toISOString() : null,
      createdAt: job?.createdAt ?? now,
      updatedAt: now,
    };
  };

  const save = (status: Job["status"]) => {
    const built = build(status);
    if (built) onSave(built);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save(job?.status ?? "active");
      }}
      className="flex flex-col gap-6"
    >
      {/* Basics */}
      <Section title="Basics">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldWrap label="Job title" error={errors.title} className="sm:col-span-2">
            <input className={inputCls} value={title} onChange={(e) => onTitle(e.target.value)} placeholder="Senior Frontend Engineer" />
          </FieldWrap>
          <FieldWrap label="Company" error={errors.company}>
            <input className={inputCls} value={company} onChange={(e) => onCompany(e.target.value)} placeholder="Scaler" />
          </FieldWrap>
          <FieldWrap label="Slug" hint="auto-generated, editable">
            <input
              className={inputCls}
              value={slug}
              onChange={(e) => {
                setSlug(slugify(e.target.value));
                setSlugEdited(true);
              }}
              placeholder="senior-frontend-engineer-scaler"
            />
          </FieldWrap>
        </div>
      </Section>

      {/* Classification */}
      <Section title="Classification">
        {/* Locations — searchable multi-select with removable chips (min 1 required). */}
        <div className="mb-5">
          <span className={labelCls}>Locations</span>
          {cities.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {cities.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/5 px-2.5 py-1 text-caption text-text"
                >
                  {CITY_LABELS[c]}
                  <button
                    type="button"
                    onClick={() => setCities(cities.filter((x) => x !== c))}
                    className="text-text-subtle hover:text-danger"
                    aria-label={`Remove ${CITY_LABELS[c]}`}
                  >
                    <X size={12} aria-hidden />
                  </button>
                </span>
              ))}
            </div>
          )}
          <FilterDropdown label="Add city" options={CITIES} selected={cities} onChange={(next) => setCities(next as City[])} searchable />
          {errors.cities && <p className="mt-1 text-caption text-danger">{errors.cities}</p>}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FieldWrap label="Department" error={errors.department}>
            <Select value={department} onChange={(v) => setDepartment(v as Department)} options={DEPARTMENTS} placeholder="Department" />
          </FieldWrap>
          <FieldWrap label="Type" error={errors.type}>
            <Select value={type} onChange={(v) => setType(v as JobType)} options={JOB_TYPES} placeholder="Type" />
          </FieldWrap>
          <FieldWrap label="Experience" error={errors.experienceLevel}>
            <Select value={experienceLevel} onChange={(v) => setExperienceLevel(v as ExperienceLevel)} options={EXPERIENCE_LEVELS} placeholder="Level" />
          </FieldWrap>
          <FieldWrap label="Min years">
            <input type="number" min={0} className={inputCls} value={minYears} onChange={(e) => setMinYears(e.target.value)} placeholder="3" />
          </FieldWrap>
          <FieldWrap label="Max years">
            <input type="number" min={0} className={inputCls} value={maxYears} onChange={(e) => setMaxYears(e.target.value)} placeholder="6" />
          </FieldWrap>
          <FieldWrap label="Min salary (LPA)" hint="blank = competitive">
            <input type="number" min={0} className={inputCls} value={minSalary} onChange={(e) => setMinSalary(e.target.value)} placeholder="30" />
          </FieldWrap>
          <FieldWrap label="Max salary (LPA)">
            <input type="number" min={0} className={inputCls} value={maxSalary} onChange={(e) => setMaxSalary(e.target.value)} placeholder="55" />
          </FieldWrap>
          <FieldWrap label="Min age" hint="optional — blank if no age preference">
            <input type="number" min={18} max={70} className={inputCls} value={minAge} onChange={(e) => setMinAge(e.target.value)} placeholder="25" />
          </FieldWrap>
          <FieldWrap label="Max age" hint="optional">
            <input type="number" min={18} max={70} className={inputCls} value={maxAge} onChange={(e) => setMaxAge(e.target.value)} placeholder="35" />
          </FieldWrap>
          <FieldWrap label="Applications close" hint="optional">
            <input type="date" className={inputCls} value={closesAt} onChange={(e) => setClosesAt(e.target.value)} />
          </FieldWrap>
        </div>
      </Section>

      {/* Description (markdown) */}
      <Section title="Description">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-caption text-text-subtle">Markdown supported</span>
          <button
            type="button"
            onClick={() => setPreview((p) => !p)}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-body-sm font-medium text-text-muted hover:border-accent hover:text-text"
          >
            {preview ? <PenLine size={14} aria-hidden /> : <Eye size={14} aria-hidden />}
            {preview ? "Write" : "Preview"}
          </button>
        </div>
        {preview ? (
          <div className="min-h-[10rem] rounded-lg border border-border bg-surface p-4">
            <MarkdownPreview text={description} />
          </div>
        ) : (
          <textarea
            rows={8}
            className="w-full resize-y rounded-lg border border-border bg-surface p-4 text-base text-text placeholder:text-text-subtle focus:border-accent focus:outline-none md:text-body-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What the role is about. **Bold**, # headings and - lists are supported."
          />
        )}
        {errors.description && <p className="mt-1.5 text-caption text-danger">{errors.description}</p>}
      </Section>

      {/* Lists */}
      <Section title="Details">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ListInput label="Responsibilities" items={responsibilities} setItems={setResponsibilities} />
          <ListInput label="Requirements" items={requirements} setItems={setRequirements} />
          <ListInput label="Nice to have" items={niceToHave} setItems={setNiceToHave} />
          <ListInput label="Benefits" items={benefits} setItems={setBenefits} />
        </div>
      </Section>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => save("active")}
          className="inline-flex h-11 items-center rounded-lg bg-accent px-6 text-body-sm font-semibold text-accent-fg hover:bg-accent-2"
        >
          {job ? "Save & publish" : "Publish"}
        </button>
        <button
          type="button"
          onClick={() => save("draft")}
          className="inline-flex h-11 items-center rounded-lg border border-border-strong bg-surface px-6 text-body-sm font-medium text-text hover:border-accent"
        >
          Save as draft
        </button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-surface p-5 md:p-6">
      <h2 className="mb-4 text-body font-semibold text-text">{title}</h2>
      {children}
    </section>
  );
}

function FieldWrap({
  label,
  hint,
  error,
  className,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className={labelCls}>
        {label} {hint && <span className="font-normal text-text-subtle">· {hint}</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-caption text-danger">{error}</p>}
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly { value: string; label: string }[];
  placeholder: string;
}) {
  return (
    <select className={inputCls} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function ListInput({
  label,
  items,
  setItems,
}: {
  label: string;
  items: string[];
  setItems: (items: string[]) => void;
}) {
  const update = (i: number, val: string) => setItems(items.map((x, idx) => (idx === i ? val : x)));
  const remove = (i: number) => setItems(items.filter((_, idx) => idx !== i).length ? items.filter((_, idx) => idx !== i) : [""]);
  return (
    <div>
      <span className={labelCls}>{label}</span>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              className={inputCls}
              value={item}
              onChange={(e) => update(i, e.target.value)}
              placeholder={`${label} item`}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-muted hover:bg-surface-2 hover:text-danger"
              aria-label="Remove item"
            >
              <X size={16} aria-hidden />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setItems([...items, ""])}
        className="mt-2 inline-flex items-center gap-1 text-body-sm font-medium text-accent hover:text-accent-2"
      >
        <Plus size={14} aria-hidden /> Add
      </button>
    </div>
  );
}

// Minimal, dependency-free markdown preview: headings, bold, and bullet lists.
function MarkdownPreview({ text }: { text: string }) {
  if (!text.trim()) return <p className="text-body-sm text-text-subtle">Nothing to preview.</p>;
  const blocks = text.split(/\n{2,}/);
  return (
    <div className="space-y-3">
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        if (lines.every((l) => l.trimStart().startsWith("- "))) {
          return (
            <ul key={i} className="list-disc space-y-1 pl-5 text-body text-text-muted">
              {lines.map((l, j) => (
                <li key={j}>{inline(l.trimStart().slice(2))}</li>
              ))}
            </ul>
          );
        }
        if (block.startsWith("## ")) return <h3 key={i} className="text-h4 font-semibold text-text">{inline(block.slice(3))}</h3>;
        if (block.startsWith("# ")) return <h2 key={i} className="text-h3 font-semibold text-text">{inline(block.slice(2))}</h2>;
        return <p key={i} className="text-body text-text-muted">{inline(block)}</p>;
      })}
    </div>
  );
}

// Inline **bold** parsing → JSX (no dangerouslySetInnerHTML).
function inline(text: string): React.ReactNode {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-text">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  );
}
