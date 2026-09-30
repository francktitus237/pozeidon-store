import { StoreProvider } from "@/lib/providers";
import { AdminSidebar } from "@/components/admin/sidebar";
import { Toaster } from "@/components/ui/toast";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <div className="flex min-h-screen bg-sky-50/40">
        <AdminSidebar />
        <section className="min-w-0 flex-1 overflow-y-auto p-6">
          <Toaster>{children}</Toaster>
        </section>
      </div>
    </StoreProvider>
  );
}
