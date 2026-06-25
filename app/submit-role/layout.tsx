import type { Metadata } from "next";

// The page itself is a Client Component (a form), so route metadata lives here.
export const metadata: Metadata = {
  title: "Submit a Role — JOBKREATORS",
  description:
    "Hiring? Submit a role to JOBKREATORS and get an AI-curated, human-vetted shortlist in as little as 72 hours. 90-day free replacement.",
  alternates: { canonical: "/submit-role" },
};

export default function SubmitRoleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
