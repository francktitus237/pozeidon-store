# Charte graphique — Pozeidon Engineering

Issue du logo : trident navy sur médaillon bleu ciel, fond blanc.

## Palette de couleurs

| Rôle | Token Tailwind | Valeur | Usage |
|---|---|---|---|
| **Primaire** | `navy-900` | `#1B1F5C` | Header bandeau, footer, titres, prix, liens actifs |
| **Secondaire** | `sky-500` | `#4FA9DC` | Médaillon, focus ring, icônes, surlignage |
| **Secondaire clair** | `sky-100` | tinte 90% | Fonds de sections, badges, hover doux |
| **CTA** | `cta-500` | `#F97316` | Boutons d'achat UNIQUEMENT (Commander, Ajouter au panier) |
| **CTA hover** | `cta-600` | — | Survol des boutons orange |
| **WhatsApp** | `whatsapp-500` | `#16A34A` | Bouton flottant / contact — jamais ailleurs |
| **En stock** | `stock-in` | vert | Pastille disponibilité |
| **Sur commande** | `stock-order` | orange | Pastille disponibilité |
| **Épuisé** | `stock-out` | rouge | Pastille disponibilité |
| **Fond** | `background` | blanc | Photos produits en vedette |
| **Texte** | `foreground` | quasi-noir | Corps de texte |
| **Destructive** | `destructive` | rouge | Erreurs, suppressions |

## Règles d'usage

- **Orange CTA** : un seul bouton orange par zone visible. C'est la couleur la plus rare = la plus regardée.
- **Bleu navy** : autorité — headers, footer, texte fort. Jamais de bouton navy sur fond navy.
- **Bleu ciel** : technique et léger — hover, skeletons, badges "Nouveau", sélection.
- **Jamais** de dégradés criards, jamais de clignotement (règle du document : une animation sert à comprendre).
- Logos de paiement (MoMo, OM) sur fond blanc ou navy, jamais modifiés.

## Typographie

- **Font principale** : Geist Sans (déjà installée) — moderne, très lisible sur mobile.
- **Titres** : `font-bold` navy. Hiérarchie : `text-3xl` (hero) > `text-2xl` (section) > `text-lg` (carte).
- **Prix** : `font-bold`, navy, FCFA formaté avec `formatPrice()`.
- **Ancien prix** : `line-through` en `muted-foreground`, `%` de remise en rouge.

## Composants

- **Bouton primaire (achat)** : `bg-cta-500 text-white` → `hover:bg-cta-600`
- **Bouton secondaire** : `border-navy-900 text-navy-900` outline
- **Bouton WhatsApp** : `bg-whatsapp-500 text-white`
- **Carte produit** : fond blanc, `border`, `rounded-lg`, `hover:-translate-y-1 shadow-md` (élévation au survol)
- **Pastille stock** : point coloré 8px + texte (`● En stock`)
- **Badge promo** : `bg-cta-500 text-white` — `-20%`

## Accessibilité

- Contraste AA minimum : texte navy sur blanc OK, blanc sur navy OK,
  blanc sur CTA-500 OK pour les gros boutons.
- Boutons tactiles ≥ 44px de hauteur sur mobile.
