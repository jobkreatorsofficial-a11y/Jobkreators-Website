import { NextResponse, after } from "next/server";
import { applicationSchema } from "@/lib/validators/public";
import { uploadCV, deleteCV, UploadError } from "@/lib/cloudinary/upload";
import { createApplication, getJob } from "@/db/queries";
import { sendEmail } from "@/lib/email/client";
import { applicationReceivedEmail } from "@/lib/email/templates/application-received";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { CITY_LABELS } from "@/lib/constants";

const RECRUITMENT_EMAIL = process.env.RECRUITMENT_EMAIL ?? "Recruitment.Team@jobkreators.com";

// POST /api/applications — candidate application (direct / chatbot / general).
// multipart/form-data: all application fields + a required `cvFile`.
export async function POST(request: Request) {
  // 1) Rate limit (5 / IP / hour).
  const rl = rateLimit(`apply:${clientIp(request)}`, 5, 60 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again in an hour." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  // 2) Parse multipart.
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart/form-data." }, { status: 400 });
  }

  const cvFile = form.get("cvFile");
  if (!(cvFile instanceof File) || cvFile.size === 0) {
    return NextResponse.json({ error: "A CV file is required.", fieldErrors: { cvFile: ["Attach your CV"] } }, { status: 400 });
  }

  // 3) Validate the text fields.
  const parsed = applicationSchema.safeParse({
    jobId: form.get("jobId"),
    jobSlug: form.get("jobSlug"),
    jobTitle: form.get("jobTitle"),
    jobCompany: form.get("jobCompany"),
    candidateName: form.get("candidateName"),
    candidateEmail: form.get("candidateEmail"),
    candidatePhone: form.get("candidatePhone"),
    candidateCity: form.get("candidateCity"),
    currentCompany: form.get("currentCompany"),
    currentRole: form.get("currentRole"),
    yearsOfExperience: form.get("yearsOfExperience"),
    currentSalaryLpa: form.get("currentSalaryLpa"),
    expectedSalaryLpa: form.get("expectedSalaryLpa"),
    noticePeriodDays: form.get("noticePeriodDays"),
    linkedinUrl: form.get("linkedinUrl"),
    portfolioUrl: form.get("portfolioUrl"),
    coverMessage: form.get("coverMessage"),
    source: form.get("source"),
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const data = parsed.data;

  // 4) If a jobId is given, it must be a real job.
  const job = data.jobId ? await getJob(data.jobId) : undefined;
  if (data.jobId && !job) {
    return NextResponse.json({ error: "That role no longer exists." }, { status: 404 });
  }

  // 5) Upload CV (throws UploadError → 413 / 415 / 500).
  const applicationId = crypto.randomUUID();
  let cv;
  try {
    cv = await uploadCV(cvFile, applicationId);
  } catch (err) {
    if (err instanceof UploadError) return NextResponse.json({ error: err.message }, { status: err.status });
    console.error("[applications] cv upload error", err);
    return NextResponse.json({ error: "Could not upload your CV. Please try again." }, { status: 500 });
  }

  // 6) Insert — roll the Cloudinary upload back if the DB write fails.
  let inserted;
  try {
    inserted = await createApplication({
      id: applicationId,
      ...data,
      cvFileUrl: cv.url,
      cvFileName: cvFile.name,
      internalNotes: null,
      status: "submitted",
    });
  } catch (err) {
    console.error("[applications] db insert failed, rolling back CV", err);
    await deleteCV(cv.publicId);
    return NextResponse.json({ error: "Something went wrong saving your application. Please try again." }, { status: 500 });
  }

  // 7) Notify recruitment after the response (guaranteed to run; never fails the request).
  after(async () => {
    const { subject, html, text } = applicationReceivedEmail({
      applicationId: inserted.id,
      candidateName: inserted.candidateName,
      candidateEmail: inserted.candidateEmail,
      candidatePhone: inserted.candidatePhone,
      candidateCity: CITY_LABELS[inserted.candidateCity],
      jobTitle: inserted.jobTitle,
      jobCompany: inserted.jobCompany,
      jobCities: job ? job.cities.map((c) => CITY_LABELS[c]) : [],
      source: inserted.source,
      yearsOfExperience: inserted.yearsOfExperience,
      currentRole: inserted.currentRole,
      currentCompany: inserted.currentCompany,
      currentSalaryLpa: inserted.currentSalaryLpa,
      expectedSalaryLpa: inserted.expectedSalaryLpa,
      noticePeriodDays: inserted.noticePeriodDays,
      linkedinUrl: inserted.linkedinUrl,
      portfolioUrl: inserted.portfolioUrl,
      coverMessage: inserted.coverMessage,
      cvUrl: inserted.cvFileUrl,
    });
    await sendEmail({ to: RECRUITMENT_EMAIL, subject, html, text });
  });

  return NextResponse.json({ applicationId: inserted.id, message: "Application submitted successfully" });
}
