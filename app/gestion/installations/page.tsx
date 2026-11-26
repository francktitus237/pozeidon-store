export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { installationRequests } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { InstallationManager } from "@/components/admin/installation-manager";

export default async function AdminInstallationsPage() {
  const rows = await db
    .select()
    .from(installationRequests)
    .orderBy(desc(installationRequests.createdAt));

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-navy-900">
        Demandes d&apos;installation
      </h1>
      {rows.length === 0 ? (
        <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
          Aucune demande d&apos;installation pour l&apos;instant.
        </div>
      ) : (
        <InstallationManager rows={rows} />
      )}
    </div>
  );
}
