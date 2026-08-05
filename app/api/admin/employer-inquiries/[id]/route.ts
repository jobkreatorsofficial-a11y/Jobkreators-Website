// TODO Phase 2C: gate with Clerk requireAdmin()
import { NextResponse } from "next/server";
import { getEmployerInquiry, patchInquiryStatus, removeInquiry } from "@/db/queries";
import { updateInquiryStatusSchema } from "@/lib/validators/admin";
import { badRequest, notFound, serverError } from "@/lib/api";

// GET /api/admin/employer-inquiries/[id]
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const inquiry = await getEmployerInquiry(id);
    return inquiry ? NextResponse.json(inquiry) : notFound("Inquiry not found");
  } catch (err) {
    return serverError(err);
  }
}

// PATCH /api/admin/employer-inquiries/[id] — status update.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }
  const parsed = updateInquiryStatusSchema.safeParse(body);
  if (!parsed.success) return badRequest("Validation failed", parsed.error.flatten());
  try {
    const inquiry = await patchInquiryStatus(id, parsed.data.status);
    return inquiry ? NextResponse.json(inquiry) : notFound("Inquiry not found");
  } catch (err) {
    return serverError(err);
  }
}

// DELETE /api/admin/employer-inquiries/[id]
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await removeInquiry(id);
    return NextResponse.json({ deleted: id });
  } catch (err) {
    return serverError(err);
  }
}
