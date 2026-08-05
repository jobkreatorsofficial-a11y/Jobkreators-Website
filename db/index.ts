import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Singleton: Next.js hot-reload re-imports modules constantly, and a fresh
// postgres() per import would exhaust the Neon connection budget. Stash the
// client on globalThis in dev so it survives reloads.
const globalForDb = globalThis as unknown as {
  client: ReturnType<typeof postgres> | undefined;
};

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL required");

const client =
  globalForDb.client ??
  postgres(url, {
    prepare: false, // pgBouncer transaction mode doesn't support prepared statements
    max: 10, // our end of the pool; the Neon pooler pools upstream too
  });

if (process.env.NODE_ENV !== "production") globalForDb.client = client;

export const db = drizzle(client, { schema });
export type Database = typeof db;
