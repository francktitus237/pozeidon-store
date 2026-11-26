"use server";

import { auth } from "@/auth";
import { getAiConfig } from "@/lib/settings";

// Génère une description produit via Gemini (tier gratuit Google AI Studio).
// Admin uniquement — la clé ne quitte jamais le serveur.
export async function generateProductDescription(input: {
  name: string;
  reference: string;
  categoryName: string;
  price: number;
}) {
  const session = await auth();
  if (!session) return { error: "Non authentifié" };

  const { geminiApiKey, model } = await getAiConfig();
  if (!geminiApiKey) {
    return {
      error:
        "Clé Gemini absente — ajoutez-la dans Réglages → Intelligence artificielle.",
    };
  }
  if (!input.name.trim()) {
    return { error: "Renseignez d'abord le nom de l'article." };
  }

  const prompt =
    "Tu es un rédacteur e-commerce. Rédige en français une description de " +
    "produit engageante et honnête, en 3 à 5 phrases, pour la fiche suivante :\n" +
    `- Nom : ${input.name}\n` +
    `- Référence : ${input.reference}\n` +
    `- Catégorie : ${input.categoryName}\n` +
    `- Prix : ${input.price} FCFA\n` +
    "Ton clair et rassurant, adapté au marché camerounais. Mets en avant " +
    "les bénéfices concrets pour le client. Pas d'emojis, pas de titre, " +
    "réponds uniquement avec le texte de la description.";

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
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );
    if (!res.ok) {
      const body = await res.text();
      console.error("[ai] gemini error", res.status, body);
      return { error: `Gemini a répondu ${res.status} — vérifiez la clé.` };
    }
    const json = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!text) return { error: "Réponse vide — réessayez." };
    return { ok: true, text };
  } catch {
    return { error: "Appel Gemini impossible — vérifiez votre connexion." };
  }
}
