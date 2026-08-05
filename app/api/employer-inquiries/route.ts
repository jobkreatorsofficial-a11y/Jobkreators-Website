import { NextResponse, after } from "next/server";
import { employerInquirySchema } from "@/lib/validators/public";
import { uploadJD, deleteJD, UploadError } from "@/lib/cloudinary/upload";
import { createEmployerInquiry } from "@/db/queries";
import { sendEmail } from "@/lib/email/client";
import { employerInquiryReceivedEmail } from "@/lib/email/templates/employer-inquiry-received";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { DEPARTMENT_LABELS, CITY_LABELS, JOB_TYPE_LABELS } from "@/lib/constants";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@jobkreators.com";

// POST /api/employer-inquiries — employer intake. Accepts multipart/form-data
// (JD as an uploaded file) OR JSON (JD as pasted text). Exactly one of jdText /
// jdFile is required.
export async function POST(request: Request) {
  // 1) Rate limit (3 / IP / hour).
  const rl = rateLimit(`inquiry:${clientIp(request)}`, 3, 60 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again in an hour." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  // 2) Parse — multipart (with a JD file) or JSON (text only).
  const ct = request.headers.get("content-type") ?? "";
  let fields: Record<string, unknown>;
  let jdFile: File | null = null;
  try {
    if (ct.includes("multipart/form-data")) {
      const form = await request.formData();
      const f = form.get("jdFile");
      jdFile = f instanceof File && f.size > 0 ? f : null;
      fields = Object.fromEntries(
        [
          "companyName", "companyWebsite", "contactPerson", "contactEmail", "contactPhone",
          "designation", "roleTitle", "department", "city", "type", "minYears", "maxYears",
          "minSalaryLpa", "maxSalaryLpa", "openings", "jdText", "additionalNotes",
        ].map((k) => [k, form.get(k)]),
      );
    } else {
      fields = (await request.json()) as Record<string, unknown>;
    }
  } catch {
    return NextResponse.json({ error: "Could not parse the request body." }, { status: 400 });
  }

  // 3) Validate the text fields.
  const parsed = employerInquirySchema.safeParse(fields);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const data = parsed.data;

  // 4) Exactly one of jdText / jdFile.
  const hasText = !!data.jdText;
  if (hasText === !!jdFile) {
    return NextResponse.json(
      { error: "Provide the job description as either pasted text OR an uploaded file (exactly one)." },
      { status: 400 },
    );
  }

  const inquiryId = crypto.randomUUID();

  // 5) Upload the JD file if present.
  let jd: { url: string; publicId: string } | null = null;
  if (jdFile) {
    try {
      jd = await uploadJD(jdFile, inquiryId);
    } catch (err) {
      if (err instanceof UploadError) return NextResponse.json({ error: err.message }, { status: err.status });
      console.error("[employer-inquiries] jd upload error", err);
      return NextResponse.json({ error: "Could not upload the JD. Please try again." }, { status: 500 });
    }
  }

  // 6) Insert — roll back any uploaded JD if the DB write fails.
  let inserted;
  try {
    inserted = await createEmployerInquiry({
      id: inquiryId,
      ...data,
      jdText: jdFile ? null : data.jdText,
      jdFileUrl: jd?.url ?? null,
      status: "new",
    });
  } catch (err) {
    console.error("[employer-inquiries] db insert failed, rolling back JD", err);
    if (jd) await deleteJD(jd.publicId);
    return NextResponse.json({ error: "Something went wrong saving your inquiry. Please try again." }, { status: 500 });
  }

  // 7) Notify admin after the response.
  after(async () => {
    const { subject, html, text } = employerInquiryReceivedEmail({
      inquiryId: inserted.id,
      companyName: inserted.companyName,
      companyWebsite: inserted.companyWebsite,
      contactPerson: inserted.contactPerson,
      designation: inserted.designation,
      contactEmail: inserted.contactEmail,
      contactPhone: inserted.contactPhone,
      roleTitle: inserted.roleTitle,
      department: DEPARTMENT_LABELS[inserted.department],
      city: CITY_LABELS[inserted.city],
      type: JOB_TYPE_LABELS[inserted.type],
      minYears: inserted.minYears,
      maxYears: inserted.maxYears,
      minSalaryLpa: inserted.minSalaryLpa,
      maxSalaryLpa: inserted.maxSalaryLpa,
      openings: inserted.openings,
      jdText: inserted.jdText,
      jdUrl: inserted.jdFileUrl,
      additionalNotes: inserted.additionalNotes,
    });
    await sendEmail({ to: ADMIN_EMAIL, subject, html, text });
  });

  return NextResponse.json({ inquiryId: inserted.id, message: "Inquiry submitted successfully" });
}
