import { StoreProvider } from "@/lib/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";
import { CookieBanner } from "@/components/layout/cookie-banner";
import { AnnouncementBanner } from "@/components/layout/announcement-banner";
import { AiAssistant } from "@/components/shop/ai-assistant";
import {
  getAiConfig,
  getAnnouncement,
  getAnnouncementBg,
  getContact,
  getCookieBanner,
} from "@/lib/settings";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cookieConfig, announcement, aiConfig, contact] = await Promise.all([
    getCookieBanner(),
    getAnnouncement(),
    getAiConfig(),
    getContact(),
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
      {aiConfig.geminiApiKey && (
        <AiAssistant whatsapp={contact.whatsapp} />
      )}
      <CookieBanner config={cookieConfig} />
    </StoreProvider>
  );
}
