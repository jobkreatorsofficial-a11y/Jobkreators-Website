import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api/admin-auth";
import { getStats } from "@/db/queries";
import { serverError } from "@/lib/api";

// GET /api/admin/stats — the 4 dashboard metrics in a single round-trip.
export async function GET() {
  const gate = await requireAdmin();
  if ("error" in gate) return gate.error;
  try {
    return NextResponse.json(await getStats());
  } catch (err) {
    return serverError(err);
  }
}
