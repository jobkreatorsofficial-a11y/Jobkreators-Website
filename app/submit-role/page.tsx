"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useForm } from "react-hook-form";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { SITE } from "@/lib/data";

type FormValues = {
  company: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  count: string;
  timeline: string;
  location: string;
  notes: string;
};

export default function SubmitRolePage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = () => {
    // TODO(phase-later): wire submission to a backend/email handler.
    setSubmitted(true);
    reset();
  };

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-bg">
        <section className="py-20">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-sm font-medium text-accent tracking-widest uppercase mb-3">For Employers</p>
              <h1 className="text-3xl md:text-4xl md:text-5xl font-bold font-display text-text mb-4">
                Submit a Role
              </h1>
              <p className="text-text-muted text-lg">
                Share your hiring requirement and we&apos;ll deliver a curated shortlist within 5-8 days.
              </p>
            </div>

            {/* Trust bar */}
            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
                { value: "5-8 Days", label: "Avg. Fulfillment" },
                { value: "94%", label: "Match Rate" },
                { value: "90 Days", label: "Free Replacement" },
              ].map((item) => (
                <div key={item.label} className="text-center p-4 rounded-xl bg-surface-2 border border-border">
                  <div className="text-xl font-bold text-accent">{item.value}</div>
                  <div className="text-xs text-text-muted">{item.label}</div>
                </div>
              ))}
            </div>

            {submitted ? (
              <div className="text-center py-16 rounded-2xl border border-border bg-surface-2">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={32} className="text-success" />
                </div>
                <h2 className="text-2xl font-bold font-display text-text mb-3">
                  Requirement Received!
                </h2>
                <p className="text-text-muted max-w-sm mx-auto mb-6">
                  Our team will review your requirement and reach out within 4 business hours to discuss next steps.
                </p>
                <a
                  href={`https://wa.me/${SITE.whatsapp.replace("+", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-accent text-accent-fg font-semibold px-6 py-3 rounded-full hover:bg-accent-2 transition-all"
                >
                  Chat on WhatsApp for faster response
                  <ArrowRight size={16} />
                </a>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 p-8 rounded-2xl border border-border bg-surface-2"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-text mb-2">Company Name *</label>
                    <input {...register("company", { required: true })} placeholder="Acme Corp" className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition" />
                    {errors.company && <p className="text-danger text-xs mt-1">Required</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text mb-2">Your Name *</label>
                    <input {...register("name", { required: true })} placeholder="Priya Verma" className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition" />
                    {errors.name && <p className="text-danger text-xs mt-1">Required</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-text mb-2">Work Email *</label>
                    <input {...register("email", { required: true })} type="email" placeholder="priya@company.com" className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition" />
                    {errors.email && <p className="text-danger text-xs mt-1">Required</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text mb-2">Phone *</label>
                    <input {...register("phone", { required: true })} placeholder="+91 98765 43210" className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition" />
                    {errors.phone && <p className="text-danger text-xs mt-1">Required</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-text mb-2">Role to Fill *</label>
                    <input {...register("role", { required: true })} placeholder="Senior Sales Manager" className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition" />
                    {errors.role && <p className="text-danger text-xs mt-1">Required</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text mb-2">Number of Positions</label>
                    <select {...register("count")} className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition">
                      <option>1</option>
                      <option>2-5</option>
                      <option>5-10</option>
                      <option>10-50</option>
                      <option>50+</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-text mb-2">Timeline</label>
                    <select {...register("timeline")} className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition">
                      <option>ASAP (within a week)</option>
                      <option>Within 2 weeks</option>
                      <option>Within a month</option>
                      <option>Flexible</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text mb-2">Work Location</label>
                    <input {...register("location")} placeholder="Mumbai / Remote / Hybrid" className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text mb-2">Additional Notes</label>
                  <textarea {...register("notes")} rows={4} placeholder="Budget, required skills, team context, anything else we should know..." className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition resize-none" />
                </div>

                <button type="submit" className="w-full bg-accent text-accent-fg font-bold py-4 rounded-xl hover:bg-accent-2 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-accent/25">
                  Submit Requirement
                </button>

                <p className="text-center text-xs text-text-muted">
                  We&apos;ll respond within 4 business hours. Prefer instant response?{" "}
                  <a href={`https://wa.me/${SITE.whatsapp.replace("+", "")}`} className="text-accent" target="_blank" rel="noopener noreferrer">
                    WhatsApp us directly.
                  </a>
                </p>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
