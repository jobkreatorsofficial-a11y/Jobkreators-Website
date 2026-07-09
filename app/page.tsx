import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import StatsBar from "@/components/home/StatsBar";
import ServicesGrid from "@/components/home/ServicesGrid";
import AIDashboard from "@/components/home/AIDashboard";
import ProcessSteps from "@/components/home/ProcessSteps";
import LogoWall from "@/components/home/LogoWall";
import Testimonials from "@/components/home/Testimonials";
import FounderSection from "@/components/home/FounderSection";
import CandidateCTA from "@/components/home/CandidateCTA";
import JsonLd from "@/components/JsonLd";
import { SITE, FOUNDER } from "@/lib/data";

const SITE_URL = "https://jobkreators.com";

// Organization + LocalBusiness structured data (Agra HQ).
const ORG_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "JOBKREATORS",
      legalName: "JOBKREATORS Recruitment and Consultancy",
      url: SITE_URL,
      logo: `${SITE_URL}/brand/jk-lockup-light.png`,
      description:
        "India's premium AI-powered recruitment and consultancy firm. Pan-India hiring experts since 2019.",
      foundingDate: "2019",
      founder: { "@type": "Person", name: FOUNDER.name },
      email: SITE.email,
      telephone: SITE.phone,
      sameAs: [SITE.linkedin, SITE.instagram],
    },
    {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#localbusiness`,
      name: "JOBKREATORS",
      url: SITE_URL,
      image: `${SITE_URL}/brand/jk-lockup-light.png`,
      email: SITE.email,
      telephone: SITE.phone,
      priceRange: "Free for candidates",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Agra",
        addressRegion: "Uttar Pradesh",
        addressCountry: "IN",
      },
      parentOrganization: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={ORG_SCHEMA} />
      <Navbar />
      <main id="main">
        <Hero />
        <StatsBar />
        <ServicesGrid />
        <AIDashboard />
        <ProcessSteps />
        <LogoWall />
        <Testimonials />
        <FounderSection />
        <CandidateCTA />
      </main>
      <Footer />
    </>
  );
}
