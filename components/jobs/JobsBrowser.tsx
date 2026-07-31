"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { Job } from "@/lib/schema";
import { DEPARTMENTS, CITIES, JOB_TYPES, EXPERIENCE_LEVELS } from "@/lib/constants";
import FilterDropdown from "./FilterDropdown";
import JobsList from "./JobsList";

type SortKey = "newest" | "salary";
type Filters = {
  q: string;
  dept: string[];
  city: string[];
  type: string[];
  exp: string[];
  sort: SortKey;
};

const csv = (v: string | null) => (v ? v.split(",").filter(Boolean) : []);

/**
 * JobsBrowser — filter/sort/search over the public jobs. Filter state is the
 * source of truth and is mirrored into the URL query (shareable filtered views);
 * the initial state is read back from the URL, so an SSR render of a shared link
 * shows the right results. The list is keyed by the active filters so paging resets.
 */
export default function JobsBrowser({ jobs }: { jobs: Job[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Source of truth = state; seeded once from the URL (so shared links work).
  const [filters, setFilters] = useState<Filters>(() => ({
    q: searchParams.get("q") ?? "",
    dept: csv(searchParams.get("dept")),
    city: csv(searchParams.get("city")),
    type: csv(searchParams.get("type")),
    exp: csv(searchParams.get("exp")),
    sort: (searchParams.get("sort") as SortKey) || "newest",
  }));

  // Mirror filters → URL whenever they change (shallow, no scroll jump).
  useEffect(() => {
    const p = new URLSearchParams();
    if (filters.q) p.set("q", filters.q);
    if (filters.dept.length) p.set("dept", filters.dept.join(","));
    if (filters.city.length) p.set("city", filters.city.join(","));
    if (filters.type.length) p.set("type", filters.type.join(","));
    if (filters.exp.length) p.set("exp", filters.exp.join(","));
    if (filters.sort !== "newest") p.set("sort", filters.sort);
    const qs = p.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [filters, pathname, router]);

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setFilters((f) => ({ ...f, [key]: value }));

  const toggleIn = (key: "type" | "exp", value: string) =>
    set(key, filters[key].includes(value) ? filters[key].filter((v) => v !== value) : [...filters[key], value]);

  const activeCount =
    filters.dept.length + filters.city.length + filters.type.length + filters.exp.length + (filters.q ? 1 : 0);

  const clearAll = () => setFilters({ q: "", dept: [], city: [], type: [], exp: [], sort: filters.sort });

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    const list = jobs.filter((job) => {
      if (filters.dept.length && !filters.dept.includes(job.department)) return false;
      if (filters.city.length && !filters.city.includes(job.city)) return false;
      if (filters.type.length && !filters.type.includes(job.type)) return false;
      if (filters.exp.length && !filters.exp.includes(job.experienceLevel)) return false;
      if (q && !job.title.toLowerCase().includes(q) && !job.company.toLowerCase().includes(q)) return false;
      return true;
    });
    return [...list].sort((a, b) =>
      filters.sort === "salary"
        ? (b.maxSalaryLpa ?? -1) - (a.maxSalaryLpa ?? -1)
        : b.postedAt.localeCompare(a.postedAt),
    );
  }, [jobs, filters]);

  const listKey = `${filters.q}|${filters.dept}|${filters.city}|${filters.type}|${filters.exp}|${filters.sort}`;

  return (
    <div>
      {/* Sticky filter bar (clears the 64px navbar). */}
      <div className="sticky top-16 z-20 -mx-6 border-b border-border bg-bg/90 px-6 py-4 backdrop-blur-md md:-mx-8 md:px-8">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative flex-1">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-subtle" aria-hidden />
              <input
                type="search"
                value={filters.q}
                onChange={(e) => set("q", e.target.value)}
                placeholder="Search role or company…"
                className="h-11 w-full rounded-full border border-border-strong bg-surface pl-11 pr-4 text-base text-text placeholder:text-text-subtle focus:border-accent focus:outline-none md:text-body-sm"
              />
            </label>
            <select
              value={filters.sort}
              onChange={(e) => set("sort", e.target.value as SortKey)}
              className="h-11 rounded-full border border-border-strong bg-surface px-4 text-base text-text focus:border-accent focus:outline-none md:text-body-sm"
              aria-label="Sort jobs"
            >
              <option value="newest">Newest first</option>
              <option value="salary">Salary: high to low</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal size={16} className="hidden text-text-subtle sm:block" aria-hidden />
            <FilterDropdown label="Department" options={DEPARTMENTS} selected={filters.dept} onChange={(v) => set("dept", v)} />
            <FilterDropdown label="City" options={CITIES} selected={filters.city} onChange={(v) => set("city", v)} />
            {JOB_TYPES.map((t) => (
              <Chip key={t.value} active={filters.type.includes(t.value)} onClick={() => toggleIn("type", t.value)}>
                {t.label}
              </Chip>
            ))}
            {EXPERIENCE_LEVELS.map((e) => (
              <Chip key={e.value} active={filters.exp.includes(e.value)} onClick={() => toggleIn("exp", e.value)}>
                {e.label}
              </Chip>
            ))}
            {activeCount > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex h-11 items-center gap-1 rounded-full px-3 text-body-sm font-medium text-text-muted hover:text-accent"
              >
                <X size={14} aria-hidden /> Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Result count */}
      <p className="mb-6 mt-8 text-body-sm text-text-muted">
        <span className="font-semibold text-text">{filtered.length}</span>{" "}
        {filtered.length === 1 ? "role" : "roles"} found
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border-strong bg-surface-2 px-6 py-16 text-center">
          <p className="text-h4 font-semibold text-text">No roles match your filters</p>
          <p className="mx-auto mt-2 max-w-sm text-body-sm text-text-muted">
            Try widening your search — or submit your CV and we&apos;ll reach out when a matching role opens up.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {activeCount > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex h-11 items-center rounded-full border border-border-strong bg-surface px-5 text-body-sm font-medium text-text hover:border-accent"
              >
                Clear filters
              </button>
            )}
            <a
              href="/submit-cv"
              className="inline-flex h-11 items-center rounded-full bg-accent px-5 text-body-sm font-semibold text-accent-fg hover:bg-accent-2"
            >
              Submit your CV
            </a>
          </div>
        </div>
      ) : (
        <JobsList key={listKey} jobs={filtered} />
      )}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-11 items-center rounded-full border px-4 text-body-sm font-medium transition-colors ${
        active
          ? "border-accent bg-accent/5 text-text"
          : "border-border-strong bg-surface text-text-muted hover:border-accent hover:text-text"
      }`}
    >
      {children}
    </button>
  );
}
