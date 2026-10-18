# Pozeidon Store

> Boutique en ligne et dashboard d'administration pour **Pozeidon Engineering** — vente d'accessoires et équipements Starlink, câbles, supports, onduleurs et services d'installation au Cameroun.

## Fonctionnalités

### Storefront
- **Catalogue produits** par catégories avec fiches détaillées (photos, prix promo, stock, vidéo).
- **Recherche** multi-mots (nom, description, référence) — desktop et mobile.
- **Panier** Redux Toolkit avec quantités, frais de livraison par ville et persistance.
- **Codes promo** au panier et au checkout (pourcentage, usage limité).
- **Suivi de commande** dans l'espace client (numéro + téléphone).
- **Bannière d'annonce animée** (marquee), fermable par l'utilisateur, modifiable depuis l'admin.
- **Bannière cookies** configurable.
- **SEO** : sitemap dynamique, robots.txt, OpenGraph produit/catégorie/page.
- **Pages** : Services, Installation, Entreprises, Contact, Conseils, À propos, Mentions légales, CGV, Confidentialité, Livraison & retours.

### Dashboard admin (`/gestion`)
- **Produits** : CRUD complet (upload d'images/vidéos, badges promo/stock/nouveau).
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
| Uploads | Disque local (`uploads/`) ou Cloudinary |
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
| `UPLOAD_DIR` | Non | Chemin du dossier uploads (`/app/uploads` en Docker) |
| `CLOUDINARY_CLOUD_NAME` | Non | Nom du cloud Cloudinary |
| `CLOUDINARY_API_KEY` | Non | Clé API Cloudinary |
| `CLOUDINARY_API_SECRET` | Non | Secret API Cloudinary |

> **Cloudinary** : si ces 3 variables sont renseignées, les uploads d'images/vidéos sont envoyés sur Cloudinary au lieu du disque local.

## Upload d'images

### Option A — Disque local (par défaut)

Les fichiers sont écrits dans le dossier `uploads/` à la racine du projet (ou `UPLOAD_DIR` s'il est défini). Ils sont servis par la route `/uploads/[name]`.

**En production avec Docker, il faut impérativement monter un volume** sur `/app/uploads`, sinon les fichiers sont perdus à chaque redéploiement.

### Option B — Cloudinary

Ajoute les 3 variables Cloudinary dans l'environnement de production. Les URLs retournées sont persistantes et fiables. C'est l'option recommandée si tu déploies sur une plateforme sans volume persistant.

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

4. **Volume indispensable** (pour conserver les uploads) :
   - Va dans l'onglet **Advanced** puis **Volumes**.
   - Ajoute :
     - **Mount Path** : `/app/uploads`
     - **Volume Path** : `/var/lib/dokploy/volumes/pozeidon-uploads`
   - Sauvegarde et redéploie.

5. Redéploie le service.

### Points d'attention

- `output: "standalone"` est activé dans `next.config.ts`.
- Les images du site sont servies en mode `unoptimized` car le package `sharp` n'est pas inclus dans l'image Docker. Cela évite les erreurs d'optimisation d'images en production.
- Les images uploadées avant le montage du volume sont perdues. Il faut les ré-uploader après avoir configuré le volume.

## Structure du projet

```
app/            routes storefront + admin (App Router)
components/     UI (layout, shop, cart, admin, ui/)
features/       logique métier (products, cart, orders, admin)
lib/            db (Drizzle), settings, store, utils
hooks/          use-cart, etc.
types/          modèles partagés (Product, Order, CartItem…)
public/         images statiques, logo, favicon
uploads/        fichiers uploadés en local (non versionné)
Dockerfile      image de production
```

## Dépannage courant

### Les images du hero ne s'affichent pas après déploiement
- Vérifie que `images.unoptimized: true` est bien dans `next.config.ts`.
- Redéploie après modification de la config.

### Les images produit ne s'affichent pas
- Vérifie que le volume `/app/uploads` est monté.
- Ré-uploie les images si elles ont été envoyées avant le montage du volume.
- Envisage Cloudinary pour un stockage persistant simple.

### L'upload d'image renvoie 502
- Vérifie que le volume `/app/uploads` est accessible en écriture.
- Consulte les logs Dokploy pour voir le message d'erreur exact.

### La base de données ne se connecte pas en production
- Vérifie que `DATABASE_URL` commence bien par `postgres://`.
- Vérifie que le service Postgres est accessible depuis le conteneur applicatif.
