export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { installationRequests } from "@/lib/db/schema";
import { Badge } from "@/components/ui/badge";
import { PaginatedUl } from "@/components/admin/paginated-table";
const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  new: { label: "Nouvelle", className: "bg-stock-order text-white" },
  quoted: { label: "Devis envoyé", className: "bg-sky-500 text-white" },
  scheduled: { label: "Planifiée", className: "bg-navy-500 text-white" },
  done: { label: "Terminée", className: "bg-stock-in text-white" },
  cancelled: { label: "Annulée", className: "bg-stock-out text-white" },
};

export default async function AdminInstallationsPage() {
  const rows = await db.select().from(installationRequests);

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
        <PaginatedUl pageSize={10}>
          {rows.map((r) => {
            const s = STATUS_LABEL[r.status] ?? STATUS_LABEL.new;
            return (
              <li
                key={r.id}
                className="flex items-center justify-between px-4 py-3"
              >
                <span className="font-medium">{r.name}</span>
                <span>
                  {r.city} — {r.district}
                </span>
                <Badge className={s.className}>{s.label}</Badge>
              </li>
            );
          })}
        </PaginatedUl>
      )}
    </div>
  );
}
