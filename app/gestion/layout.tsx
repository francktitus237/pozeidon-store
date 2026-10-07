import { StoreProvider } from "@/lib/providers";
import { AdminSidebar } from "@/components/admin/sidebar";
import { Toaster } from "@/components/ui/toast";
import { db } from "@/lib/db";
import { orders, installationRequests } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let badges = { orders: 0, installations: 0 };
  try {
    const [pendingOrders, newInstallations] = await Promise.all([
      db.select().from(orders).where(eq(orders.status, "pending")),
      db
        .select()
        .from(installationRequests)
        .where(eq(installationRequests.status, "new")),
    ]);
    badges = {
      orders: pendingOrders.length,
      installations: newInstallations.length,
    };
  } catch {
    // DB indisponible : pas de badges, le layout reste fonctionnel
  }

  return (
    <StoreProvider>
      <div className="flex h-screen overflow-hidden bg-sky-50/40">
        <AdminSidebar badges={badges} />
        <section className="min-w-0 flex-1 overflow-y-auto p-6">
          <Toaster>{children}</Toaster>
        </section>
      </div>
    </StoreProvider>
  );
}
