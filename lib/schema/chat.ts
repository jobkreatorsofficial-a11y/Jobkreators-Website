// Chat — mirrors the future `chat_sessions` / `chat_messages` tables. In Phase 1
// the assistant is fully mocked (a useReducer state machine); Phase 2 swaps the
// mock responder for a real LLM without changing these shapes.

import type { City, Department } from "./job";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  jobRecommendations?: string[]; // Job IDs, when assistant recommends
};

export type ChatSession = {
  id: string;
  messages: ChatMessage[];
  candidateContext: {
    desiredRole?: string;
    yearsOfExperience?: number;
    preferredCities?: City[];
    departments?: Department[];
    minSalaryLpa?: number;
    resumeSubmitted?: boolean;
    resumeUrl?: string;
    email?: string;
    phone?: string;
    name?: string;
  };
  status: "active" | "cv-submitted" | "closed";
  startedAt: string;
  updatedAt: string;
};
