"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { AdminPageHeader } from "@/components/admin/ui";
import JobForm from "@/components/admin/JobForm";
import type { Job } from "@/lib/schema";

export default function NewJobPage() {
  return (
    <Suspense fallback={null}>
      <NewJobInner />
    </Suspense>
  );
}

function NewJobInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { createJob, inquiries } = useAdmin();

  // Optional prefill from an employer inquiry ("Create job post from this").
  const fromInquiry = searchParams.get("fromInquiry");
  const inquiry = fromInquiry ? inquiries.find((i) => i.id === fromInquiry) : undefined;
  const seed: Partial<Job> | undefined = inquiry
    ? {
        title: inquiry.roleTitle,
        company: inquiry.companyName,
        department: inquiry.department,
        city: inquiry.city,
        type: inquiry.type,
        minYears: inquiry.minYears,
        maxYears: inquiry.maxYears,
        minSalaryLpa: inquiry.minSalaryLpa,
        maxSalaryLpa: inquiry.maxSalaryLpa,
        description: inquiry.jdText ?? "",
      }
    : undefined;

  return (
    <>
      <Link
        href="/admin/jobs"
        className="mb-4 inline-flex items-center gap-1.5 text-body-sm font-medium text-text-muted hover:text-accent"
      >
        <ArrowLeft size={16} aria-hidden /> Back to jobs
      </Link>
      <AdminPageHeader
        title="Create job"
        description={inquiry ? `Prefilled from ${inquiry.companyName}'s inquiry.` : "Publish immediately or save as a draft."}
      />
      <JobForm
        seed={seed}
        onSave={(job) => {
          createJob(job);
          router.push("/admin/jobs");
        }}
      />
    </>
  );
}
