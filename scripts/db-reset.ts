// DEV-ONLY hard reset: drop everything, re-run migrations, re-seed. Handy while
// iterating on the schema. Refuses to run in production.
import "./load-env";

import { execSync } from "node:child_process";
import { sql } from "drizzle-orm";
import { db } from "../db";

async function main() {
  if (process.env.NODE_ENV === "production") {
    console.error("Refusing to run db:reset with NODE_ENV=production.");
    process.exit(1);
  }

  console.log("Dropping schema (public + drizzle journal)…");
  // CASCADE drops every table AND the enum types (all live in public).
  await db.execute(sql`DROP SCHEMA IF EXISTS public CASCADE`);
  await db.execute(sql`CREATE SCHEMA public`);
  // Wipe Drizzle's migration journal so `migrate` re-applies 0000 from scratch.
  await db.execute(sql`DROP SCHEMA IF EXISTS drizzle CASCADE`);

  console.log("Re-running migrations…");
  execSync("npm run db:migrate", { stdio: "inherit" });

  console.log("Re-seeding…");
  execSync("npm run db:seed", { stdio: "inherit" });

  console.log("Reset complete.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Reset failed:", err);
    process.exit(1);
  });
