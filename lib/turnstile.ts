import "server-only";

/**
 * Cloudflare Turnstile (CAPTCHA alternative) — optional layer on top of
 * lib/spam-guard.ts. Active only when BOTH keys are set, so the site keeps
 * working (with the other protections) until they're configured.
 *
 * Keys are read at request time, not build time, so they can be set purely as
 * runtime env vars in Coolify — no rebuild needed.
 */

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const VERIFY_TIMEOUT_MS = 5_000;

export const TURNSTILE_RESPONSE_FIELD = "cf-turnstile-response";

/** The public site key to render the widget with, or null when Turnstile is off. */
export function getTurnstileSiteKey(): string | null {
  const siteKey = process.env.TURNSTILE_SITE_KEY;
  return siteKey && process.env.TURNSTILE_SECRET_KEY ? siteKey : null;
}

/**
 * True if the visitor passed (or Turnstile is off / Cloudflare is unreachable).
 *
 * A *rejected* token always fails closed. A network error or timeout reaching
 * Cloudflare fails open: an outage there shouldn't silently drop real enquiries,
 * and the honeypot, signed token and rate limits still apply.
 */
export async function verifyTurnstile(token: unknown): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!getTurnstileSiteKey() || !secret) return true;

  if (typeof token !== "string" || token === "" || token.length > 2048) return false;

  try {
    const response = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
      signal: AbortSignal.timeout(VERIFY_TIMEOUT_MS),
    });
    const result = (await response.json()) as { success?: boolean; "error-codes"?: string[] };
    if (!result.success) {
      console.warn("Turnstile rejected a submission:", result["error-codes"]?.join(", "));
    }
    return result.success === true;
  } catch (error) {
    console.error("Turnstile verification unavailable, allowing submission:", error);
    return true;
  }
}
