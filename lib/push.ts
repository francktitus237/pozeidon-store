// Notifications push navigateur pour l'admin — 100 % gratuit, aucun service
// payant : le push transite par les serveurs push des navigateurs (Web Push /
// VAPID). Les clés VAPID sont auto-générées une fois et stockées en base.

import { generateVAPIDKeys, sendNotification, setVapidDetails } from "web-push";
import { db } from "@/lib/db";
import { settings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { formatPrice } from "@/lib/constants";
import { getBaseUrl } from "@/lib/site";

const KEY_VAPID = "vapid_keys";
const KEY_SUBS = "push_subscriptions";

interface VapidKeys {
  publicKey: string;
  privateKey: string;
}

interface PushSub {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

async function readRow(key: string): Promise<string | null> {
  const row = await db.query.settings.findFirst({
    where: eq(settings.key, key),
  });
  return row?.value ?? null;
}

async function writeRow(key: string, value: string) {
  await db
    .insert(settings)
    .values({ key, value, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: settings.key,
      set: { value, updatedAt: new Date() },
    });
}

// Génère la paire VAPID à la première utilisation — aucune config à faire.
async function getVapidKeys(): Promise<VapidKeys> {
  const raw = await readRow(KEY_VAPID);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as VapidKeys;
      if (parsed.publicKey && parsed.privateKey) return parsed;
    } catch {
      // régénère ci-dessous
    }
  }
  const keys = generateVAPIDKeys();
  await writeRow(KEY_VAPID, JSON.stringify(keys));
  return keys;
}

export async function getPushPublicKey(): Promise<string> {
  return (await getVapidKeys()).publicKey;
}

export async function listPushSubscriptions(): Promise<PushSub[]> {
  const raw = await readRow(KEY_SUBS);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as PushSub[]) : [];
  } catch {
    return [];
  }
}

export async function savePushSubscription(sub: PushSub) {
  if (!sub?.endpoint || !sub?.keys?.p256dh || !sub?.keys?.auth) return;
  const subs = await listPushSubscriptions();
  if (!subs.some((s) => s.endpoint === sub.endpoint)) {
    subs.push(sub);
    await writeRow(KEY_SUBS, JSON.stringify(subs));
  }
}

export async function deletePushSubscription(endpoint: string) {
  const subs = await listPushSubscriptions();
  await writeRow(
    KEY_SUBS,
    JSON.stringify(subs.filter((s) => s.endpoint !== endpoint))
  );
}

// Envoie une notification à tous les appareils abonnés (PC, téléphone admin).
// Ne doit jamais faire échouer le code appelant : erreurs loguées seulement.
async function sendPush(payload: { title: string; body: string; url: string }) {
  try {
    const subs = await listPushSubscriptions();
    if (!subs.length) return;
    const keys = await getVapidKeys();
    setVapidDetails(getBaseUrl(), keys.publicKey, keys.privateKey);

    const body = JSON.stringify(payload);
    const dead: string[] = [];
    await Promise.all(
      subs.map(async (sub) => {
        try {
          await sendNotification(
            { endpoint: sub.endpoint, keys: sub.keys },
            body
          );
        } catch (err) {
          const status = (err as { statusCode?: number })?.statusCode;
          // 404/410 = abonnement expiré côté navigateur → on le nettoie
          if (status === 404 || status === 410) dead.push(sub.endpoint);
          else console.error("[push] send error", err);
        }
      })
    );
    for (const endpoint of dead) await deletePushSubscription(endpoint);
  } catch (err) {
    console.error("[push] notification failed", err);
  }
}

export interface OrderPushPayload {
  number: string;
  customerName: string;
  city: string;
  total: number;
  itemCount: number;
}

export async function sendOrderPush(order: OrderPushPayload) {
  await sendPush({
    title: `Nouvelle commande ${order.number}`,
    body: `${order.customerName} · ${order.city} — ${formatPrice(order.total)} (${order.itemCount} article${order.itemCount > 1 ? "s" : ""})`,
    url: "/gestion/commandes",
  });
}

// Alerte quand le stock d'un article passe sous le seuil après une commande.
export async function sendStockAlertPush(
  productName: string,
  newStock: number
) {
  await sendPush({
    title: newStock === 0 ? "Stock épuisé" : "Stock bas",
    body: `${productName} — ${newStock === 0 ? "épuisé, article passé hors stock" : `il reste ${newStock} en stock`}`,
    url: "/gestion/articles",
  });
}
