// Proxy (Next 16's renamed "middleware", per node_modules/next/dist/docs proxy.md)
// — gates every /admin page and /api/admin route behind Clerk auth + the email
// allowlist. Pages redirect; API routes get proper status codes.
//
// Uses plain pathname checks (Clerk's createRouteMatcher is deprecated). The API
// gate is ALSO enforced per-route via requireAdmin() (defense in depth), which is
// Clerk's recommended resource-based pattern — the proxy just adds the page-level
// redirect UX and a fast reject for unauthed API calls.
import { clerkMiddleware, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isAllowedEmail } from "@/lib/admin/allowlist";

// Admin routes reachable WITHOUT auth (sign-in flow + the rejection page).
const PUBLIC_ADMIN = ["/admin/sign-in", "/admin/sign-up", "/admin/not-authorized"];

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;
  const isApi = pathname.startsWith("/api/admin");
  const isAdmin = isApi || pathname === "/admin" || pathname.startsWith("/admin/");

  // Not an admin surface, or a public admin route → let it through.
  if (!isAdmin || PUBLIC_ADMIN.some((p) => pathname.startsWith(p))) return;

  const { userId } = await auth();

  // 1) Not signed in → API gets 401 JSON; pages redirect to sign-in.
  if (!userId) {
    if (isApi) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.redirect(new URL("/admin/sign-in", req.url));
  }

  // 2) Signed in but not on the allowlist → API gets 403 JSON; pages redirect.
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const email = user.primaryEmailAddress?.emailAddress;
  if (!isAllowedEmail(email)) {
    if (isApi) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.redirect(new URL("/admin/not-authorized", req.url));
  }

  // Authorized — fall through (implicit NextResponse.next()).
});

export const config = {
  // Only run the proxy on admin surfaces — the homepage etc. stay off it.
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
