import type { Metadata } from "next";
import { displaySerif, bodySans } from "@/app/fonts";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getSiteSettings } from "@/lib/site-settings";
import { getSession } from "@/lib/session";
import { getSocialLinks } from "@/lib/queries";
import { JsonLd } from "@/components/shared/JsonLd";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "@/app/globals.css";

export const dynamic = "force-dynamic";

const DEFAULT_TITLE = "Retouch Africa — Elevating the Art of Retouching Across Africa";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: DEFAULT_TITLE, template: "%s — Retouch Africa" },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en",
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: DEFAULT_TITLE, description: SITE_DESCRIPTION },
};

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, session, socialLinks] = await Promise.all([getSiteSettings(), getSession(), getSocialLinks()]);
  const isAdmin = Boolean(session.isAdmin && session.userId);

  return (
    <html
      lang="en"
      className={`${displaySerif.variable} ${bodySans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink" suppressHydrationWarning>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": `${SITE_URL}/#organization`,
                name: SITE_NAME,
                url: SITE_URL,
                description: SITE_DESCRIPTION,
                email: settings.contactEmail,
                sameAs: socialLinks.map((link) => link.url),
              },
              { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL, name: SITE_NAME },
            ],
          }}
        />
        <Header isAdmin={isAdmin} />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}
