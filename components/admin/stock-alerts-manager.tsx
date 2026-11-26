"use client";

import { useTransition } from "react";
import { Bell, MessageCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import { toDate } from "@/lib/dates";
import { deleteStockAlert } from "@/features/stock-alerts/actions";
import { PaginatedTable } from "@/components/admin/paginated-table";
import type { StockAlertRow } from "@/features/stock-alerts/queries";

const STATUS: Record<string, { label: string; className: string }> = {
  in_stock: { label: "En stock", className: "bg-stock-in text-white" },
  on_order: { label: "Sur commande", className: "bg-stock-order text-white" },
  out_of_stock: { label: "Épuisé", className: "bg-stock-out text-white" },
};

// Clients à prévenir au retour en stock — emails partis automatiquement,
// les numéros se relancent en 1 clic sur WhatsApp.
export function StockAlertsManager({ rows }: { rows: StockAlertRow[] }) {
  const [pending, startTransition] = useTransition();
  const active = rows.filter((r) => !r.notifiedAt);

  function onDelete(r: StockAlertRow) {
    startTransition(async () => {
      await deleteStockAlert(r.id);
      toast.add({
        title: "Alerte supprimée",
        description: `${r.productName} — ${r.phone}`,
        type: "success",
      });
    });
  }

  function waLink(r: StockAlertRow) {
    const digits = r.phone.replace(/[^\d]/g, "");
    const msg = encodeURIComponent(
      `Bonjour, l'article « ${r.productName} » que vous attendiez ` +
        `est disponible sur notre boutique. Souhaitez-vous passer commande ?`
    );
    return `https://wa.me/${digits}?text=${msg}`;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Alertes stock</h1>
        <p className="text-sm text-muted-foreground">
          {active.length} client{active.length > 1 ? "s" : ""} attend
          {active.length > 1 ? "ent" : ""} un retour en stock — les emails
          partent automatiquement, relancez les autres sur WhatsApp.
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
          Aucune alerte pour le moment. Quand un article est épuisé, le bouton
          « Prévenez-moi » apparaît sur sa fiche produit.
        </p>
      ) : (
        <PaginatedTable
          headers={["Article", "Téléphone", "Email", "Statut article", "Inscrit le", ""]}
        >
          {rows.map((r) => (
            <tr key={r.id} className="border-b last:border-0">
              <td className="px-4 py-2.5 font-medium text-navy-900">
                {r.productName}
              </td>
              <td className="px-4 py-2.5">
                <a
                  href={waLink(r)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-whatsapp-500 hover:underline"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  {r.phone}
                </a>
              </td>
              <td className="px-4 py-2.5 text-muted-foreground">
                {r.email ?? "—"}
              </td>
              <td className="px-4 py-2.5">
                <Badge className={STATUS[r.productStatus]?.className}>
                  {STATUS[r.productStatus]?.label ?? r.productStatus}
                </Badge>
              </td>
              <td className="px-4 py-2.5 text-muted-foreground">
                {toDate(r.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                })}
                {r.notifiedAt && (
                  <span className="ml-2 inline-flex items-center gap-1 text-xs text-stock-in">
                    <Bell className="h-3 w-3" /> notifié
                  </span>
                )}
              </td>
              <td className="px-4 py-2.5 text-right">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={pending}
                  onClick={() => onDelete(r)}
                  aria-label="Supprimer l'alerte"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </td>
            </tr>
          ))}
        </PaginatedTable>
      )}
    </div>
  );
}
