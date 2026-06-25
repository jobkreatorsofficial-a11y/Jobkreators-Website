import type { MetadataRoute } from "next";

// PWA manifest (Next 16 app/manifest.ts convention — auto-served at
// /manifest.webmanifest and auto-linked, so no metadata.manifest needed).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "JOBKREATORS — AI-Powered Recruitment",
    short_name: "JOBKREATORS",
    description:
      "India's premium AI-powered recruitment and consultancy firm. Hire smarter. Hire faster. In 72 hours.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      { src: "/brand/jk-mark-180.png", sizes: "180x180", type: "image/png" },
      { src: "/brand/jk-mark-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
