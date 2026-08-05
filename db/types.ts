// Inferred row types — the single source of truth for app code from Phase 2B on.
// These are derived from the Drizzle tables, so they can never drift from the DB.
// The hand-written lib/schema/*.ts types stay as human-readable documentation
// until 2B migrates every import over to these.

import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type * as schema from "./schema";

export type Job = InferSelectModel<typeof schema.jobs>;
export type NewJob = InferInsertModel<typeof schema.jobs>;

export type JobApplication = InferSelectModel<typeof schema.jobApplications>;
export type NewJobApplication = InferInsertModel<typeof schema.jobApplications>;

export type EmployerInquiry = InferSelectModel<typeof schema.employerInquiries>;
export type NewEmployerInquiry = InferInsertModel<typeof schema.employerInquiries>;

export type ChatSession = InferSelectModel<typeof schema.chatSessions>;
export type NewChatSession = InferInsertModel<typeof schema.chatSessions>;
