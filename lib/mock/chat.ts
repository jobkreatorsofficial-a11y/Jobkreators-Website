// Mock chat sessions — shaped EXACTLY to the `ChatSession` schema. Powers the
// admin chat-sessions list/detail in Phase 1; Phase 2 persists real sessions.

import type { ChatSession } from "@/lib/schema";

export const MOCK_CHAT_SESSIONS: ChatSession[] = [
  {
    id: "c5a7b1d2-0001-4e6a-9c11-3a4b5c6d7e01",
    messages: [
      { id: "m1", role: "assistant", content: "Hi! I'm the JOBKREATORS assistant. Would you like to explore roles that match your background?", timestamp: "2026-07-29T09:00:00.000Z" },
      { id: "m2", role: "user", content: "Yes, I'm a backend engineer", timestamp: "2026-07-29T09:00:20.000Z" },
      { id: "m3", role: "assistant", content: "Great — how many years of experience do you have?", timestamp: "2026-07-29T09:00:22.000Z" },
      { id: "m4", role: "user", content: "3 years, based in Hyderabad", timestamp: "2026-07-29T09:00:45.000Z" },
      {
        id: "m5",
        role: "assistant",
        content: "Here are 3 roles that fit. The Razorpay backend role looks like a strong match.",
        timestamp: "2026-07-29T09:00:48.000Z",
        jobRecommendations: ["3f1a9c2e-1b4d-4e6a-9c11-0a1b2c3d4e03"],
      },
    ],
    candidateContext: {
      desiredRole: "Backend Engineer",
      yearsOfExperience: 3,
      preferredCities: ["hyderabad"],
      departments: ["engineering"],
      email: "rohan.gupta.dev@gmail.com",
      name: "Rohan Gupta",
    },
    status: "cv-submitted",
    startedAt: "2026-07-29T09:00:00.000Z",
    updatedAt: "2026-07-29T09:05:00.000Z",
  },
  {
    id: "c5a7b1d2-0002-4e6a-9c11-3a4b5c6d7e02",
    messages: [
      { id: "m1", role: "assistant", content: "Hi! Looking for your next role? Tell me what you do.", timestamp: "2026-07-30T14:20:00.000Z" },
      { id: "m2", role: "user", content: "Product design, ~4 years", timestamp: "2026-07-30T14:20:30.000Z" },
      {
        id: "m3",
        role: "assistant",
        content: "Nice — here are a couple of design roles you might like.",
        timestamp: "2026-07-30T14:20:33.000Z",
        jobRecommendations: ["3f1a9c2e-1b4d-4e6a-9c11-0a1b2c3d4e04", "3f1a9c2e-1b4d-4e6a-9c11-0a1b2c3d4e10"],
      },
    ],
    candidateContext: {
      desiredRole: "Product Designer",
      yearsOfExperience: 4,
      departments: ["design"],
    },
    status: "active",
    startedAt: "2026-07-30T14:20:00.000Z",
    updatedAt: "2026-07-30T14:22:00.000Z",
  },
  {
    id: "c5a7b1d2-0003-4e6a-9c11-3a4b5c6d7e03",
    messages: [
      { id: "m1", role: "assistant", content: "Hi! Would you like to explore roles?", timestamp: "2026-07-28T11:00:00.000Z" },
      { id: "m2", role: "user", content: "just browsing thanks", timestamp: "2026-07-28T11:00:40.000Z" },
      { id: "m3", role: "assistant", content: "No problem — a team member from Recruitment.Team can follow up whenever you're ready.", timestamp: "2026-07-28T11:00:43.000Z" },
    ],
    candidateContext: {},
    status: "closed",
    startedAt: "2026-07-28T11:00:00.000Z",
    updatedAt: "2026-07-28T11:01:00.000Z",
  },
  {
    id: "c5a7b1d2-0004-4e6a-9c11-3a4b5c6d7e04",
    messages: [
      { id: "m1", role: "assistant", content: "Hi! What kind of role are you after?", timestamp: "2026-07-31T08:10:00.000Z" },
      { id: "m2", role: "user", content: "growth marketing, remote, 8 yrs", timestamp: "2026-07-31T08:10:35.000Z" },
      {
        id: "m3",
        role: "assistant",
        content: "The Physics Wallah growth lead role could be a great fit.",
        timestamp: "2026-07-31T08:10:38.000Z",
        jobRecommendations: ["3f1a9c2e-1b4d-4e6a-9c11-0a1b2c3d4e07"],
      },
    ],
    candidateContext: {
      desiredRole: "Growth Marketing",
      yearsOfExperience: 8,
      preferredCities: ["remote"],
      departments: ["marketing"],
      email: "kabir.nair@gmail.com",
    },
    status: "active",
    startedAt: "2026-07-31T08:10:00.000Z",
    updatedAt: "2026-07-31T08:12:00.000Z",
  },
];
