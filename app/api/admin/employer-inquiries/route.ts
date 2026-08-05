// No POST here — inquiries are created via the public /api/employer-inquiries
// endpoint in Phase 2C.
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api/admin-auth";
import { listEmployerInquiries } from "@/db/queries";
import { serverError, numParam, enumParam } from "@/lib/api";
import { EMPLOYER_INQUIRY_STATUSES } from "@/lib/constants";

// GET /api/admin/employer-inquiries — ?status &search &limit &offset
export async function GET(request: Request) {
  const gate = await requireAdmin();
  if ("error" in gate) return gate.error;
  try {
    const sp = new URL(request.url).searchParams;
    const rows = await listEmployerInquiries({
      status: enumParam(EMPLOYER_INQUIRY_STATUSES, sp.get("status")),
      search: sp.get("search") || undefined,
      limit: numParam(sp.get("limit")),
      offset: numParam(sp.get("offset")),
    });
    return NextResponse.json(rows);
  } catch (err) {
    return serverError(err);
  }
}
