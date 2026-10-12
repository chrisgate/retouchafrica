import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";

/**
 * Anti-spam for the public forms (contact / join community / partner inquiry).
 * Deliberately self-contained — no third-party CAPTCHA, no extra keys — and
 * layered, because each trick alone is easy to dodge:
 *
 *  1. Honeypot field   — a hidden input humans never fill; bots do.
 *  2. Signed form token — proves the form was actually rendered by us, and how
 *     long ago. Too fast = script; too old or forged = replay/direct POST.
 *  3. DB-backed limits — per-email and site-wide submission caps that survive
 *     restarts and work across multiple instances.
 *  4. Content checks   — link-stuffed messages are the signature of junk.
 */

/** Name of the hidden honeypot input. Not "website"/"url"/"company" — browsers autofill those. */
export const HONEYPOT_FIELD = "hp_fax";
export const FORM_TOKEN_FIELD = "form_token";

const MIN_FILL_MS = 3_000; // no human reads, types and submits faster than this
const MAX_AGE_MS = 12 * 60 * 60 * 1000; // a form left open overnight is stale

const PER_EMAIL_LIMIT = 3; // per hour
const SITE_WIDE_LIMIT = 30; // per 10 minutes — a flood backstop
const MAX_LINKS = 2;

function sign(timestamp: string): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET env var must be set.");
  return createHmac("sha256", secret).update(`form-token:${timestamp}`).digest("base64url");
}

/** Issued when a form is rendered; the browser sends it back on submit. */
export function createFormToken(): string {
  const timestamp = String(Date.now());
  return `${timestamp}.${sign(timestamp)}`;
}

export type TokenCheck = "ok" | "invalid" | "tooFast" | "expired";

export function checkFormToken(token: unknown): TokenCheck {
  if (typeof token !== "string") return "invalid";
  const [timestamp, signature] = token.split(".");
  if (!timestamp || !signature || !/^\d+$/.test(timestamp)) return "invalid";

  const expected = Buffer.from(sign(timestamp));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return "invalid";

  const age = Date.now() - Number(timestamp);
  if (age < MIN_FILL_MS) return "tooFast";
  if (age > MAX_AGE_MS) return "expired";
  return "ok";
}

export function isHoneypotTripped(value: unknown): boolean {
  return typeof value === "string" && value.trim() !== "";
}

export function hasTooManyLinks(...texts: (string | null | undefined)[]): boolean {
  const links = texts.join(" ").match(/https?:\/\/|www\./gi);
  return (links?.length ?? 0) > MAX_LINKS;
}

export type RateLimitResult = "ok" | "emailLimit" | "siteLimit";

export async function checkRateLimits(email: string): Promise<RateLimitResult> {
  const now = Date.now();
  const [fromEmail, siteWide] = await Promise.all([
    prisma.submission.count({
      where: { email: { equals: email, mode: "insensitive" }, createdAt: { gte: new Date(now - 60 * 60 * 1000) } },
    }),
    prisma.submission.count({ where: { createdAt: { gte: new Date(now - 10 * 60 * 1000) } } }),
  ]);
  if (fromEmail >= PER_EMAIL_LIMIT) return "emailLimit";
  if (siteWide >= SITE_WIDE_LIMIT) return "siteLimit";
  return "ok";
}
