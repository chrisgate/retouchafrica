"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { NAV_LINKS } from "@/lib/constants";
import { Button } from "@/components/shared/Button";

export function MobileNav({ isAdmin = false }: { isAdmin?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 flex-col items-center justify-center gap-1.5"
      >
        <span className="h-px w-6 bg-ink" />
        <span className="h-px w-6 bg-ink" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="absolute inset-x-0 top-full overflow-hidden border-b border-ink/10 bg-paper"
          >
            <nav className="flex flex-col gap-1 px-6 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="py-2 text-sm font-medium uppercase tracking-[0.15em] text-ink/80 hover:text-gold"
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-1.5 py-2 text-sm font-medium uppercase tracking-[0.15em] text-ink/60 hover:text-gold"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
                  Admin
                </Link>
              )}
              <div className="mt-3">
                <Button href="/community" variant="outline" className="w-full">
                  Join the Community
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
