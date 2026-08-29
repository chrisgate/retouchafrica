"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { logoutAction } from "@/lib/actions/auth";

type NavLinkItem = { label: string; href: string };

function SidebarContent({ links, onNavigate }: { links: NavLinkItem[]; onNavigate?: () => void }) {
  return (
    <>
      <p className="font-display text-lg">
        RETOUCH <span className="text-gold">AFRICA</span>
      </p>
      <p className="mt-1 text-xs uppercase tracking-wide text-ink/40">Admin</p>

      <nav className="mt-8 flex flex-col gap-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className="rounded px-3 py-2 text-sm text-ink/80 hover:bg-ink/5"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <form action={logoutAction} className="mt-8">
        <button type="submit" className="text-xs text-ink/50 underline hover:text-ink">
          Log out
        </button>
      </form>
    </>
  );
}

export function AdminSidebarShell({ links }: { links: NavLinkItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between border-b border-ink/10 bg-paper-soft px-4 py-3 lg:hidden">
        <p className="font-display text-base">
          RETOUCH <span className="text-gold">AFRICA</span>
        </p>
        <button
          aria-label={open ? "Close admin menu" : "Open admin menu"}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 flex-none flex-col items-center justify-center gap-1.5"
        >
          <span className="h-px w-6 bg-ink" />
          <span className="h-px w-6 bg-ink" />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-ink/40 lg:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="absolute inset-y-0 left-0 w-64 max-w-[80vw] overflow-y-auto bg-paper-soft p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <SidebarContent links={links} onNavigate={() => setOpen(false)} />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <aside className="hidden w-56 flex-none border-r border-ink/10 bg-paper-soft p-6 lg:block">
        <SidebarContent links={links} />
      </aside>
    </>
  );
}
