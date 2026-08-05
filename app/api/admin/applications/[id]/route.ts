import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api/admin-auth";
import { getApplication, patchApplication } from "@/db/queries";
import { updateApplicationSchema } from "@/lib/validators/admin";
import { badRequest, notFound, serverError } from "@/lib/api";

// GET /api/admin/applications/[id]
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const gate = await requireAdmin();
  if ("error" in gate) return gate.error;
  const { id } = await params;
  try {
    const app = await getApplication(id);
    return app ? NextResponse.json(app) : notFound("Application not found");
  } catch (err) {
    return serverError(err);
  }
}

// PATCH /api/admin/applications/[id] — status update and/or internal note.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const gate = await requireAdmin();
  if ("error" in gate) return gate.error;
  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }
  const parsed = updateApplicationSchema.safeParse(body);
  if (!parsed.success) return badRequest("Validation failed", parsed.error.flatten());
  try {
    // Map the API's `internalNote` onto the DB column `internalNotes`.
    const app = await patchApplication(id, {
      status: parsed.data.status,
      internalNotes: parsed.data.internalNote,
    });
    return app ? NextResponse.json(app) : notFound("Application not found");
  } catch (err) {
    return serverError(err);
  }
}
