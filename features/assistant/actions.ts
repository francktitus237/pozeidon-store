"use server";

import { getAiConfig, getContact, getTariffs } from "@/lib/settings";
import { getCategories, getProducts } from "@/features/products/queries";
import { formatPrice, SITE_NAME } from "@/lib/constants";

// Assistant virtuel côté client — la clé Gemini reste sur le serveur.
// Garde-fous : longueur de message et historique bornés, contexte catalogue
// limité aux 150 premiers articles.

const MAX_MSG = 500;
const MAX_HISTORY = 10;
const MAX_PRODUCTS = 150;

const STATUS: Record<string, string> = {
  in_stock: "en stock",
  on_order: "sur commande",
  out_of_stock: "épuisé",
};

export interface ChatTurn {
  role: "user" | "model";
  text: string;
}

export async function askAssistant(message: string, history: ChatTurn[]) {
  const { geminiApiKey, model } = await getAiConfig();
  if (!geminiApiKey) return { error: "Assistant indisponible pour le moment." };

  const text = message.trim().slice(0, MAX_MSG);
  if (!text) return { error: "Message vide." };

  const [products, categories, contact, tariffs] = await Promise.all([
    getProducts(),
    getCategories(),
    getContact(),
    getTariffs(),
  ]);

  const catName = new Map(categories.map((c) => [c.slug, c.name]));
  const catalog = products
    .slice(0, MAX_PRODUCTS)
    .map(
      (p) =>
        `- ${p.name} | ${formatPrice(p.promoPrice ?? p.price)} | ` +
        `${STATUS[p.status] ?? p.status} | ${catName.get(p.categoryId) ?? p.categoryId} | ` +
        `lien: /produit/${p.slug}`
    )
    .join("\n");

  const cities =
    Object.keys(tariffs.deliveryCities).join(", ") || "Douala, Yaoundé";

  const system =
    `Tu es l'assistant virtuel de ${SITE_NAME}, boutique e-commerce au ` +
    `Cameroun (produits Starlink, informatique, énergie, installation). ` +
    `Réponds en français, en 1 à 4 phrases maximum, ton chaleureux et pro.\n` +
    `RÈGLES STRICTES :\n` +
    `- Tu ne réponds QUE sur la boutique, les produits, les prix, le stock, ` +
    `la livraison, le paiement et le suivi de commande.\n` +
    `- Prix : cite UNIQUEMENT les prix exacts du catalogue, jamais d'invention.\n` +
    `- Paiement : uniquement à la livraison.\n` +
    `- Livraison : ${cities} (frais selon la ville).\n` +
    `- Suivi de commande : page « Espace client » du site, avec le numéro ` +
    `PZE-… et le téléphone ; un lien « Numéro oublié ? » existe aussi.\n` +
    `- Installation Starlink : formulaire sur la page Installation.\n` +
    `- Recommande un article avec son lien /produit/<slug>.\n` +
    `- Hors sujet ou demande complexe → inviter à écrire sur WhatsApp ` +
    `(${contact.whatsapp}).\n` +
    `- Pas d'emojis, pas de titres markdown.\n` +
    `CATALOGUE (${products.length} articles) :\n${catalog}`;

  const contents = [
    ...history.slice(-MAX_HISTORY).map((t) => ({
      role: t.role,
      parts: [{ text: t.text.slice(0, 2000) }],
    })),
    { role: "user" as const, parts: [{ text }] },
  ];

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "x-goog-api-key": geminiApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents,
          generationConfig: { maxOutputTokens: 350 },
        }),
      }
    );
    if (!res.ok) {
      const body = await res.text();
      console.error("[assistant] gemini error", res.status, body);
      return { error: `Assistant indisponible (${res.status}) — réessayez.` };
    }
    const json = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const out = json.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!out) return { error: "Pas de réponse — reformulez votre question." };
    return { ok: true, text: out };
  } catch {
    return { error: "Connexion impossible — réessayez dans un instant." };
  }
}

// Synthèse vocale d'une réponse — Gemini TTS renvoie du PCM 24 kHz mono
// 16 bits en base64 ; le client l'enrobe dans un en-tête WAV pour lecture.
export async function speakAssistant(text: string) {
  const { geminiApiKey, ttsModel, ttsVoice } = await getAiConfig();
  if (!geminiApiKey) return { error: "Voix indisponible pour le moment." };

  const input = text.trim().slice(0, 800);
  if (!input) return { error: "Rien à lire." };

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${ttsModel}:generateContent`,
      {
        method: "POST",
        headers: {
          "x-goog-api-key": geminiApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Texte direct, sans consigne : le préfixe d'instruction déclenche
          // un finishReason OTHER sans audio chez les modèles TTS.
          contents: [{ parts: [{ text: input }] }],
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: ttsVoice },
              },
            },
          },
        }),
      }
    );
    if (!res.ok) {
      const body = await res.text();
      console.error("[assistant] tts error", res.status, body);
      return { error: `Voix indisponible (${res.status}).` };
    }
    const json = (await res.json()) as {
      candidates?: {
        content?: {
          parts?: { inlineData?: { data?: string; mimeType?: string } }[];
        };
      }[];
    };
    const part = json.candidates?.[0]?.content?.parts?.[0]?.inlineData;
    if (!part?.data) return { error: "Pas d'audio — réessayez." };
    return { ok: true, audio: part.data, mimeType: part.mimeType ?? "audio/L16;rate=24000" };
  } catch {
    return { error: "Connexion impossible — réessayez." };
  }
}
