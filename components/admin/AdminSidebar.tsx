import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { AdminSidebarShell } from "@/components/admin/AdminSidebarShell";

const LINKS = [
  { label: "Dashboard", href: "/admin" },
  { label: "Workshops", href: "/admin/workshops" },
  { label: "Facilitators", href: "/admin/facilitators" },
  { label: "Gallery", href: "/admin/gallery" },
  { label: "Partners", href: "/admin/partners" },
  { label: "Settings", href: "/admin/settings" },
  { label: "Submissions", href: "/admin/submissions" },
];

export async function AdminSidebar() {
  const session = await getSession();
  const user = session.userId ? await prisma.adminUser.findUnique({ where: { id: session.userId } }) : null;
  const links = user?.isSuperAdmin ? [...LINKS, { label: "Admin Users", href: "/admin/users" }] : LINKS;

  return <AdminSidebarShell links={links} />;
}
