// TODO Phase 2C: gate with Clerk requireAdmin()
import { NextResponse } from "next/server";
import { getStats } from "@/db/queries";
import { serverError } from "@/lib/api";

// GET /api/admin/stats — the 4 dashboard metrics in a single round-trip.
export async function GET() {
  try {
    return NextResponse.json(await getStats());
  } catch (err) {
    return serverError(err);
  }
}
