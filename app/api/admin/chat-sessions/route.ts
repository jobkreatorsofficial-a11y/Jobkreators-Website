// TODO Phase 2C: gate with Clerk requireAdmin()
import { NextResponse } from "next/server";
import { listChatSessions } from "@/db/queries";
import { serverError, numParam } from "@/lib/api";
import type { ChatSession } from "@/lib/schema";

const CHAT_STATUSES: ChatSession["status"][] = ["active", "cv-submitted", "closed"];

// GET /api/admin/chat-sessions — ?status &limit &offset
export async function GET(request: Request) {
  try {
    const sp = new URL(request.url).searchParams;
    const statusParam = sp.get("status");
    const status = CHAT_STATUSES.find((s) => s === statusParam);
    const rows = await listChatSessions({
      status,
      limit: numParam(sp.get("limit")),
      offset: numParam(sp.get("offset")),
    });
    return NextResponse.json(rows);
  } catch (err) {
    return serverError(err);
  }
}
