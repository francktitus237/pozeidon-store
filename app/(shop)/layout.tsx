import { StoreProvider } from "@/lib/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <Header />
      {children}
      <Footer />
      <WhatsAppFloat />
    </StoreProvider>
  );
}
