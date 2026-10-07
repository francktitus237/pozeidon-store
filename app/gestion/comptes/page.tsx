import type { Metadata } from "next";
import { getAdminUsers } from "@/lib/settings";
import { UsersManager } from "@/components/admin/users-manager";

export const metadata: Metadata = { title: "Comptes admin — Admin" };
export const dynamic = "force-dynamic";

export default async function ComptesPage() {
  const users = await getAdminUsers();
  const envUser = process.env.ADMIN_USERNAME ?? "admin";

  return (
    <div className="p-6">
      <h1 className="mb-1 text-2xl font-bold text-navy-900">
        Comptes administrateurs
      </h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Créez des accès supplémentaires pour votre équipe. Les mots de passe
        sont stockés hachés.
      </p>
      <UsersManager rows={users} envUser={envUser} />
    </div>
  );
}
