import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth";
import { deleteAdminUserAction } from "@/lib/actions/admins";
import { AdminUserForm } from "@/components/admin/forms/AdminUserForm";

export default async function AdminUsersPage() {
  const { session } = await requireSuperAdmin();
  const admins = await prisma.adminUser.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div>
      <h1 className="font-display text-2xl">Admin Users</h1>
      <p className="mt-1 text-sm text-ink/50">Only super admins can view or manage this page.</p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-left text-xs uppercase tracking-wide text-ink/50">
              <th className="py-2 pr-4 font-medium">Email</th>
              <th className="py-2 pr-4 font-medium">Role</th>
              <th className="py-2 pr-4 font-medium">Added</th>
              <th className="py-2 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id} className="border-b border-ink/5">
                <td className="py-3 pr-4">
                  {admin.email}
                  {admin.id === session.userId && <span className="ml-2 text-xs text-ink/40">(you)</span>}
                </td>
                <td className="py-3 pr-4">{admin.isSuperAdmin ? "Super Admin" : "Admin"}</td>
                <td className="py-3 pr-4">{admin.createdAt.toLocaleDateString()}</td>
                <td className="py-3 text-right">
                  {admin.id !== session.userId && admins.length > 1 && (
                    <form
                      action={async () => {
                        "use server";
                        await deleteAdminUserAction(admin.id);
                      }}
                    >
                      <button type="submit" className="text-xs text-red-600 underline hover:text-red-800">
                        Remove
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10 max-w-md">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gold">Add Admin User</h2>
        <AdminUserForm />
      </div>
    </div>
  );
}
