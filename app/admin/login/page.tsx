"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/lib/actions/auth";
import { Logo } from "@/components/shared/Logo";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-6 py-16">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(201,151,30,0.18),transparent_55%)]"
        aria-hidden
      />

      <div className="relative w-full max-w-sm">
        <Link href="/" className="mx-auto flex w-fit transition-transform hover:scale-[1.03]">
          <Logo variant="light" className="h-10 w-auto" />
        </Link>

        <div className="mt-10 border border-paper/10 bg-paper/[0.04] p-8 backdrop-blur-sm">
          <p className="eyebrow text-center">Admin</p>
          <h1 className="font-display mt-2 text-center text-3xl text-paper">Welcome Back</h1>
          <p className="mt-2 text-center text-sm text-paper/50">Sign in to manage Retouch Africa</p>

          <form action={formAction} className="mt-8 flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="text-xs font-medium uppercase tracking-wide text-paper/50">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 w-full border border-paper/20 bg-transparent px-3 py-2.5 text-sm text-paper placeholder:text-paper/30 focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-xs font-medium uppercase tracking-wide text-paper/50">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 w-full border border-paper/20 bg-transparent px-3 py-2.5 text-sm text-paper placeholder:text-paper/30 focus:border-gold focus:outline-none"
              />
            </div>

            {state?.error && <p className="text-sm text-red-400">{state.error}</p>}

            <button
              type="submit"
              disabled={pending}
              className="mt-2 bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-ink transition-colors hover:bg-gold-soft disabled:opacity-50"
            >
              {pending ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>

        <Link
          href="/"
          className="mt-6 flex items-center justify-center gap-1.5 text-xs uppercase tracking-[0.15em] text-paper/50 transition-colors hover:text-gold"
        >
          ← Back to Retouch Africa
        </Link>
      </div>
    </div>
  );
}
