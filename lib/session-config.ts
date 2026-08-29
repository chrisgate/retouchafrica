import type { SessionOptions } from "iron-session";

export interface SessionData {
  userId?: string;
  isAdmin?: boolean;
}

export const SESSION_COOKIE_NAME = "ra_admin_session";

/**
 * Reads SESSION_SECRET lazily (call-time, not module-load-time) — Next.js
 * evaluates this module while collecting build metadata for every route,
 * including ones that don't execute at build time, so eagerly validating
 * env vars at module scope would break `next build` in environments where
 * secrets are injected only at container runtime (e.g. Coolify).
 */
export function getSessionOptions(): SessionOptions {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET env var must be set to a random string of at least 32 characters."
    );
  }

  return {
    cookieName: SESSION_COOKIE_NAME,
    password: secret,
    cookieOptions: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  };
}
