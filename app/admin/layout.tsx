import type { Metadata } from "next";
import { displaySerif, bodySans } from "@/app/fonts";
import { getSession } from "@/lib/session";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import "@/app/globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin — Retouch Africa",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const isLoggedIn = Boolean(session.isAdmin && session.userId);

  return (
    <html lang="en" className={`${displaySerif.variable} ${bodySans.variable} h-full antialiased`}>
      <body className="min-h-full bg-paper text-ink" suppressHydrationWarning>
        {isLoggedIn ? (
          <div className="min-h-screen lg:flex">
            <AdminSidebar />
            <div className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">{children}</div>
          </div>
        ) : (
          // proxy.ts already redirects unauthenticated /admin/** requests to /admin/login,
          // so reaching here unauthenticated only happens for /admin/login itself.
          <div className="min-h-screen">{children}</div>
        )}
      </body>
    </html>
  );
}
