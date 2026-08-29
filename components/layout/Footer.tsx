import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SocialIcons } from "@/components/shared/SocialIcons";
import { Logo } from "@/components/shared/Logo";
import type { SiteSettings } from "@/lib/site-settings";

export async function Footer({ settings }: { settings: SiteSettings }) {
  const socialLinks = await prisma.socialLink.findMany({
    where: { facilitatorId: null },
    orderBy: { order: "asc" },
  });

  return (
    <footer className="border-t border-paper/10 bg-ink py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 text-center text-sm text-paper/70 sm:flex-row sm:justify-between sm:text-left">
        <Link href="/" aria-label="Retouch Africa home">
          <Logo variant="light" className="h-9 w-auto" />
        </Link>

        <div className="flex flex-col items-center gap-1 sm:items-start">
          <a href={`mailto:${settings.contactEmail}`} className="hover:text-gold">
            {settings.contactEmail}
          </a>
          <span>{settings.contactHandle}</span>
        </div>

        <div className="flex flex-col items-center gap-2 sm:items-end">
          <SocialIcons
            links={socialLinks}
            variant="light"
          />
          {settings.secondaryHandle && <span>{settings.secondaryHandle}</span>}
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-paper/40">{settings.copyrightLine}</p>
    </footer>
  );
}
