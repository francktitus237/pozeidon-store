export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getStockAlerts } from "@/features/stock-alerts/queries";
import { StockAlertsManager } from "@/components/admin/stock-alerts-manager";

export default async function AdminStockAlertsPage() {
  const session = await auth();
  if (!session) redirect("/connexion");

  const rows = await getStockAlerts();
  return <StockAlertsManager rows={rows} />;
}
