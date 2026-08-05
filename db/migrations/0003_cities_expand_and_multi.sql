-- Expand the "city" enum from 10 → 45 values (the original 10 already exist, so
-- these 35 are additive). Postgres 12+ permits ADD VALUE inside a transaction as
-- long as the NEW values are not USED in the same transaction; the data conversion
-- below only reads the pre-existing "city" column values, so this is safe under
-- drizzle's transactional migrate.
ALTER TYPE "public"."city" ADD VALUE IF NOT EXISTS 'agra';--> statement-breakpoint
ALTER TYPE "public"."city" ADD VALUE IF NOT EXISTS 'amritsar';--> statement-breakpoint
ALTER TYPE "public"."city" ADD VALUE IF NOT EXISTS 'bhopal';--> statement-breakpoint
ALTER TYPE "public"."city" ADD VALUE IF NOT EXISTS 'bhubaneswar';--> statement-breakpoint
ALTER TYPE "public"."city" ADD VALUE IF NOT EXISTS 'chandigarh';--> statement-breakpoint
ALTER TYPE "public"."city" ADD VALUE IF NOT EXISTS 'coimbatore';--> statement-breakpoint
ALTER TYPE "public"."city" ADD VALUE IF NOT EXISTS 'dehradun';--> statement-breakpoint
ALTER TYPE "public"."city" ADD VALUE IF NOT EXISTS 'faridabad';--> statement-breakpoint
ALTER TYPE "public"."city" ADD VALUE IF NOT EXISTS 'ghaziabad';--> statement-breakpoint
ALTER TYPE "public"."city" ADD VALUE IF NOT EXISTS 'gurgaon';--> statement-breakpoint
ALTER TYPE "public"."city" ADD VALUE IF NOT EXISTS 'guwahati';--> statement-breakpoint
ALTER TYPE "public"."city" ADD VALUE IF NOT EXISTS 'indore';--> statement-breakpoint
ALTER TYPE "public"."city" ADD VALUE IF NOT EXISTS 'jaipur';--> statement-breakpoint
ALTER TYPE "public"."city" ADD VALUE IF NOT EXISTS 'jodhpur';--> statement-breakpoint
ALTER TYPE "public"."city" ADD VALUE IF NOT EXISTS 'kanpur';--> statement-breakpoint
ALTER TYPE "public"."city" ADD VALUE IF NOT EXISTS 'kochi';--> statement-breakpoint
ALTER TYPE "public"."city" ADD VALUE IF NOT EXISTS 'lucknow';--> statement-breakpoint
ALTER TYPE "public"."city" ADD VALUE IF NOT EXISTS 'ludhiana';--> statement-breakpoint
ALTER TYPE "public"."city" ADD VALUE IF NOT EXISTS 'madurai';--> statement-breakpoint
ALTER TYPE "public"."city" ADD VALUE IF NOT EXISTS 'mangalore';--> statement-breakpoint
ALTER TYPE "public"."city" ADD VALUE IF NOT EXISTS 'multiple-locations';--> statement-breakpoint
ALTER TYPE "public"."city" ADD VALUE IF NOT EXISTS 'mysuru';--> statement-breakpoint
ALTER TYPE "public"."city" ADD VALUE IF NOT EXISTS 'nagpur';--> statement-breakpoint
ALTER TYPE "public"."city" ADD VALUE IF NOT EXISTS 'nashik';--> statement-breakpoint
ALTER TYPE "public"."city" ADD VALUE IF NOT EXISTS 'noida';--> statement-breakpoint
ALTER TYPE "public"."city" ADD VALUE IF NOT EXISTS 'patna';--> statement-breakpoint
ALTER TYPE "public"."city" ADD VALUE IF NOT EXISTS 'raipur';--> statement-breakpoint
ALTER TYPE "public"."city" ADD VALUE IF NOT EXISTS 'ranchi';--> statement-breakpoint
ALTER TYPE "public"."city" ADD VALUE IF NOT EXISTS 'surat';--> statement-breakpoint
ALTER TYPE "public"."city" ADD VALUE IF NOT EXISTS 'thiruvananthapuram';--> statement-breakpoint
ALTER TYPE "public"."city" ADD VALUE IF NOT EXISTS 'tiruchirappalli';--> statement-breakpoint
ALTER TYPE "public"."city" ADD VALUE IF NOT EXISTS 'vadodara';--> statement-breakpoint
ALTER TYPE "public"."city" ADD VALUE IF NOT EXISTS 'varanasi';--> statement-breakpoint
ALTER TYPE "public"."city" ADD VALUE IF NOT EXISTS 'vijayawada';--> statement-breakpoint
ALTER TYPE "public"."city" ADD VALUE IF NOT EXISTS 'visakhapatnam';--> statement-breakpoint
-- Multi-city: convert jobs.city (single) → jobs.cities (enum array), preserving
-- data by wrapping each existing value in a single-element array.
ALTER TABLE "jobs" ADD COLUMN "cities" "city"[];--> statement-breakpoint
UPDATE "jobs" SET "cities" = ARRAY["city"];--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "cities" SET NOT NULL;--> statement-breakpoint
DROP INDEX IF EXISTS "jobs_city_idx";--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN "city";--> statement-breakpoint
-- GIN index for fast "cities @> / && ARRAY[...]" location filtering.
CREATE INDEX "jobs_cities_idx" ON "jobs" USING gin ("cities");
