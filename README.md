# Pozeidon Store

> Boutique en ligne et dashboard d'administration pour **Pozeidon Engineering** — vente d'accessoires et équipements Starlink, câbles, supports, onduleurs et services d'installation au Cameroun.

## Fonctionnalités

### Storefront
- **Catalogue produits** par catégories avec fiches détaillées (photos, prix promo, stock, vidéo).
- **Recherche** multi-mots (nom, description, référence) — desktop et mobile.
- **Panier** avec quantités, frais de livraison par ville et persistance.
- **Suivi de commande** dans l'espace client (numéro + téléphone).
- **Bannière d'annonce animée** (marquee), modifiable depuis l'admin.
- **Vente flash** avec compte à rebours temps réel (sans mismatch SSR).
- **Pages** : Services, Installation, Entreprises, Contact, Conseils, À propos.

### Dashboard admin (`/gestion`)
- **Produits** : CRUD complet (modales, upload d'image, toasts, confirmation de suppression).
- **Commandes** : liste + changement de statut en direct.
- **Clients** : vue consolidée depuis les commandes (nom, téléphone, CA).
- **Statistiques** : chiffre d'affaires, commandes par statut, panier moyen.
- **Réglages** : texte, couleur et lien de la bannière d'annonce.
- **Installations** : suivi des demandes.

## Stack technique

| Domaine | Technologie |
|---|---|
| Framework | Next.js 16 (App Router, RSC, Server Actions, Turbopack) |
| UI | React 19, Tailwind CSS v4, Base UI, shadcn/ui, Lucide |
| État client | Redux Toolkit (`features/cart`) |
| Base de données | SQLite via Drizzle ORM (`dev.db`) |
| Auth | NextAuth v5 (credentials admin) |
| Validation | Zod, React Hook Form |

## Démarrage

```bash
npm install
npx drizzle-kit push         # créer les tables SQLite
npx tsx scripts/seed.ts      # données de démo
npm run dev                  # http://localhost:3000
```

### Variables d'environnement

Créer un fichier `.env.local` à la racine (non versionné) :

```env
DATABASE_URL="dev.db"
AUTH_SECRET="<openssl rand -base64 32>"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin123"
```

### Scripts utiles

```bash
npx drizzle-kit push      # synchroniser le schéma après modification de schema.ts
npx tsx scripts/seed.ts   # réinsérer les données de démo
npx drizzle-kit studio    # explorer la base
npx next build            # build de production
```

## Structure

```
app/            routes storefront + admin (App Router)
components/     UI (layout, shop, cart, admin, ui/)
features/       logique métier (products, cart, orders, admin)
lib/            db (Drizzle), settings, store, utils
hooks/          use-cart, etc.
types/          modèles partagés (Product, Order, CartItem…)
```

## À faire

- [ ] Intégration paiement MTN MoMo / Orange Money (routes API en place)
- [ ] Checkout complet en 4 étapes (`/commande`)
- [ ] Gestion des bannières du hero (`/gestion/bannieres`)
- [ ] Upload d'images produits via Cloudinary (packages installés)
