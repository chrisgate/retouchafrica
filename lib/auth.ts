import "server-only";
import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

/**
 * Guard for admin-only Server Actions/pages. Defense-in-depth alongside
 * proxy.ts, which already blocks unauthenticated /admin/** requests.
 */
export async function requireAdmin() {
  const session = await getSession();
  if (!session.isAdmin || !session.userId) {
    redirect("/admin/login");
  }
  return session;
}

/**
 * Guard for the admin-user-management area — only super admins may view or
 * mutate other admin accounts. Renders a 404 (rather than redirecting) for
 * non-super admins so the page's existence isn't revealed to them.
 */
export async function requireSuperAdmin() {
  const session = await requireAdmin();
  const user = await prisma.adminUser.findUnique({ where: { id: session.userId } });
  if (!user?.isSuperAdmin) {
    notFound();
  }
  return { session, user };
}
