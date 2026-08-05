import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api/admin-auth";
import { listChatSessions } from "@/db/queries";
import { serverError, numParam } from "@/lib/api";
import type { ChatSession } from "@/lib/schema";

const CHAT_STATUSES: ChatSession["status"][] = ["active", "cv-submitted", "closed"];

// GET /api/admin/chat-sessions — ?status &limit &offset
export async function GET(request: Request) {
  const gate = await requireAdmin();
  if ("error" in gate) return gate.error;
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
