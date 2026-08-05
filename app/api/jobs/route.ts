import { NextResponse } from "next/server";
import { getActiveJobs } from "@/db/queries";

// Public list of active jobs — used by the ChatWidget (a client component that
// can't query the DB directly) for its recommendations. Not cached, so the
// chatbot sees admin-created jobs immediately.
export async function GET() {
  try {
    return NextResponse.json(await getActiveJobs());
  } catch (err) {
    console.error("[api/jobs]", err);
    return NextResponse.json({ error: "Could not load jobs" }, { status: 500 });
  }
}
