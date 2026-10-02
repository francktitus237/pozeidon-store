import { StoreProvider } from "@/lib/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";
import { CookieBanner } from "@/components/layout/cookie-banner";
import { getCookieBanner } from "@/lib/settings";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieConfig = await getCookieBanner();

  return (
    <StoreProvider>
      <Header />
      {children}
      <Footer />
      <WhatsAppFloat />
      <CookieBanner config={cookieConfig} />
    </StoreProvider>
  );
}
