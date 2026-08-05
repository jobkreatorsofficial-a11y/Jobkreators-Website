// Side-effect module: load .env.local the same way Next does, BEFORE anything
// that reads process.env (db/index.ts throws if DATABASE_URL is missing at import
// time). Import this FIRST in any tsx script:  import "./load-env";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());
