"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { clsx } from "clsx";
import { NAV_LINKS } from "@/lib/constants";
import { Button } from "@/components/shared/Button";
import { Logo } from "@/components/shared/Logo";
import { MobileNav } from "@/components/layout/MobileNav";

export function Header({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5">
        <Link href="/" aria-label="Retouch Africa home" className="flex-none transition-transform hover:scale-[1.03]">
          <Logo variant="dark" className="h-10 w-auto" />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "relative pb-1 text-xs font-medium uppercase tracking-[0.15em] whitespace-nowrap transition-colors",
                  isActive ? "text-gold" : "text-ink/80 hover:text-gold"
                )}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-0 -bottom-px h-0.5 bg-gold"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden flex-none items-center gap-3 lg:flex">
          {isAdmin && (
            <Link
              href="/admin"
              title="Admin dashboard"
              aria-label="Admin dashboard"
              className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-ink/20 text-ink/70 transition-colors hover:border-gold hover:text-gold"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-current fill-none stroke-[1.5]">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </Link>
          )}
          <Button href="/community" variant="outline">
            Join the Community
          </Button>
        </div>

        <MobileNav isAdmin={isAdmin} />
      </div>
    </header>
  );
}
