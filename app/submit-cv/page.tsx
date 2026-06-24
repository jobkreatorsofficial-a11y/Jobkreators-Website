"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useForm } from "react-hook-form";
import { CheckCircle2, Upload } from "lucide-react";
import { useState } from "react";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  role: string;
  experience: string;
  location: string;
  message: string;
};

export default function SubmitCVPage() {
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
      <main className="pt-16 min-h-screen bg-white dark:bg-[#0A0A0A]">
        <section className="py-20">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-sm font-medium text-[#0066FF] tracking-widest uppercase mb-3">100% Free</p>
              <h1 className="text-3xl md:text-4xl md:text-5xl font-bold text-[#1D1D1F] dark:text-white mb-4">
                Submit Your CV
              </h1>
              <p className="text-[#6E6E73] dark:text-[#A1A1A6] text-lg">
                Share your details and we&apos;ll match you with the perfect opportunity. No fees, ever.
              </p>
            </div>

            {submitted ? (
              <div className="text-center py-16 rounded-2xl border border-black/10 dark:border-white/10 bg-[#F5F5F7] dark:bg-[#1A1A1A]">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={32} color="#22C55E" />
                </div>
                <h2 className="text-2xl font-bold text-[#1D1D1F] dark:text-white mb-3">
                  Application Received!
                </h2>
                <p className="text-[#6E6E73] dark:text-[#A1A1A6] max-w-sm mx-auto">
                  Our team will review your profile and reach out within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-8 bg-[#0066FF] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#004FCC] transition-all"
                >
                  Submit Another
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 p-8 rounded-2xl border border-black/10 dark:border-white/10 bg-[#F5F5F7] dark:bg-[#1A1A1A]"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#1D1D1F] dark:text-white mb-2">
                      Full Name *
                    </label>
                    <input
                      {...register("name", { required: "Name is required" })}
                      placeholder="Rahul Sharma"
                      className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0A0A0A] text-[#1D1D1F] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]/50 transition"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1D1D1F] dark:text-white mb-2">
                      Email *
                    </label>
                    <input
                      {...register("email", { required: "Email is required" })}
                      type="email"
                      placeholder="rahul@email.com"
                      className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0A0A0A] text-[#1D1D1F] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]/50 transition"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#1D1D1F] dark:text-white mb-2">
                      Phone *
                    </label>
                    <input
                      {...register("phone", { required: "Phone is required" })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0A0A0A] text-[#1D1D1F] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]/50 transition"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1D1D1F] dark:text-white mb-2">
                      Target Role *
                    </label>
                    <input
                      {...register("role", { required: "Role is required" })}
                      placeholder="Business Development Manager"
                      className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0A0A0A] text-[#1D1D1F] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]/50 transition"
                    />
                    {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#1D1D1F] dark:text-white mb-2">
                      Years of Experience *
                    </label>
                    <select
                      {...register("experience", { required: true })}
                      className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0A0A0A] text-[#1D1D1F] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]/50 transition"
                    >
                      <option value="">Select experience</option>
                      <option>Fresher (0-1 year)</option>
                      <option>1-3 years</option>
                      <option>3-5 years</option>
                      <option>5-10 years</option>
                      <option>10+ years</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1D1D1F] dark:text-white mb-2">
                      Preferred Location
                    </label>
                    <input
                      {...register("location")}
                      placeholder="Mumbai / Remote"
                      className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0A0A0A] text-[#1D1D1F] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]/50 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1D1D1F] dark:text-white mb-2">
                    Additional Message
                  </label>
                  <textarea
                    {...register("message")}
                    rows={4}
                    placeholder="Tell us about yourself and what you're looking for..."
                    className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0A0A0A] text-[#1D1D1F] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]/50 transition resize-none"
                  />
                </div>

                {/* CV Upload notice */}
                <div className="flex items-center gap-3 p-4 rounded-xl border border-dashed border-[#0066FF]/30 bg-[#0066FF]/5 text-sm text-[#6E6E73] dark:text-[#A1A1A6]">
                  <Upload size={16} color="#0066FF" className="shrink-0" />
                  <span>Send your CV directly to <span className="text-[#0066FF] font-semibold">Recruitment.Team@jobkreators.com</span> after submitting this form.</span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0066FF] text-white font-bold py-4 rounded-xl hover:bg-[#004FCC] transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-[#0066FF]/25"
                >
                  Submit Application — It&apos;s Free
                </button>

                <p className="text-center text-xs text-[#6E6E73] dark:text-[#6E6E73]">
                  We never charge candidates. We never share your data without permission.
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
