import { emailShell, row, button, link, badge, sectionTitle, esc, SITE_URL } from "../shell";

export type ApplicationEmailData = {
  applicationId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  candidateCity: string; // display label
  jobTitle: string | null;
  jobCompany: string | null;
  jobCities: string[]; // display labels (empty for a general submission)
  source: "direct" | "chatbot" | "unmatched-general";
  yearsOfExperience: number;
  currentRole: string | null;
  currentCompany: string | null;
  currentSalaryLpa: number | null;
  expectedSalaryLpa: number | null;
  noticePeriodDays: number | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  coverMessage: string | null;
  cvUrl: string;
};

const SOURCE_LABEL: Record<ApplicationEmailData["source"], string> = {
  direct: "Direct",
  chatbot: "Chatbot",
  "unmatched-general": "General",
};

const lpa = (n: number | null) => (n != null ? `₹${n} LPA` : "—");

export function applicationReceivedEmail(d: ApplicationEmailData): { subject: string; html: string; text: string } {
  const roleLine = d.jobTitle ? `${d.jobTitle} at ${d.jobCompany ?? ""}`.trim() : "General submission (no specific role)";
  const subject = `New application: ${d.candidateName} for ${d.jobTitle ?? "General submission"}`;
  const adminUrl = `${SITE_URL}/admin/applications/${d.applicationId}`;

  const current = d.currentRole
    ? `${esc(d.currentRole)}${d.currentCompany ? ` at ${esc(d.currentCompany)}` : ""}`
    : "—";
  const links =
    [
      d.linkedinUrl ? link("LinkedIn", d.linkedinUrl) : "",
      d.portfolioUrl ? link("Portfolio", d.portfolioUrl) : "",
    ]
      .filter(Boolean)
      .join(" &nbsp;·&nbsp; ") || "—";

  const content = `
    <p style="margin:6px 0 18px;font-size:14px;color:#5B6B73;">
      Applied for <strong style="color:#152A37;">${esc(roleLine)}</strong>
      ${d.jobCities.length ? ` &nbsp;·&nbsp; ${esc(d.jobCities.join(", "))}` : ""}
      &nbsp; ${badge(SOURCE_LABEL[d.source])}
    </p>

    ${sectionTitle("Candidate")}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row("Name", esc(d.candidateName))}
      ${row("Email", link(d.candidateEmail, `mailto:${d.candidateEmail}`))}
      ${row("Phone", link(d.candidatePhone, `tel:${d.candidatePhone}`))}
      ${row("City", esc(d.candidateCity))}
    </table>

    ${sectionTitle("Experience")}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row("Total experience", `${d.yearsOfExperience} yrs`)}
      ${row("Current", current)}
    </table>

    ${sectionTitle("Compensation")}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row("Current salary", lpa(d.currentSalaryLpa))}
      ${row("Expected salary", lpa(d.expectedSalaryLpa))}
      ${row("Notice period", d.noticePeriodDays != null ? `${d.noticePeriodDays} days` : "—")}
      ${row("Links", links)}
    </table>

    ${
      d.coverMessage
        ? `${sectionTitle("Cover message")}<p style="margin:0;font-size:14px;line-height:1.6;color:#152A37;white-space:pre-line;">${esc(d.coverMessage)}</p>`
        : ""
    }

    <div style="margin:26px 0 6px;">${button("Download CV", d.cvUrl)}</div>
  `;

  const footer = `View in admin: ${link(adminUrl, adminUrl)}`;

  const html = emailShell({ heading: "New application received", contentHtml: content, footerHtml: footer });

  const text = [
    `New application: ${d.candidateName} for ${d.jobTitle ?? "General submission"}`,
    ``,
    `Applied for: ${roleLine}${d.jobCities.length ? ` (${d.jobCities.join(", ")})` : ""}`,
    `Source: ${SOURCE_LABEL[d.source]}`,
    ``,
    `Candidate: ${d.candidateName}`,
    `Email: ${d.candidateEmail}`,
    `Phone: ${d.candidatePhone}`,
    `City: ${d.candidateCity}`,
    ``,
    `Experience: ${d.yearsOfExperience} yrs`,
    `Current: ${d.currentRole ?? "—"}${d.currentCompany ? ` at ${d.currentCompany}` : ""}`,
    `Current salary: ${lpa(d.currentSalaryLpa)}`,
    `Expected salary: ${lpa(d.expectedSalaryLpa)}`,
    `Notice period: ${d.noticePeriodDays != null ? `${d.noticePeriodDays} days` : "—"}`,
    d.linkedinUrl ? `LinkedIn: ${d.linkedinUrl}` : "",
    d.portfolioUrl ? `Portfolio: ${d.portfolioUrl}` : "",
    d.coverMessage ? `\nCover message:\n${d.coverMessage}` : "",
    ``,
    `CV: ${d.cvUrl}`,
    `View in admin: ${adminUrl}`,
  ]
    .filter((l) => l !== "")
    .join("\n");

  return { subject, html, text };
}
