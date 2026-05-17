import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "JOBKREATORS — Hire Smarter. Hire in 72 Hours.",
  description:
    "India's premium AI-powered recruitment and consultancy firm. 3400+ placements, 242+ clients, 94% fulfillment rate. Pan-India hiring experts since 2019.",
  keywords: "recruitment, hiring, job placement, consultancy, talent acquisition, India, Agra",
  openGraph: {
    title: "JOBKREATORS — Hire Smarter. Hire in 72 Hours.",
    description: "India's premium AI-powered recruitment firm with 3400+ placements.",
    url: "https://jobkreators.com",
    siteName: "JOBKREATORS",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
