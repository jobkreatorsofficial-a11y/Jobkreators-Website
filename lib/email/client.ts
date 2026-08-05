import { Resend } from "resend";

// Resend singleton. sendEmail() NEVER throws — a failed notification must not
// fail the candidate/employer submission it accompanies. Failures are logged
// with context and surfaced via the boolean return.

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = `JOBKREATORS <${process.env.RESEND_FROM_EMAIL ?? "careers@jobkreators.com"}>`;

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<boolean> {
  try {
    const { data, error } = await resend.emails.send({ from: FROM, to, subject, html, text });
    if (error) {
      console.error("[email] send failed", { to, subject, error });
      return false;
    }
    if (process.env.NODE_ENV === "development") {
      console.log("[email] sent", { to, subject, id: data?.id });
    }
    return true;
  } catch (err) {
    console.error("[email] send threw", { to, subject, err });
    return false;
  }
}
