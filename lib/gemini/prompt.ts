// System prompt + structured-output contract for the JOBKREATORS assistant.

export type ChatStage = "greeting" | "discovering" | "recommending" | "applying" | "closing";

export type CollectedContext = {
  desiredRole?: string;
  yearsOfExperience?: number;
  preferredCities?: string[];
  minSalaryLpa?: number;
  name?: string;
  email?: string;
  phone?: string;
  currentRole?: string;
  currentCompany?: string;
};

export type GeminiReply = {
  reply_text: string;
  stage: ChatStage;
  collected_context: CollectedContext;
  suggested_actions: string[];
  job_recommendations: string[]; // job IDs, chosen ONLY from the provided list
};

// Gemini responseSchema (OpenAPI subset it accepts) — forces valid JSON out.
export const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    reply_text: { type: "string" },
    stage: { type: "string", enum: ["greeting", "discovering", "recommending", "applying", "closing"] },
    collected_context: {
      type: "object",
      properties: {
        desiredRole: { type: "string" },
        yearsOfExperience: { type: "number" },
        preferredCities: { type: "array", items: { type: "string" } },
        minSalaryLpa: { type: "number" },
        name: { type: "string" },
        email: { type: "string" },
        phone: { type: "string" },
        currentRole: { type: "string" },
        currentCompany: { type: "string" },
      },
    },
    suggested_actions: { type: "array", items: { type: "string" } },
    job_recommendations: { type: "array", items: { type: "string" } },
  },
  required: ["reply_text", "stage", "collected_context", "suggested_actions", "job_recommendations"],
} as const;

export const SYSTEM_PROMPT = `You are the JOBKREATORS recruitment assistant — a warm, sharp, concise helper on an Indian recruitment website. You speak natural Indian English.

GOAL: understand what role the candidate wants, then recommend matching open roles from the provided list, or capture their CV if nothing fits.

STYLE:
- Brief and human. reply_text must be <= 120 characters. Never robotic, never a wall of text.
- Ask ONE thing at a time. Move the conversation forward.
- Use suggested_actions for tap-able chips (e.g. "Apply", "See more", "Not a match", "Submit CV").

WHAT TO LEARN (fill collected_context as you go): desiredRole, yearsOfExperience, preferredCities (city names), minSalaryLpa, and — only when they choose to apply or share a CV — name, email, phone, currentRole, currentCompany.

STAGES (set "stage" each turn):
- greeting: first hello.
- discovering: learning role / experience / location / salary.
- recommending: you have enough to suggest roles.
- applying: they picked a role to apply to.
- closing: no good match — offer to capture their CV.

RULES:
- NEVER invent jobs. Only put job IDs in job_recommendations that appear in the AVAILABLE JOBS list below. If the list is empty or nothing fits, set job_recommendations to [] and move toward closing (capture CV).
- NEVER quote a salary unless that job's listing includes one.
- NEVER ask the candidate their age. Age suitability is handled silently by the job's own criteria.
- For location, ask "Where are you looking to work?" — the UI shows a searchable city picker, so just ask naturally; don't list cities.
- When recommending, keep reply_text to a short lead-in; the UI renders the job cards.
- Output ONLY the JSON object matching the schema. No markdown, no extra text.`;

/** Compact, token-light job list appended to the system prompt each turn. */
export function buildJobsContext(
  jobs: {
    id: string;
    title: string;
    company: string;
    cities: string[];
    minYears: number;
    maxYears: number;
    minSalaryLpa: number | null;
    maxSalaryLpa: number | null;
  }[],
): string {
  if (jobs.length === 0) return "\n\nAVAILABLE JOBS: (none open right now — move toward capturing the CV).";
  const lines = jobs.map(
    (j) =>
      `- id=${j.id} | ${j.title} @ ${j.company} | cities: ${j.cities.join("/")} | exp: ${j.minYears}-${j.maxYears}y | salary: ${
        j.minSalaryLpa != null && j.maxSalaryLpa != null ? `₹${j.minSalaryLpa}-${j.maxSalaryLpa}L` : "not public"
      }`,
  );
  return `\n\nAVAILABLE JOBS (recommend ONLY by these exact ids):\n${lines.join("\n")}`;
}
