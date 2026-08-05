// The admin allowlist — a comma-separated ADMIN_ALLOWED_EMAILS env var so the
// set of authorized admins can change without a code push. Shared by the proxy
// (page + API gating) and the API-route requireAdmin() helper. No Clerk import
// here so it's safe to use from the proxy runtime.

export function getAllowedEmails(): string[] {
  return (process.env.ADMIN_ALLOWED_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAllowedEmails().includes(email.toLowerCase());
}
