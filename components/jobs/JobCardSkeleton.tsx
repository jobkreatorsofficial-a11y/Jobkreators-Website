/**
 * JobCardSkeleton — shown while the browser "loads" filtered results. In Phase 1
 * this is a short simulated latency on filter change; Phase 2 shows it during the
 * real fetch. Pure CSS pulse (stilled for reduced motion by the global media block).
 */
export default function JobCardSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-surface p-6" aria-hidden>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="h-5 w-2/3 animate-pulse rounded bg-surface-3" />
          <div className="mt-2 h-3.5 w-1/3 animate-pulse rounded bg-surface-3" />
        </div>
        <div className="h-4 w-4 animate-pulse rounded bg-surface-3" />
      </div>
      <div className="mb-4 flex gap-4">
        <div className="h-3.5 w-20 animate-pulse rounded bg-surface-3" />
        <div className="h-3.5 w-16 animate-pulse rounded bg-surface-3" />
      </div>
      <div className="mb-5 h-5 w-28 animate-pulse rounded bg-surface-3" />
      <div className="mt-auto flex gap-2">
        <div className="h-6 w-24 animate-pulse rounded-full bg-surface-3" />
        <div className="h-6 w-20 animate-pulse rounded-full bg-surface-3" />
      </div>
    </div>
  );
}
