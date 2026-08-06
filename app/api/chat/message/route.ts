import { NextResponse } from "next/server";
import { getActiveJobs, saveChatSession } from "@/db/queries";
import { chatWithGemini, type ChatTurn } from "@/lib/gemini/client";
import { rateLimit } from "@/lib/rate-limit";
import type { Job, ChatMessage, ChatSession } from "@/lib/schema";

// POST { sessionId, message, history } → Gemini reply + server-matched job cards.
export async function POST(request: Request) {
  let body: { sessionId?: string; message?: string; history?: ChatTurn[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { sessionId, message, history = [] } = body;
  if (!sessionId || typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "sessionId and message are required" }, { status: 400 });
  }

  // Rate limit: 20 messages / session / hour.
  const rl = rateLimit(`chat:${sessionId}`, 20, 60 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json({ error: "Message limit reached for now — please continue later." }, { status: 429 });
  }

  // Active jobs power both the Gemini context and server-side recommendation.
  const active = await getActiveJobs();
  const jobsLite = active.map((j) => ({
    id: j.id,
    title: j.title,
    company: j.company,
    cities: j.cities,
    minYears: j.minYears,
    maxYears: j.maxYears,
    minSalaryLpa: j.minSalaryLpa,
    maxSalaryLpa: j.maxSalaryLpa,
  }));

  const reply = await chatWithGemini(history.slice(-12), message.slice(0, 1000), jobsLite);

  // Hydrate the recommended IDs into real jobs (valid ids only, max 3) — never
  // trust Gemini to invent a job.
  const byId = new Map(active.map((j) => [j.id, j]));
  const jobs: Job[] = reply.job_recommendations
    .map((id) => byId.get(id))
    .filter((j): j is Job => Boolean(j))
    .slice(0, 3);

  // Persist the conversation — never fail the reply on a DB hiccup.
  try {
    const now = new Date().toISOString();
    const messages: ChatMessage[] = [
      ...history.map((h, i) => ({ id: `h${i}`, role: h.role, content: h.content, timestamp: now })),
      { id: `u${history.length}`, role: "user" as const, content: message, timestamp: now },
      {
        id: `a${history.length}`,
        role: "assistant" as const,
        content: reply.reply_text,
        timestamp: now,
        jobRecommendations: jobs.map((j) => j.id),
      },
    ];
    await saveChatSession({
      id: sessionId,
      messages,
      candidateContext: reply.collected_context as unknown as ChatSession["candidateContext"],
      status: "active",
    });
  } catch (err) {
    console.error("[chat] persist failed", err);
  }

  return NextResponse.json({
    reply_text: reply.reply_text,
    stage: reply.stage,
    collected_context: reply.collected_context,
    suggested_actions: reply.suggested_actions,
    jobs,
  });
}
