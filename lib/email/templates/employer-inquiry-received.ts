import { emailShell, row, button, link, sectionTitle, esc, SITE_URL } from "../shell";

export type EmployerEmailData = {
  inquiryId: string;
  companyName: string;
  companyWebsite: string | null;
  contactPerson: string;
  designation: string;
  contactEmail: string;
  contactPhone: string;
  roleTitle: string;
  department: string; // display label
  city: string; // display label
  type: string; // display label
  minYears: number;
  maxYears: number;
  minSalaryLpa: number | null;
  maxSalaryLpa: number | null;
  openings: number;
  jdText: string | null;
  jdUrl: string | null;
  additionalNotes: string | null;
};

const salaryRange = (min: number | null, max: number | null) =>
  min != null && max != null ? `₹${min}–${max} LPA` : "Competitive";

export function employerInquiryReceivedEmail(d: EmployerEmailData): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `New employer inquiry: ${d.companyName} — ${d.roleTitle}`;
  const adminUrl = `${SITE_URL}/admin/employer-inquiries/${d.inquiryId}`;
  const confidential =
    /confidential/i.test(d.additionalNotes ?? "") || /confidential/i.test(d.companyName);

  const banner = confidential
    ? `<div style="margin:6px 0 18px;padding:12px 14px;background:#FBE9E7;border:1px solid #F0C4BE;border-radius:8px;color:#B23A2E;font-size:13px;font-weight:bold;">
        🔒 Confidential search — do not disclose the company to candidates.
      </div>`
    : "";

  const jdBlock = d.jdUrl
    ? `<div style="margin:8px 0 4px;">${button("Download JD", d.jdUrl)}</div>`
    : d.jdText
      ? `<p style="margin:0;font-size:14px;line-height:1.6;color:#152A37;white-space:pre-line;">${esc(d.jdText)}</p>`
      : `<p style="margin:0;color:#5B6B73;font-size:14px;">No JD provided.</p>`;

  const content = `
    ${banner}
    <p style="margin:6px 0 18px;font-size:14px;color:#5B6B73;">
      <strong style="color:#152A37;">${esc(d.roleTitle)}</strong> · ${esc(d.openings.toString())} opening${d.openings === 1 ? "" : "s"}
    </p>

    ${sectionTitle("Company & contact")}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row("Company", esc(d.companyName))}
      ${row("Website", d.companyWebsite ? link(d.companyWebsite.replace(/^https?:\/\//, ""), d.companyWebsite) : "—")}
      ${row("Contact", `${esc(d.contactPerson)} · ${esc(d.designation)}`)}
      ${row("Email", link(d.contactEmail, `mailto:${d.contactEmail}`))}
      ${row("Phone", link(d.contactPhone, `tel:${d.contactPhone}`))}
    </table>

    ${sectionTitle("Role")}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row("Title", esc(d.roleTitle))}
      ${row("Department", esc(d.department))}
      ${row("Location", esc(d.city))}
      ${row("Type", esc(d.type))}
      ${row("Experience", `${d.minYears}–${d.maxYears} yrs`)}
      ${row("Salary", salaryRange(d.minSalaryLpa, d.maxSalaryLpa))}
      ${row("Openings", d.openings.toString())}
    </table>

    ${sectionTitle("Job description")}
    ${jdBlock}

    ${
      d.additionalNotes
        ? `${sectionTitle("Additional notes")}<p style="margin:0;font-size:14px;line-height:1.6;color:#152A37;white-space:pre-line;">${esc(d.additionalNotes)}</p>`
        : ""
    }
  `;

  const footer = `View in admin: ${link(adminUrl, adminUrl)}`;
  const html = emailShell({ heading: "New employer inquiry", contentHtml: content, footerHtml: footer });

  const text = [
    subject,
    confidential ? "\n*** CONFIDENTIAL SEARCH — do not disclose company to candidates ***" : "",
    ``,
    `Company: ${d.companyName}`,
    d.companyWebsite ? `Website: ${d.companyWebsite}` : "",
    `Contact: ${d.contactPerson} (${d.designation})`,
    `Email: ${d.contactEmail}`,
    `Phone: ${d.contactPhone}`,
    ``,
    `Role: ${d.roleTitle}`,
    `Department: ${d.department}`,
    `Location: ${d.city}`,
    `Type: ${d.type}`,
    `Experience: ${d.minYears}–${d.maxYears} yrs`,
    `Salary: ${salaryRange(d.minSalaryLpa, d.maxSalaryLpa)}`,
    `Openings: ${d.openings}`,
    ``,
    d.jdUrl ? `JD file: ${d.jdUrl}` : d.jdText ? `JD:\n${d.jdText}` : "No JD provided.",
    d.additionalNotes ? `\nAdditional notes:\n${d.additionalNotes}` : "",
    ``,
    `View in admin: ${adminUrl}`,
  ]
    .filter((l) => l !== "")
    .join("\n");

  return { subject, html, text };
}
