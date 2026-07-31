import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import ApplicationForm from "@/components/jobs/ApplicationForm";

// Metadata lives in ./layout.tsx. This is the GENERAL CV landing — no specific
// job, so ApplicationForm runs with job={null} and submits as "unmatched-general".
export default function SubmitCvPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="min-h-screen pb-24 pt-28 md:pt-32">
        <Container size="narrow">
          <div className="mb-10 text-center">
            <Eyebrow className="justify-center" dot>
              100% FREE FOR CANDIDATES
            </Eyebrow>
            <h1 className="mt-3 font-display text-h1 md:text-h1-md">Submit your CV</h1>
            <p className="mx-auto mt-3 max-w-md text-body-lg text-text-muted">
              Not applying to a specific role? Share your details and we&apos;ll reach out when a
              matching opportunity opens up.
            </p>
          </div>

          <ApplicationForm job={null} />
        </Container>
      </main>
      <Footer />
    </>
  );
}
