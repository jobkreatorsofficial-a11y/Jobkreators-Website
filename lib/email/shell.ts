// Shared, inline-styled email chrome — JOBKREATORS brand (cream page, white card,
// navy header/text, cyan accents). No <style> blocks or external CSS (Gmail /
// Outlook / mobile strip them); every rule is an inline style attribute.

export const SITE_URL = "https://jobkreators.com";
const NAVY = "#152A37";
const CYAN = "#1C7C99";
const CREAM = "#F4F5F0";
const PAGE = "#EAEBE4";
const BORDER = "#E2E4DD";
const TEXT = "#152A37";
const MUTED = "#5B6B73";

/** Escape a user-supplied string for safe interpolation into HTML. */
export function esc(s: string | null | undefined): string {
  if (!s) return "";
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** A label/value definition row. `value` may contain trusted HTML (buttons/links). */
export function row(label: string, valueHtml: string): string {
  return `<tr>
    <td style="padding:8px 0;border-bottom:1px solid ${BORDER};vertical-align:top;width:170px;color:${MUTED};font-size:13px;">${esc(label)}</td>
    <td style="padding:8px 0;border-bottom:1px solid ${BORDER};vertical-align:top;color:${TEXT};font-size:14px;">${valueHtml}</td>
  </tr>`;
}

export function button(label: string, href: string): string {
  return `<a href="${esc(href)}" style="display:inline-block;background:${CYAN};color:#ffffff;text-decoration:none;font-size:14px;font-weight:bold;padding:11px 20px;border-radius:8px;">${esc(label)}</a>`;
}

export function link(label: string, href: string): string {
  return `<a href="${esc(href)}" style="color:${CYAN};text-decoration:underline;">${esc(label)}</a>`;
}

export function badge(label: string, tone: "cyan" | "amber" | "red" = "cyan"): string {
  const bg = tone === "red" ? "#FBE9E7" : tone === "amber" ? "#FDF0DC" : "#E4F1F5";
  const fg = tone === "red" ? "#B23A2E" : tone === "amber" ? "#8A5A11" : CYAN;
  return `<span style="display:inline-block;background:${bg};color:${fg};font-size:12px;font-weight:bold;padding:3px 10px;border-radius:999px;">${esc(label)}</span>`;
}

export function sectionTitle(label: string): string {
  return `<p style="margin:22px 0 6px;font-size:12px;font-weight:bold;letter-spacing:.08em;text-transform:uppercase;color:${MUTED};">${esc(label)}</p>`;
}

/** Wrap content in the branded card. `contentHtml` is trusted composed HTML. */
export function emailShell(opts: { heading: string; contentHtml: string; footerHtml: string }): string {
  return `<!doctype html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${PAGE};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAGE};">
    <tr><td align="center" style="padding:24px 12px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background:#ffffff;border:1px solid ${BORDER};border-radius:14px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;">
        <tr><td style="background:${NAVY};padding:20px 28px;">
          <img src="${SITE_URL}/brand/jk-lockup-dark.png" alt="JOBKREATORS" height="26" style="height:26px;display:block;border:0;" />
        </td></tr>
        <tr><td style="padding:26px 28px 8px;">
          <h1 style="margin:0;font-size:19px;line-height:1.3;color:${TEXT};">${esc(opts.heading)}</h1>
        </td></tr>
        <tr><td style="padding:0 28px 26px;color:${TEXT};">${opts.contentHtml}</td></tr>
        <tr><td style="padding:18px 28px;background:${CREAM};border-top:1px solid ${BORDER};color:${MUTED};font-size:12px;line-height:1.6;">${opts.footerHtml}</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
