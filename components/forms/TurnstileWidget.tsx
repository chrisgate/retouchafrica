"use client";

import { useEffect, useRef } from "react";

type TurnstileApi = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let scriptPromise: Promise<TurnstileApi> | null = null;

function loadTurnstile(): Promise<TurnstileApi> {
  scriptPromise ??= new Promise<TurnstileApi>((resolve, reject) => {
    if (window.turnstile) return resolve(window.turnstile);
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("Turnstile missing")));
    script.onerror = () => {
      scriptPromise = null; // allow a retry on the next mount
      reject(new Error("Turnstile failed to load"));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

/**
 * Renders a Cloudflare Turnstile challenge. Reports a fresh token through
 * `onToken` (and "" when it expires), and re-arms itself whenever `resetKey`
 * changes — tokens are single-use, so every submit attempt needs a new one.
 */
export function TurnstileWidget({
  siteKey,
  onToken,
  onFailure,
  resetKey,
}: {
  siteKey: string;
  onToken: (token: string) => void;
  onFailure: () => void;
  resetKey: unknown;
}) {
  const container = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const lastResetKey = useRef(resetKey);

  // Latest callbacks without re-creating the widget on every render.
  const callbacks = useRef({ onToken, onFailure });
  useEffect(() => {
    callbacks.current = { onToken, onFailure };
  });

  useEffect(() => {
    let cancelled = false;
    loadTurnstile()
      .then((turnstile) => {
        if (cancelled || !container.current) return;
        widgetId.current = turnstile.render(container.current, {
          sitekey: siteKey,
          theme: "light",
          callback: (token: string) => callbacks.current.onToken(token),
          "expired-callback": () => {
            callbacks.current.onToken("");
            if (widgetId.current) turnstile.reset(widgetId.current);
          },
          "error-callback": () => {
            callbacks.current.onFailure();
            return true; // we handle it; suppress Turnstile's console error
          },
        });
      })
      .catch(() => {
        if (!cancelled) callbacks.current.onFailure();
      });

    return () => {
      cancelled = true;
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [siteKey]);

  useEffect(() => {
    if (lastResetKey.current === resetKey) return;
    lastResetKey.current = resetKey;
    if (widgetId.current) window.turnstile?.reset(widgetId.current);
  }, [resetKey]);

  return <div ref={container} />;
}
