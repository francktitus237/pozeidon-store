import { StoreProvider } from "@/lib/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";
import { CookieBanner } from "@/components/layout/cookie-banner";
import { AnnouncementBanner } from "@/components/layout/announcement-banner";
import { getAnnouncement, getAnnouncementBg, getCookieBanner } from "@/lib/settings";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cookieConfig, announcement] = await Promise.all([
    getCookieBanner(),
    getAnnouncement(),
  ]);

  return (
    <StoreProvider>
      <AnnouncementBanner
        announcement={announcement}
        bgClass={getAnnouncementBg(announcement.bg)}
      />
      <Header />
      {children}
      <Footer />
      <WhatsAppFloat />
      <CookieBanner config={cookieConfig} />
    </StoreProvider>
  );
}
