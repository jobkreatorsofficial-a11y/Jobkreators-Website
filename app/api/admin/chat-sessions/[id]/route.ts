import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api/admin-auth";
import { getChatSession } from "@/db/queries";
import { notFound, serverError } from "@/lib/api";

// GET /api/admin/chat-sessions/[id]
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const gate = await requireAdmin();
  if ("error" in gate) return gate.error;
  const { id } = await params;
  try {
    const session = await getChatSession(id);
    return session ? NextResponse.json(session) : notFound("Chat session not found");
  } catch (err) {
    return serverError(err);
  }
}
