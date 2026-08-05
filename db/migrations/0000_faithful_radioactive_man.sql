CREATE TYPE "public"."application_source" AS ENUM('direct', 'chatbot', 'unmatched-general');--> statement-breakpoint
CREATE TYPE "public"."application_status" AS ENUM('submitted', 'reviewing', 'shortlisted', 'rejected', 'hired');--> statement-breakpoint
CREATE TYPE "public"."chat_session_status" AS ENUM('active', 'cv-submitted', 'closed');--> statement-breakpoint
CREATE TYPE "public"."city" AS ENUM('delhi-ncr', 'bangalore', 'mumbai', 'pune', 'hyderabad', 'chennai', 'kolkata', 'ahmedabad', 'remote', 'pan-india');--> statement-breakpoint
CREATE TYPE "public"."department" AS ENUM('engineering', 'product', 'design', 'sales', 'marketing', 'operations', 'finance', 'hr', 'legal', 'data-analytics', 'customer-success', 'other');--> statement-breakpoint
CREATE TYPE "public"."employer_inquiry_status" AS ENUM('new', 'contacted', 'qualified', 'closed');--> statement-breakpoint
CREATE TYPE "public"."experience_level" AS ENUM('entry', 'mid', 'senior', 'lead');--> statement-breakpoint
CREATE TYPE "public"."job_status" AS ENUM('active', 'closed', 'draft');--> statement-breakpoint
CREATE TYPE "public"."job_type" AS ENUM('full-time', 'contract', 'internship', 'part-time');--> statement-breakpoint
CREATE TABLE "chat_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"messages" jsonb NOT NULL,
	"candidate_context" jsonb NOT NULL,
	"status" "chat_session_status" DEFAULT 'active' NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "employer_inquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_name" text NOT NULL,
	"company_website" text,
	"contact_person" text NOT NULL,
	"contact_email" text NOT NULL,
	"contact_phone" text NOT NULL,
	"designation" text NOT NULL,
	"role_title" text NOT NULL,
	"department" "department" NOT NULL,
	"city" "city" NOT NULL,
	"type" "job_type" NOT NULL,
	"min_years" integer NOT NULL,
	"max_years" integer NOT NULL,
	"min_salary_lpa" integer,
	"max_salary_lpa" integer,
	"openings" integer NOT NULL,
	"jd_text" text,
	"jd_file_url" text,
	"additional_notes" text,
	"status" "employer_inquiry_status" DEFAULT 'new' NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid,
	"job_slug" text,
	"job_title" text,
	"job_company" text,
	"candidate_name" text NOT NULL,
	"candidate_email" text NOT NULL,
	"candidate_phone" text NOT NULL,
	"candidate_city" "city" NOT NULL,
	"current_company" text,
	"current_role" text,
	"years_of_experience" integer NOT NULL,
	"current_salary_lpa" integer,
	"expected_salary_lpa" integer,
	"notice_period_days" integer,
	"linkedin_url" text,
	"portfolio_url" text,
	"cv_file_url" text NOT NULL,
	"cv_file_name" text NOT NULL,
	"cover_message" text,
	"status" "application_status" DEFAULT 'submitted' NOT NULL,
	"source" "application_source" NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"company" text NOT NULL,
	"company_logo_url" text,
	"department" "department" NOT NULL,
	"city" "city" NOT NULL,
	"type" "job_type" NOT NULL,
	"experience_level" "experience_level" NOT NULL,
	"min_years" integer NOT NULL,
	"max_years" integer NOT NULL,
	"min_salary_lpa" integer,
	"max_salary_lpa" integer,
	"description" text NOT NULL,
	"responsibilities" text[] NOT NULL,
	"requirements" text[] NOT NULL,
	"nice_to_have" text[] NOT NULL,
	"benefits" text[] NOT NULL,
	"status" "job_status" DEFAULT 'draft' NOT NULL,
	"posted_at" timestamp with time zone NOT NULL,
	"closes_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "jobs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chat_sessions_status_idx" ON "chat_sessions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "chat_sessions_updated_at_idx" ON "chat_sessions" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "employer_inquiries_status_idx" ON "employer_inquiries" USING btree ("status");--> statement-breakpoint
CREATE INDEX "employer_inquiries_submitted_at_idx" ON "employer_inquiries" USING btree ("submitted_at");--> statement-breakpoint
CREATE INDEX "job_applications_job_id_idx" ON "job_applications" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "job_applications_status_idx" ON "job_applications" USING btree ("status");--> statement-breakpoint
CREATE INDEX "job_applications_submitted_at_idx" ON "job_applications" USING btree ("submitted_at");--> statement-breakpoint
CREATE INDEX "job_applications_candidate_email_idx" ON "job_applications" USING btree ("candidate_email");--> statement-breakpoint
CREATE INDEX "jobs_status_idx" ON "jobs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "jobs_department_idx" ON "jobs" USING btree ("department");--> statement-breakpoint
CREATE INDEX "jobs_city_idx" ON "jobs" USING btree ("city");--> statement-breakpoint
CREATE INDEX "jobs_posted_at_idx" ON "jobs" USING btree ("posted_at");