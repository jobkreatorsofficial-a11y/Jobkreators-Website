import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api/admin-auth";
import { listJobs, insertJob } from "@/db/queries";
import { createJobSchema } from "@/lib/validators/admin";
import { badRequest, serverError, numParam, enumParam } from "@/lib/api";
import { JOB_STATUSES, DEPARTMENTS, CITIES } from "@/lib/constants";

// GET /api/admin/jobs — list with ?status &department &city &search &limit &offset
export async function GET(request: Request) {
  const gate = await requireAdmin();
  if ("error" in gate) return gate.error;
  try {
    const sp = new URL(request.url).searchParams;
    const rows = await listJobs({
      status: enumParam(JOB_STATUSES, sp.get("status")),
      department: enumParam(DEPARTMENTS, sp.get("department")),
      city: enumParam(CITIES, sp.get("city")),
      search: sp.get("search") || undefined,
      limit: numParam(sp.get("limit")),
      offset: numParam(sp.get("offset")),
    });
    return NextResponse.json(rows);
  } catch (err) {
    return serverError(err);
  }
}

// POST /api/admin/jobs — create a job.
export async function POST(request: Request) {
  const gate = await requireAdmin();
  if ("error" in gate) return gate.error;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }
  const parsed = createJobSchema.safeParse(body);
  if (!parsed.success) return badRequest("Validation failed", parsed.error.flatten());
  try {
    const job = await insertJob(parsed.data);
    return NextResponse.json(job, { status: 201 });
  } catch (err) {
    return serverError(err);
  }
}
