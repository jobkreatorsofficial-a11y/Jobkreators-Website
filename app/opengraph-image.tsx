import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Default Open Graph / Twitter image for the whole site (root segment).
export const alt = "JOBKREATORS — Hire Smarter. Faster. In 72 Hours.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand tokens (literal here because the OG runtime has no access to CSS vars).
const BG = "#000000";
const CREAM = "#F4F5F0";
const ACCENT = "#7CD4EC";
const MUTED = "#A4B0C0";

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/brand/jk-lockup.png"), "base64");
  const logoSrc = `data:image/png;base64,${logo}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          padding: 72,
        }}
      >
        {/* Lockup on a refined cream tile (original colors stay legible on black). */}
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              background: CREAM,
              borderRadius: 20,
              padding: "28px 40px",
            }}
          >
            <img src={logoSrc} height={104} alt="JOBKREATORS" />
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 76,
            fontWeight: 700,
            color: CREAM,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
          }}
        >
          <div style={{ display: "flex" }}>Hire Smarter. Faster.</div>
          <div style={{ display: "flex" }}>
            In{" "}
            <span style={{ color: ACCENT, borderBottom: `8px solid ${ACCENT}`, marginLeft: 16 }}>
              72 Hours.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            color: MUTED,
            letterSpacing: "0.04em",
          }}
        >
          <span style={{ color: CREAM, fontWeight: 600 }}>jobkreators.com</span>
          <span>AI-POWERED RECRUITMENT</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
