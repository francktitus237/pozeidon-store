import Script from "next/script";
import { getAnalyticsConfig } from "@/lib/settings";

// Google Analytics 4 — injecté sur toutes les pages quand un ID de mesure
// est configuré dans Réglages. Rien n'est chargé sinon (zéro impact).
export async function Analytics() {
  const { gaId } = await getAnalyticsConfig();
  if (!/^G-[A-Z0-9]{4,20}$/i.test(gaId)) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`}
      </Script>
    </>
  );
}
