import type { Metadata } from "next";

// The page itself is a Client Component (a form), so route metadata lives here.
export const metadata: Metadata = {
  title: "Submit Your CV — JOBKREATORS",
  description:
    "Submit your CV to JOBKREATORS. 100% free for candidates — our team and AI match you with roles that fit, then guide you to the offer.",
  alternates: { canonical: "/submit-cv" },
};

export default function SubmitCvLayout({ children }: { children: React.ReactNode }) {
  return children;
}
