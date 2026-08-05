// TODO Phase 2C: gate with Clerk requireAdmin()
// No POST here — applications are created via the public /api/jobs/[slug]/apply
// endpoint in Phase 2C.
import { NextResponse } from "next/server";
import { listApplications } from "@/db/queries";
import { serverError, numParam, enumParam } from "@/lib/api";
import { APPLICATION_STATUSES } from "@/lib/constants";

// GET /api/admin/applications — ?status &jobId &search &dateFrom &dateTo &limit &offset
export async function GET(request: Request) {
  try {
    const sp = new URL(request.url).searchParams;
    const rows = await listApplications({
      status: enumParam(APPLICATION_STATUSES, sp.get("status")),
      jobId: sp.get("jobId") || undefined,
      search: sp.get("search") || undefined,
      dateFrom: sp.get("dateFrom") || undefined,
      dateTo: sp.get("dateTo") || undefined,
      limit: numParam(sp.get("limit")),
      offset: numParam(sp.get("offset")),
    });
    return NextResponse.json(rows);
  } catch (err) {
    return serverError(err);
  }
}
