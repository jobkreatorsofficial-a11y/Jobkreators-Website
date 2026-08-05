import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isAllowedEmail } from "@/lib/admin/allowlist";

/**
 * Gate an admin API route. The proxy already enforces this on /api/admin/*, but
 * we re-check in every handler (defense in depth — a matcher change or refactor
 * can't silently expose a route). Returns `{ error }` to return early, or the
 * authenticated `{ userId, email }` on success.
 *
 * Usage:
 *   const gate = await requireAdmin();
 *   if ("error" in gate) return gate.error;
 */
export async function requireAdmin(): Promise<
  { error: NextResponse } | { userId: string; email: string }
> {
  const { userId } = await auth();
  if (!userId) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  if (!isAllowedEmail(email)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { userId, email: email as string };
}
