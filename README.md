# Pozeidon Store

> Boutique en ligne et dashboard d'administration pour **Pozeidon Engineering** — vente d'accessoires et équipements Starlink, câbles, supports, onduleurs et services d'installation au Cameroun.

## Fonctionnalités

### Storefront
- **Catalogue produits** par catégories avec fiches détaillées (galerie multi-photos + lightbox, vidéo YouTube/mp4, prix promo, stock).
- **Seed automatique** : au démarrage, le catalogue (ordinateurs Glotelho) et ses images sont peuplés en base si absents (`lib/seed-runner.ts`).
- **Recherche** multi-mots (nom, description, référence) — desktop et mobile.
- **Panier** Redux Toolkit avec quantités, frais de livraison par ville et persistance.
- **Codes promo** au panier et au checkout (pourcentage, usage limité).
- **Suivi de commande** dans l'espace client (numéro + téléphone).
- **Bannière d'annonce animée** (marquee), fermable par l'utilisateur, modifiable depuis l'admin.
- **Bannière cookies** configurable.
- **SEO** : sitemap dynamique, robots.txt, OpenGraph produit/catégorie/page.
- **Pages** : Services, Installation, Entreprises, Contact, Conseils, À propos, Mentions légales, CGV, Confidentialité, Livraison & retours.

### Dashboard admin (`/gestion`)
- **Produits** : CRUD complet — multi-photos par article (vue face/arrière…, photo principale au choix via ★), vidéo (upload mp4/webm/mov ou URL YouTube), badges promo/stock/nouveau.
- **Commandes** : liste filtrable, changement de statut, export CSV.
- **Clients** : vue consolidée depuis les commandes (nom, téléphone, CA).
- **Statistiques** : KPI chiffre d'affaires, commandes, panier moyen, alertes stock.
- **Réglages** : contact, livraison, paiement, bannière d'annonce, bannière cookies, codes promo.
- **Contenu** : réalisations, témoignages, conseils, vidéo promotionnelle.
- **Installations** : suivi des demandes.

## Stack technique

| Domaine | Technologie |
|---|---|
| Framework | Next.js 16 (App Router, RSC, Server Actions) |
| UI | React 19, Tailwind CSS v4, Base UI, shadcn/ui, Lucide |
| État client | Redux Toolkit |
| Base de données | Postgres en production, SQLite en développement (Drizzle ORM) |
| Auth | NextAuth v5 (credentials admin) |
| Validation | Zod, React Hook Form |
| Uploads | Table `files` en base (base64) par défaut, disque en secours, Cloudinary optionnel |
| Déploiement | Docker (`output: standalone`) sur Dokploy / VPS |

## Démarrage en local

### 1. Installer les dépendances

```bash
npm install
```

### 2. Créer le fichier `.env.local`

À la racine du projet :

```env
# Base de données locale SQLite
DATABASE_URL="dev.db"

# Clé secrète NextAuth (génère une valeur avec : openssl rand -base64 32)
AUTH_SECRET="change-moi-immédiatement"

# Identifiants admin /gestion
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin123"

# URL canonique du site (optionnel en dev)
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 3. Initialiser la base de données

```bash
npx tsx scripts/init-dev-db.ts
```

Ce script crée les tables SQLite et les catégories par défaut.

### 4. Lancer le serveur de développement

```bash
npm run dev
```

Le site est disponible sur [http://localhost:3000](http://localhost:3000).
L'admin est sur [http://localhost:3000/gestion](http://localhost:3000/gestion).

### Scripts utiles

```bash
npx drizzle-kit push            # synchroniser le schéma SQLite
npx drizzle-kit studio          # explorer la base SQLite
npx tsc --noEmit                # vérifier les types
npm run build                   # build de production local
```

## Variables d'environnement

| Variable | Requise | Description |
|---|---|---|
| `DATABASE_URL` | Oui | `postgres://...` en production, `dev.db` en local |
| `AUTH_SECRET` | Oui | Clé secrète NextAuth |
| `ADMIN_USERNAME` | Oui | Identifiant admin |
| `ADMIN_PASSWORD` | Oui | Mot de passe admin |
| `NEXT_PUBLIC_SITE_URL` | Fortement conseillée | URL publique du site (`https://pozeidon.floobank.com`) |
| `UPLOAD_DIR` | Non | Chemin du dossier uploads disque (fallback uniquement) |
| `CLOUDINARY_CLOUD_NAME` | Non | Nom du cloud Cloudinary |
| `CLOUDINARY_API_KEY` | Non | Clé API Cloudinary |
| `CLOUDINARY_API_SECRET` | Non | Secret API Cloudinary |

> **Cloudinary** : si ces 3 variables sont renseignées, les uploads d'images/vidéos sont envoyés sur Cloudinary au lieu de la table `files`.

## Upload d'images et vidéos

### Option A — Stockage en base (par défaut)

