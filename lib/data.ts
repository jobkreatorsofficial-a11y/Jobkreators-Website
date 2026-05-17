export const SITE = {
  name: "JOBKREATORS",
  tagline: "Hire smarter. Hire in 72 hours.",
  domain: "jobkreators.com",
  founded: 2019,
  hq: "Agra, India",
  phone: "+91 7017132179",
  whatsapp: "+917017132179",
  email: "Recruitment.Team@jobkreators.com",
  linkedin: "https://www.linkedin.com/in/jobkreators-recruitment-and-consultancy-7b4395179/",
  instagram: "https://instagram.com/job_kreators",
} as const;

export const STATS = [
  { value: 3400, suffix: "+", label: "Placements Made" },
  { value: 242, suffix: "+", label: "Clients Served" },
  { value: 94, suffix: "%", label: "Fulfillment Rate" },
  { value: 8, prefix: "", suffix: " Days", label: "Avg. Time-to-Hire" },
  { value: 30, suffix: "+", label: "Team Members" },
  { value: 6, suffix: "+", label: "Years in Business" },
] as const;

export const SERVICES = [
  {
    id: "permanent",
    title: "Permanent Recruitment",
    description: "End-to-end hiring for full-time roles across functions — from screening to offer negotiation.",
    icon: "Users",
    color: "#0066FF",
  },
  {
    id: "bulk",
    title: "Bulk & Volume Hiring",
    description: "Scale your workforce fast. We deliver hundreds of qualified hires in compressed timelines.",
    icon: "Zap",
    color: "#6366F1",
  },
  {
    id: "tech",
    title: "Tech & Engineering Hiring",
    description: "Specialized sourcing for software engineers, data scientists, DevOps, and product teams.",
    icon: "Code2",
    color: "#06B6D4",
  },
  {
    id: "non-tech",
    title: "Non-Tech Hiring",
    description: "Sales, Marketing, Finance, HR, Legal and Operations — every function, every level.",
    icon: "Briefcase",
    color: "#8B5CF6",
  },
  {
    id: "career",
    title: "Career Counseling",
    description: "Personalized guidance for job seekers to identify the right roles and land their dream job.",
    icon: "GraduationCap",
    color: "#F59E0B",
  },
] as const;

export const INDUSTRIES = [
  "Technology / SaaS",
  "Banking & Finance",
  "Healthcare & Pharma",
  "Manufacturing",
  "Retail & D2C",
  "EdTech & Education",
  "Real Estate",
  "Media & Advertising",
  "FMCG",
  "Logistics",
  "Insurance",
  "Legal",
] as const;

export const PROCESS = [
  {
    step: "01",
    title: "Screening",
    description: "We rigorously screen quality candidates against your exact role requirements.",
  },
  {
    step: "02",
    title: "Sourcing",
    description: "Proprietary AI engine sources matched talent from a network of 500,000+ professionals.",
  },
  {
    step: "03",
    title: "Follow-Up",
    description: "Dedicated relationship managers follow up to keep candidates warm and engaged.",
  },
  {
    step: "04",
    title: "Retention",
    description: "We don't stop at offer acceptance — we ensure candidates join and stay with you.",
  },
] as const;

export const TESTIMONIALS = [
  {
    quote: "I am incredibly grateful for the exceptional service provided by JOBKREATORS. Their dedicated team demonstrated unparalleled expertise in matching my skills and aspirations with the perfect job opportunity.",
    name: "Team Leader",
    company: "EduBridge Learning",
    avatar: "TL",
  },
  {
    quote: "From the initial consultation to the final offer, their commitment to excellence was evident. Thanks to their personalized approach and extensive network, I landed a role beyond my expectations.",
    name: "Customer Support Lead",
    company: "Medvarsity",
    avatar: "CS",
  },
  {
    quote: "The personalized guidance and support I received throughout the recruitment process were instrumental in securing a role that perfectly matches my skills and ambitions. JOBKREATORS truly goes above and beyond.",
    name: "Business Development Executive",
    company: "Zell Education",
    avatar: "BD",
  },
] as const;

export const CLIENTS = [
  { name: "Scaler Academy", abbr: "SC" },
  { name: "Great Learning", abbr: "GL" },
  { name: "upGrad", abbr: "UG" },
  { name: "UNIVO Education", abbr: "UN" },
  { name: "Interview Kickstart", abbr: "IK" },
  { name: "Emeritus", abbr: "EM" },
] as const;

export const FOUNDER = {
  name: "Akarsh Sharma",
  title: "Founder & Director",
  story:
    "I saw how broken the hiring process was — for companies stuck in lengthy cycles and for job seekers deserving better opportunities. So in 2019, I built JOBKREATORS to fix it: a firm that combines AI-powered matching with real human intelligence to connect the right talent with the right company, every time.",
  background: "MBA in International Business · Electronics Distribution Leader · Serial Entrepreneur",
  photo: "/founder.jpg",
} as const;

export const NAV_LINKS = [
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Jobs", href: "/jobs" },
  { label: "Contact", href: "/contact" },
] as const;

export const AI_CLAIMS = [
  "Proprietary AI Engine",
  "Intelligent Candidate Matching",
  "AI + Human-Curated Shortlists",
  "Global Talent Network",
] as const;
