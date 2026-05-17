import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — JOBKREATORS",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <section className="py-20 bg-white dark:bg-[#0A0A0A] min-h-screen">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-[#1D1D1F] dark:text-white mb-4">Privacy Policy</h1>
            <p className="text-[#6E6E73] dark:text-[#A1A1A6] mb-10">Last updated: May 2025</p>

            <div className="prose dark:prose-invert max-w-none space-y-8">
              {[
                {
                  title: "1. Information We Collect",
                  content: "We collect information you provide directly to us, such as your name, email address, phone number, resume/CV, and work history when you submit job applications or employer inquiries. We also automatically collect certain technical information when you visit our website, including IP address, browser type, and pages visited.",
                },
                {
                  title: "2. How We Use Your Information",
                  content: "We use the information we collect to match candidates with job opportunities, communicate with employers and candidates, improve our services, send you relevant job alerts (if opted in), and comply with legal obligations. We never sell your personal information to third parties.",
                },
                {
                  title: "3. Information Sharing",
                  content: "We share candidate profiles with potential employer clients only with your knowledge and in the context of a specific job opportunity. We do not share your information with any third parties for marketing purposes without your explicit consent.",
                },
                {
                  title: "4. Data Security",
                  content: "We implement industry-standard security measures to protect your personal information. All data is transmitted via SSL/TLS encryption. We conduct regular security assessments and limit access to your data to authorized personnel only.",
                },
                {
                  title: "5. Cookies",
                  content: "Our website uses essential cookies for basic functionality. We use analytics cookies to understand how visitors use our site. You can control cookie settings through your browser. We do not use advertising or tracking cookies.",
                },
                {
                  title: "6. Your Rights",
                  content: "You have the right to access, correct, or delete your personal information at any time. To exercise these rights, contact us at Recruitment.Team@jobkreators.com. We will respond to all requests within 30 days.",
                },
                {
                  title: "7. Data Retention",
                  content: "We retain candidate information for up to 2 years to match you with future opportunities, unless you request deletion earlier. Employer information is retained for the duration of our business relationship.",
                },
                {
                  title: "8. Contact Us",
                  content: "If you have questions about this Privacy Policy, please contact us at Recruitment.Team@jobkreators.com or call +91 7017132179.",
                },
              ].map((section) => (
                <div key={section.title}>
                  <h2 className="text-xl font-bold text-[#1D1D1F] dark:text-white mb-3">{section.title}</h2>
                  <p className="text-[#6E6E73] dark:text-[#A1A1A6] leading-relaxed">{section.content}</p>
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
