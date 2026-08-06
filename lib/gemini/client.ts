import { SYSTEM_PROMPT, RESPONSE_SCHEMA, buildJobsContext, type GeminiReply } from "./prompt";

// Gemini Flash via the REST API (no SDK dependency). Structured JSON out via
// responseSchema; one retry on a bad response; graceful fallback so the chat never
// hard-fails on the user.
//
// NOTE: the ticket specified gemini-2.0-flash, but that model is now deprecated for
// generateContent ("no longer available") — upgraded to the current flash tier.

const ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export type ChatTurn = { role: "user" | "assistant"; content: string };
type JobLite = Parameters<typeof buildJobsContext>[0][number];

const FALLBACK: GeminiReply = {
  reply_text: "Let me connect you with a team member — share your CV and we'll reach out when a role fits.",
  stage: "closing",
  collected_context: {},
  suggested_actions: ["Submit CV"],
  job_recommendations: [],
};

export async function chatWithGemini(
  history: ChatTurn[],
  userMessage: string,
  jobs: JobLite[],
): Promise<GeminiReply> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.error("[gemini] GEMINI_API_KEY missing");
    return FALLBACK;
  }

  const body = {
    system_instruction: { parts: [{ text: SYSTEM_PROMPT + buildJobsContext(jobs) }] },
    contents: [
      ...history.map((h) => ({ role: h.role === "assistant" ? "model" : "user", parts: [{ text: h.content }] })),
      { role: "user", parts: [{ text: userMessage }] },
    ],
    generationConfig: {
      temperature: 0.7,
      // 2.5-flash thinks by default; disable it for fast, predictable structured
      // output and so thinking tokens don't eat the output budget.
      thinkingConfig: { thinkingBudget: 0 },
      maxOutputTokens: 800,
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
    },
  };

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(`${ENDPOINT}?key=${key}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        console.error("[gemini] http", res.status, await res.text().catch(() => ""));
        continue;
      }
      const data = await res.json();
      const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) continue;
      const parsed = JSON.parse(text) as GeminiReply;
      if (typeof parsed.reply_text === "string" && typeof parsed.stage === "string") {
        return {
          reply_text: parsed.reply_text.slice(0, 240),
          stage: parsed.stage,
          collected_context: parsed.collected_context ?? {},
          suggested_actions: Array.isArray(parsed.suggested_actions) ? parsed.suggested_actions.slice(0, 5) : [],
          job_recommendations: Array.isArray(parsed.job_recommendations) ? parsed.job_recommendations : [],
        };
      }
    } catch (err) {
      console.error("[gemini] attempt", attempt, "failed", err);
    }
  }
  return FALLBACK;
}
