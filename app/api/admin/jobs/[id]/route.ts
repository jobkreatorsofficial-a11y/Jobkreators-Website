// TODO Phase 2C: gate with Clerk requireAdmin()
import { NextResponse } from "next/server";
import { getJob, patchJob, removeJob } from "@/db/queries";
import { updateJobSchema } from "@/lib/validators/admin";
import { badRequest, notFound, serverError } from "@/lib/api";

// GET /api/admin/jobs/[id]
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const job = await getJob(id);
    return job ? NextResponse.json(job) : notFound("Job not found");
  } catch (err) {
    return serverError(err);
  }
}

// PATCH /api/admin/jobs/[id] — partial update (also used for status toggles).
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }
  const parsed = updateJobSchema.safeParse(body);
  if (!parsed.success) return badRequest("Validation failed", parsed.error.flatten());
  try {
    const job = await patchJob(id, parsed.data);
    return job ? NextResponse.json(job) : notFound("Job not found");
  } catch (err) {
    return serverError(err);
  }
}

// DELETE /api/admin/jobs/[id] — hard delete. Applications keep null jobId (FK SET NULL).
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await removeJob(id);
    return NextResponse.json({ deleted: id });
  } catch (err) {
    return serverError(err);
  }
}
