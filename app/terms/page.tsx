import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — JOBKREATORS",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <section className="py-20 bg-bg min-h-screen">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <h1 className="text-4xl font-bold font-display text-text mb-4">Terms of Service</h1>
            <p className="text-text-muted mb-10">Last updated: May 2025</p>

            <div className="space-y-8">
              {[
                {
                  title: "1. Acceptance of Terms",
                  content: "By accessing or using JOBKREATORS services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.",
                },
                {
                  title: "2. Services Description",
                  content: "JOBKREATORS provides recruitment and consultancy services including permanent placement, bulk hiring, career counseling, and related services. Our services are free for candidates and fee-based for employers upon successful placement.",
                },
                {
                  title: "3. Candidate Terms",
                  content: "Candidates must provide accurate information about their qualifications and experience. JOBKREATORS reserves the right to remove candidates from our platform if false information is provided. Our services are 100% free for candidates with no hidden charges.",
                },
                {
                  title: "4. Employer Terms",
                  content: "Employers agree to provide accurate job descriptions and company information. Fees for successful placements are agreed upon in a separate engagement letter. Our standard 90-day replacement guarantee applies to all permanent placements.",
                },
                {
                  title: "5. Replacement Guarantee",
                  content: "JOBKREATORS offers a 90-day free replacement guarantee for permanent placements. If a placed candidate leaves within 90 days, we will find a replacement at no additional charge. This guarantee is subject to the terms in your engagement letter.",
                },
                {
                  title: "6. Intellectual Property",
                  content: "All content on this website, including text, graphics, and logos, is the property of JOBKREATORS and protected by applicable intellectual property laws. You may not use our content without written permission.",
                },
                {
                  title: "7. Limitation of Liability",
                  content: "JOBKREATORS shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services. Our liability is limited to the fees paid for the specific placement in dispute.",
                },
                {
                  title: "8. Governing Law",
                  content: "These Terms shall be governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Agra, Uttar Pradesh, India.",
                },
                {
                  title: "9. Contact",
                  content: "For questions about these Terms, contact us at Recruitment.Team@jobkreators.com or +91 7017132179.",
                },
              ].map((section) => (
                <div key={section.title}>
                  <h2 className="text-xl font-bold font-display text-text mb-3">{section.title}</h2>
                  <p className="text-text-muted leading-relaxed">{section.content}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
