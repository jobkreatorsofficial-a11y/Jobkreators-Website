import JobCardSkeleton from "./JobCardSkeleton";

/** Suspense fallback for the jobs browser — the "loading" state. */
export default function JobsGridSkeleton() {
  return (
    <div>
      <div className="sticky top-16 z-20 -mx-6 border-b border-border bg-bg/90 px-6 py-4 md:-mx-8 md:px-8">
        <div className="h-11 w-full animate-pulse rounded-full bg-surface-3" />
      </div>
      <div className="mb-6 mt-8 h-4 w-24 animate-pulse rounded bg-surface-3" />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <JobCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
