import { defineConfig } from "drizzle-kit";
import { loadEnvConfig } from "@next/env";

// drizzle-kit runs outside Next, so it does NOT auto-load .env.local the way
// `next dev` does. Use Next's own loader so the CLI sees the same vars the app
// will (loads .env, .env.local, .env.development in Next's precedence order).
loadEnvConfig(process.cwd());

// Migrations need the DIRECT (non-pooled) Neon connection.
// pgBouncer (the pooler) doesn't support the session-level features drizzle-kit uses.
const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

if (!url) {
  throw new Error("DATABASE_URL_UNPOOLED (or DATABASE_URL) is required");
}

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: { url },
  verbose: true,
  strict: true,
});
