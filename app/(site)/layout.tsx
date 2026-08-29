import type { Metadata } from "next";
import { displaySerif, bodySans } from "@/app/fonts";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getSiteSettings } from "@/lib/site-settings";
import { getSession } from "@/lib/session";
import "@/app/globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Retouch Africa — Elevating the Art of Retouching Across Africa",
  description:
    "Retouch Africa is a creative community, platform and movement dedicated to educating, inspiring and connecting retouchers, photographers and digital artists across the continent.",
};

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, session] = await Promise.all([getSiteSettings(), getSession()]);
  const isAdmin = Boolean(session.isAdmin && session.userId);

  return (
    <html
      lang="en"
      className={`${displaySerif.variable} ${bodySans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink" suppressHydrationWarning>
        <Header isAdmin={isAdmin} />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}
