// Emails transactionnels via l'API REST Resend — simple fetch, pas de SDK.
// Gratuit jusqu'à 100 emails/jour. Ne doit jamais faire échouer la
// création de commande : erreurs loguées seulement.

import { formatPrice, SITE_NAME } from "@/lib/constants";
import { getEmailConfig } from "@/lib/settings";
import { getBaseUrl } from "@/lib/site";

export interface OrderEmailPayload {
  number: string;
  customerName: string;
  email: string;
  city: string;
  district: string;
  total: number;
  deliveryFee: number;
  items: { name: string; price: number; quantity: number }[];
  paymentLabel: string;
}

export async function sendOrderConfirmationEmail(order: OrderEmailPayload) {
  try {
    const cfg = await getEmailConfig();
    if (!cfg.orderConfirmationEnabled || !cfg.resendApiKey) return;

    const base = getBaseUrl();
    const itemRows = order.items
      .map(
        (i) =>
          `<tr><td style="padding:6px 12px;border-bottom:1px solid #eee">${i.name} × ${i.quantity}</td>` +
          `<td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:right">${formatPrice(i.price * i.quantity)}</td></tr>`
      )
      .join("");

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#1B1F5C">
        <h1 style="font-size:20px">Merci pour votre commande, ${order.customerName.split(" ")[0]} !</h1>
        <p>Votre commande <strong>${order.number}</strong> a bien été enregistrée.
        ${SITE_NAME} vous contactera pour la livraison à <strong>${order.district}, ${order.city}</strong>.</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px">${itemRows}</table>
        <p style="font-size:14px">Livraison : ${order.deliveryFee === 0 ? "gratuite" : formatPrice(order.deliveryFee)}<br/>
        <strong>Total : ${formatPrice(order.total)}</strong><br/>Paiement : ${order.paymentLabel}</p>
        <p style="font-size:13px">Suivez votre commande ici :
          <a href="${base}/compte" style="color:#0284c7">${base}/compte</a>
          (numéro ${order.number} + votre numéro de téléphone).</p>
        <p style="font-size:12px;color:#888">— ${SITE_NAME}</p>
      </div>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cfg.resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${SITE_NAME} <${cfg.fromEmail}>`,
        to: [order.email],
        subject: `Commande ${order.number} confirmée — ${SITE_NAME}`,
        html,
      }),
    });
    if (!res.ok) {
      console.error("[email] resend error", res.status, await res.text());
    }
  } catch (err) {
    console.error("[email] order confirmation failed", err);
  }
}
