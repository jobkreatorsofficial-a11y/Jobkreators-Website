import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Briefcase, MapPin, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Job Openings — JOBKREATORS",
  description: "Browse open jobs across India. 100% free for candidates. Submit your CV and get placed.",
};

const SAMPLE_JOBS = [
  {
    id: 1,
    title: "Business Development Executive",
    company: "EdTech Company",
    location: "Bangalore / Remote",
    type: "Full-time",
    salary: "₹4L - ₹8L",
    tags: ["Sales", "EdTech", "B2B"],
  },
  {
    id: 2,
    title: "Senior Software Engineer",
    company: "SaaS Startup",
    location: "Pune",
    type: "Full-time",
    salary: "₹18L - ₹30L",
    tags: ["React", "Node.js", "AWS"],
  },
  {
    id: 3,
    title: "Human Resources Manager",
    company: "Pharma Company",
    location: "Mumbai",
    type: "Full-time",
    salary: "₹8L - ₹14L",
    tags: ["HR", "Pharma", "HRBP"],
  },
  {
    id: 4,
    title: "Finance Analyst",
    company: "NBFC",
    location: "Delhi NCR",
    type: "Full-time",
    salary: "₹6L - ₹12L",
    tags: ["Finance", "Excel", "Reporting"],
  },
  {
    id: 5,
    title: "Product Manager",
    company: "D2C Brand",
    location: "Hyderabad / Hybrid",
    type: "Full-time",
    salary: "₹15L - ₹25L",
    tags: ["Product", "Analytics", "Agile"],
  },
  {
    id: 6,
    title: "Marketing Manager",
    company: "EdTech Platform",
    location: "Noida",
    type: "Full-time",
    salary: "₹10L - ₹18L",
    tags: ["Marketing", "Digital", "D2C"],
  },
];

export default function JobsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <section className="py-20 bg-bg">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div>
                <p className="text-sm font-medium text-accent tracking-widest uppercase mb-3">Open Roles</p>
                <h1 className="text-4xl md:text-5xl font-bold font-display text-text">
                  Find your next opportunity
                </h1>
                <p className="text-text-muted mt-3">
                  100% free for candidates · Updated daily
                </p>
              </div>
              <Link
                href="/submit-cv"
                className="flex items-center gap-2 bg-accent text-accent-fg font-semibold px-6 py-3 rounded-full hover:bg-accent-2 transition-all hover:scale-105 w-fit"
              >
                Submit Your CV <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {SAMPLE_JOBS.map((job) => (
                <div
                  key={job.id}
                  className="group p-6 rounded-2xl border border-border bg-surface-2 hover:border-accent hover:-translate-y-1 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-text group-hover:text-accent transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-text-muted text-sm">{job.company}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <Briefcase size={18} className="text-accent" />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 text-xs text-text-muted mb-4">
                    <span className="flex items-center gap-1"><MapPin size={11} /> {job.location}</span>
                    <span className="flex items-center gap-1"><Clock size={11} /> {job.type}</span>
                    <span className="font-semibold text-accent">{job.salary}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-bg border border-border text-xs font-medium text-text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                    Apply Now <ArrowRight size={12} />
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12 p-8 rounded-2xl border border-dashed border-accent/30 bg-accent/5">
              <p className="text-text font-semibold mb-2">
                Don&apos;t see the right role?
              </p>
              <p className="text-text-muted text-sm mb-4">
                Submit your CV and we&apos;ll match you to upcoming opportunities.
              </p>
              <Link
                href="/submit-cv"
                className="inline-flex items-center gap-2 bg-accent text-accent-fg font-semibold px-6 py-3 rounded-full hover:bg-accent-2 transition-all"
              >
                Submit Your CV
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