Sans Cloudinary, `POST /api/upload` enregistre le fichier **dans la table `files` de la base** (base64 + MIME). Il est ensuite servi par la route `/uploads/<nom>`.

- **Aucun volume Docker requis** — les fichiers survivent aux redéploiements puisqu'ils sont en base.
- Images : max 5 Mo. Vidéos (mp4/webm/mov) : max 100 Mo (attention : une vidéo lourde grossit fortement la base — préférer YouTube ou Cloudinary).
- Les images du seed catalogue (`public/images/products/`) sont aussi copiées dans `files` au démarrage.

### Option B — Cloudinary

Ajoute les 3 variables `CLOUDINARY_*` dans l'environnement de production. Les uploads partent sur Cloudinary — recommandé si tu prévois beaucoup de vidéos ou d'images lourdes.

### Secours disque

La route `/uploads/[name]` vérifie aussi le disque (`UPLOAD_DIR` ou `uploads/`) puis `public/images/` pour les fichiers écrits avant la migration en base.

## Déploiement avec Docker (Dokploy)

Le projet inclut un `Dockerfile` optimisé pour `output: "standalone"`.

### Étapes

1. **Pousse le code** sur GitHub/GitLab.
2. Dans Dokploy, crée un service **Application** et connecte le dépôt.
3. Dans **Environment**, ajoute les variables obligatoires :

   ```env
   DATABASE_URL=postgres://user:password@host:5432/pozeidon
   AUTH_SECRET=<valeur-sécurisée>
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=<mot-de-passe-fort>
   NEXT_PUBLIC_SITE_URL=https://ton-domaine.com
   ```

4. Redéploie le service.

### Seed automatique au déploiement

Au démarrage (`instrumentation.ts` → `lib/init-db.ts`), l'application :

1. crée/vérifie les tables Postgres (dont `files`),
2. insère les catégories si la table est vide,
3. **seede le catalogue** (`lib/seed-runner.ts`) : les images de `public/images/products/` sont copiées dans la table `files`, puis les produits absents sont insérés. Idempotent — aucun doublon aux redémarrages.

Log attendu : `[db] Catalogue seedé : N produits, M images en base.`

Pour relancer le seed manuellement : `GET /api/admin/seed-catalog` (authentifié).

### Volume /app/uploads — attention

Le montage d'un volume n'est **plus nécessaire** pour les uploads (stockage en base). Si tu configures quand même un **bind mount** dans Dokploy (Mount Path `/app/uploads`), **le dossier source doit exister sur l'hôte** :

```bash
sudo mkdir -p /app/uploads   # sur le VPS, sinon Swarm rejette les tâches
```

Sans ce dossier, les tâches sont rejetées avec `bind source path does not exist: /app/uploads` et le site renvoie Bad Gateway.

### Points d'attention

- `output: "standalone"` est activé dans `next.config.ts`.
- Les images du site sont servies en mode `unoptimized` car le package `sharp` n'est pas inclus dans l'image Docker. Cela évite les erreurs d'optimisation d'images en production.
- Les fichiers uploadés vont en base par défaut : aucun volume nécessaire, ils survivent aux rebuilds.

## Structure du projet

```
app/            routes storefront + admin (App Router)
components/     UI (layout, shop, cart, admin, ui/)
features/       logique métier (products, cart, orders, admin)
lib/            db (Drizzle + tables files), settings, store, utils
                seed-catalog.ts (données), seed-runner.ts (seed auto au démarrage)
hooks/          use-cart, etc.
types/          modèles partagés (Product, Order, CartItem…)
public/         images statiques, logo, favicon
uploads/        fichiers uploadés en local — fallback disque (non versionné)
Dockerfile      image de production
```

## Dépannage courant

### Les images du hero ne s'affichent pas après déploiement
- Vérifie que `images.unoptimized: true` est bien dans `next.config.ts`.
- Redéploie après modification de la config.

### Bad Gateway — le conteneur ne démarre pas
- Dans Dokploy → Deployments, ou SSH : `docker service ps <service> --no-trunc | head -15` pour voir pourquoi les tâches sont rejetées.
- Erreur fréquente : `bind source path does not exist: /app/uploads` → créer le dossier sur l'hôte : `sudo mkdir -p /app/uploads`. Le service redémarre tout seul, sans redeploy.

### Les images produit ne s'affichent pas
- Les fichiers `/uploads/<nom>` sont servis depuis la table `files` — vérifier que l'upload a bien abouti (log `[upload] saved in db`).
- Les images du catalogue seedé sont copiées dans `files` au démarrage — vérifier le log `[db] Catalogue seedé`.

### L'upload d'image renvoie 502
- Le conteneur ne tourne probablement pas (voir Bad Gateway ci-dessus).
- Consulte les logs Dokploy pour voir le message d'erreur exact.

### La base de données ne se connecte pas en production
- Vérifie que `DATABASE_URL` commence bien par `postgres://`.
- Vérifie que le service Postgres est accessible depuis le conteneur applicatif.
