import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import StatsBar from "@/components/home/StatsBar";
import ServicesGrid from "@/components/home/ServicesGrid";
import AIDashboard from "@/components/home/AIDashboard";
import ProcessSteps from "@/components/home/ProcessSteps";
import ClientLogos from "@/components/home/ClientLogos";
import Testimonials from "@/components/home/Testimonials";
import FounderSection from "@/components/home/FounderSection";
import CandidateCTA from "@/components/home/CandidateCTA";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StatsBar />
        <ServicesGrid />
        <AIDashboard />
        <ProcessSteps />
        <ClientLogos />
        <Testimonials />
        <FounderSection />
        <CandidateCTA />
      </main>
      <Footer />
    </>
  );
}
