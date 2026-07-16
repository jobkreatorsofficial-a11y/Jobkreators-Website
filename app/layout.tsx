import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import ThemeProvider from "@/components/ui/ThemeProvider";
import "./globals.css";

// Body font.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Display font — h1/h2, hero, all display moments (see --font-display token).
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://jobkreators.com";
const DESCRIPTION =
  "India's premium AI-powered recruitment and consultancy firm. 3,400+ placements, 242+ clients, 94% fulfillment rate. Pan-India hiring experts since 2019.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // No title.template: the existing inner pages already self-brand as
  // "<Page> — JOBKREATORS", so a parent template would double the brand on them.
  // The two client form pages get explicit titles via their route layouts.
  title: "JOBKREATORS — Hire Smarter. Hire in 72 Hours.",
  description: DESCRIPTION,
  keywords: ["recruitment", "hiring", "job placement", "consultancy", "talent acquisition", "India", "Agra"],
  alternates: { canonical: "/" },
  applicationName: "JOBKREATORS",
  // og:image + twitter:image are generated automatically from app/opengraph-image.tsx.
  openGraph: {
    type: "website",
    siteName: "JOBKREATORS",
    locale: "en_IN",
    url: SITE_URL,
    title: "JOBKREATORS — Hire Smarter. Hire in 72 Hours.",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "JOBKREATORS — Hire Smarter. Hire in 72 Hours.",
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Dual-theme brand (light default, dark alternative). next-themes writes
    // data-theme on <html> via a pre-paint script, so suppressHydrationWarning is
    // required here; the token system in globals.css swaps on that attribute.
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen overflow-x-hidden antialiased">
        <ThemeProvider>
          {/* Skip link — visible only on keyboard focus, jumps to <main id="main">. */}
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-surface-2 focus:px-4 focus:py-2 focus:text-body-sm focus:text-text focus:shadow-[var(--shadow-lg)] focus:outline-none focus:ring-2 focus:ring-ring"
          >
            Skip to content
          </a>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
