// Seed the DB from the Phase 1 mock datasets. Safe to re-run:
// onConflictDoNothing() means existing rows (matched by PK) are left untouched.
//
// No field mapping is needed — lib/schema/*.ts (and therefore the mock data) was
// deliberately built to mirror these tables 1:1. Drizzle maps the camelCase JS
// keys to the snake_case columns, and timestamps are ISO strings on both sides
// ({ mode: "string" }), so the mock records drop straight in. Insert order
// respects the one FK: jobs (parents) before job_applications (children).
import "./load-env";

import { db } from "../db";
import { jobs, jobApplications, employerInquiries, chatSessions } from "../db/schema";
import type { NewJob, NewJobApplication, NewEmployerInquiry, NewChatSession } from "../db/types";
import {
  MOCK_JOBS,
  MOCK_APPLICATIONS,
  MOCK_EMPLOYER_INQUIRIES,
  MOCK_CHAT_SESSIONS,
} from "../lib/mock";

async function main() {
  const jobRows = await db
    .insert(jobs)
    .values(MOCK_JOBS satisfies NewJob[])
    .onConflictDoNothing()
    .returning({ id: jobs.id });

  const appRows = await db
    .insert(jobApplications)
    .values(MOCK_APPLICATIONS satisfies NewJobApplication[])
    .onConflictDoNothing()
    .returning({ id: jobApplications.id });

  const inquiryRows = await db
    .insert(employerInquiries)
    .values(MOCK_EMPLOYER_INQUIRIES satisfies NewEmployerInquiry[])
    .onConflictDoNothing()
    .returning({ id: employerInquiries.id });

  const chatRows = await db
    .insert(chatSessions)
    .values(MOCK_CHAT_SESSIONS satisfies NewChatSession[])
    .onConflictDoNothing()
    .returning({ id: chatSessions.id });

  console.log("Seed complete (rows inserted this run):");
  console.log(`  jobs                : ${jobRows.length}`);
  console.log(`  job_applications    : ${appRows.length}`);
  console.log(`  employer_inquiries  : ${inquiryRows.length}`);
  console.log(`  chat_sessions       : ${chatRows.length}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
