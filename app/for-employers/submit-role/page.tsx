import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import EmployerInquiryForm from "@/components/employers/EmployerInquiryForm";

export const metadata: Metadata = {
  title: "Submit a Role — JOBKREATORS For Employers",
  description:
    "Tell us who you're hiring. Share the role and get a curated shortlist from JOBKREATORS within days.",
  alternates: { canonical: "/for-employers/submit-role" },
};

export default function SubmitRolePage() {
  return (
    <>
      <Navbar />
      <main id="main" className="min-h-screen pb-24 pt-28 md:pt-32">
        <Container size="narrow">
          <Link
            href="/for-employers"
            className="inline-flex items-center gap-1.5 text-body-sm font-medium text-text-muted transition-colors hover:text-accent"
          >
            <ArrowLeft size={16} aria-hidden /> Back to For Employers
          </Link>

          <div className="mb-10 mt-6 text-center">
            <Eyebrow className="justify-center" dot>
              FOR EMPLOYERS
            </Eyebrow>
            <h1 className="mt-3 font-display text-h1 md:text-h1-md">Submit a role</h1>
            <p className="mx-auto mt-3 max-w-md text-body-lg text-text-muted">
              Share the details and our team will connect within 24 hours to scope your search.
            </p>
          </div>

          <EmployerInquiryForm />
        </Container>
      </main>
      <Footer />
    </>
  );
}
