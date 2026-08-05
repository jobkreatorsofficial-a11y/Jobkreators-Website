// Shared helpers for admin Route Handlers: consistent error envelopes and safe
// query-param parsing.

import { NextResponse } from "next/server";

export function badRequest(message: string, details?: unknown) {
  return NextResponse.json({ error: message, details }, { status: 400 });
}

export function notFound(message = "Not found") {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function serverError(err: unknown) {
  console.error("[admin api]", err);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}

/** Parse an integer query param, or undefined if absent/invalid. */
export function numParam(v: string | null): number | undefined {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

/** Return v only if it's a valid value in the given constants list, else undefined. */
export function enumParam<T extends string>(items: readonly { value: T }[], v: string | null): T | undefined {
  return v && items.some((i) => i.value === v) ? (v as T) : undefined;
}
