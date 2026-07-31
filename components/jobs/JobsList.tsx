"use client";

import { useEffect, useRef, useState } from "react";
import type { Job } from "@/lib/schema";
import JobCard from "./JobCard";

const PAGE = 6;

/**
 * JobsList — infinite-scroll grid over an already-filtered job list. The parent
 * gives it a `key` derived from the active filters, so changing filters remounts
 * it and resets paging (no reset-in-effect). A sentinel + IntersectionObserver
 * reveals the next page as it scrolls into view.
 */
export default function JobsList({ jobs }: { jobs: Job[] }) {
  const [visible, setVisible] = useState(PAGE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible((v) => Math.min(v + PAGE, jobs.length));
      },
      { rootMargin: "400px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [jobs.length]);

  return (
    <>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {jobs.slice(0, visible).map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
      {visible < jobs.length && <div ref={sentinelRef} className="h-10" aria-hidden />}
    </>
  );
}
