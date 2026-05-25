# Règle du Jeu — Otto Shop
### Site de vente en ligne + interface d'administration

> Version 2.0 — Refonte complète
> Toute décision design, technique ou fonctionnelle passe par ce document.

---

## 0. Ce que c'est maintenant

Otto ne fait plus juste vitrine. **Otto vend ses œuvres directement depuis son site.**

Le site a deux faces :
- **La boutique** — l'expérience d'achat pour les visiteurs
- **L'admin** — l'outil de gestion quotidien d'Otto (aucune connaissance technique requise)

---

## 1. ADN visuel — inchangé

La direction artistique reste identique à la V1. La boutique ne ressemble pas à Etsy ou Shopify.

| Élément | Valeur |
|---|---|
| Fond principal | `#060606` — noir absolu |
| Fond secondaire | `#111111` — charbon |
| Fond clair (études/sketches) | `#ECEAE4` — papier craie |
| Texte principal | `#F2F0EB` — blanc craie |
| Texte secondaire | `#8A8A8A` — gris perle |
| Accent prix / CTA actif | `#FFFFFF` — blanc pur |
| Serif | Cormorant Garamond (titres, noms d'œuvres) |
| Mono | Space Mono (labels, prix, nav, meta) |
| Sans | Inter (corps de texte, formulaires) |

**Règles absolues :**
- Pas de couleur décorative — monochrome strict
- Le grain CSS reste sur toutes les pages (sauf admin)
- Les prix sont en blanc pur sur fond noir — pas de badge coloré
- Le bouton "Acheter" est sobre : border blanc/15, hover fond blanc/8

---

## 2. Architecture du site

### 2.1 Pages publiques

```
/                        → Accueil (hero + sélection + teaser about)
/boutique                → Toutes les œuvres disponibles (filtrables)
/oeuvre/[slug]           → Page détail + achat
/about                   → Qui est Otto + interview
/contact                 → Formulaire
/commande/[id]           → Confirmation de commande
/merci                   → Page post-paiement Stripe
```

### 2.2 Admin (protégé par mot de passe)

```
/admin                   → Login Otto
/admin/dashboard         → Vue d'ensemble (commandes récentes, stats)
/admin/oeuvres           → Liste de toutes les œuvres
/admin/oeuvres/nouvelle  → Ajouter une œuvre
/admin/oeuvres/[id]      → Modifier une œuvre
/admin/commandes         → Liste des commandes
/admin/commandes/[id]    → Détail commande + saisir numéro de suivi
/admin/parametres        → Tarifs livraison, email, etc.
```

---

## 3. Fonctionnalités côté acheteur

### Page détail œuvre (`/oeuvre/[slug]`)
- Galerie photos (principale + détails)
- Titre, technique, format, année
- **Prix affiché clairement** (ex. `1 200 €`)
- Statut : `Disponible` / `Vendu` / `Non disponible`
- Bouton `Acheter cette œuvre` → mène au checkout Stripe
- Mention : `Envoi soigné sous 5–7 jours · Certificat d'authenticité inclus`
- Œuvres similaires en bas (même catégorie)

### Checkout
- Géré par **Stripe Checkout** (hébergé) — sécurité maximale, zéro code paiement côté serveur
- Collecte : Nom, Email, Adresse complète de livraison
- Les frais de livraison sont ajoutés automatiquement selon le pays
- Après paiement :
  1. Buyer → email de confirmation (Resend)
  2. Otto → email de notification avec détails commande (Resend)
  3. Œuvre passe automatiquement en statut `Réservée` dans la BDD

---

## 4. Fonctionnalités côté admin (Otto)

### Dashboard
- Nombre de commandes en attente d'envoi
- Chiffre d'affaires du mois
- 5 dernières commandes avec statut

### Gestion des œuvres
- **Créer** : upload photos (drag & drop), remplir titre/prix/technique/format/année/catégorie/description, publier ou mettre en brouillon
- **Modifier** : tous les champs modifiables, réordonner les photos
- **Statut** : `Disponible` / `Vendu` / `Non disponible` / `Brouillon`
- **Prix** : champ numérique en €, modifiable à tout moment
- **Supprimer** : confirmation requise

### Gestion des commandes
- Liste avec filtre par statut (Payée / En préparation / Expédiée / Livrée)
- Détail d'une commande : infos acheteur, œuvre, montant, adresse
- **Saisir le numéro de suivi** → déclenche l'email de suivi au client automatiquement
- Marquer comme livrée
- Ajouter une note interne

### Paramètres
- Tarifs de livraison par zone (France, Europe, Monde) et par poids
- Email de notification Otto
- Message personnalisé dans les emails de confirmation

---

## 5. Stack technique

| Couche | Choix | Pourquoi |
|---|---|---|
| Framework | **Next.js 15** (App Router) | SSR, API routes, Server Actions |
| Base de données | **Supabase** (PostgreSQL) | BDD + Auth + Storage tout-en-un, gratuit jusqu'à 500 MB |
| Auth admin | **Supabase Auth** | Email/password pour Otto, session sécurisée |
| Paiement | **Stripe Checkout** | Conforme PCI, supporte SEPA + CB françaises |
| Images | **Supabase Storage** | Stockage des photos d'œuvres |
| Emails | **Resend** | Confirmation commande + notification Otto + suivi |
| Style | **Tailwind CSS** | Variables palette + utilities |
| Deploy | **Vercel** | CI/CD natif Next.js |

---

## 6. Modèle de données

### Table `oeuvres`
```
id              uuid (PK)
slug            text unique
title           text
description     text
technique       text
format          text          ex. "80 × 100 cm"
year            int
categorie       text          danseuses | corbeaux | silhouettes | etudes
price           numeric       en centimes (ex. 120000 = 1200 €)
weight_grams    int           pour calcul livraison
statut          text          disponible | vendu | reserve | nfs | brouillon
images          text[]        URLs Supabase Storage
is_featured     boolean       mis en avant sur l'accueil
created_at      timestamptz
updated_at      timestamptz
```

### Table `commandes`
```
id              uuid (PK)
order_number    text          ex. "OTTO-2025-0042"
buyer_name      text
buyer_email     text
buyer_phone     text
shipping_address jsonb        {line1, line2, city, postal_code, country}
oeuvre_id       uuid FK
stripe_session_id text
stripe_payment_intent_id text
amount_subtotal numeric       en centimes
amount_shipping numeric       en centimes
amount_total    numeric       en centimes
status          text          pending | paid | preparing | shipped | delivered | cancelled
tracking_number text
tracking_carrier text
notes           text
created_at      timestamptz
updated_at      timestamptz
```

### Table `shipping_rates`
```
id          uuid (PK)
zone        text       france | europe | world
min_weight  int        en grammes
max_weight  int        en grammes
price       numeric    en centimes
carrier     text       ex. "Colissimo"
```

---

## 7. Flux de commande complet

```
1. Visiteur → page œuvre → clique "Acheter"
2. Next.js crée une Stripe Checkout Session (Server Action)
3. Stripe Checkout → collecte CB + adresse
4. Stripe → webhook POST /api/webhooks/stripe
5. Webhook :
   a. Enregistre commande en BDD (statut = "paid")
   b. Passe l'œuvre en statut "reserve"
   c. Envoie email confirmation acheteur (Resend)
   d. Envoie email notif Otto (Resend)
6. Acheteur → redirigé vers /merci
7. Otto → /admin/commandes → voit la commande
8. Otto emballe, envoie, saisit numéro de suivi
9. Système → email de suivi à l'acheteur (Resend)
10. Otto → marque "Livré"
```

---

## 8. CE QUE LE SITE NE DOIT PAS FAIRE

- [ ] Ressembler à Shopify, Etsy ou WooCommerce
- [ ] Afficher des badges "PROMO" ou "NOUVEAU" colorés
- [ ] Avoir un panier multi-articles (Otto vend des pièces uniques — 1 œuvre = 1 commande)
- [ ] Afficher des avis/étoiles (pas dans l'ADN)
- [ ] Forcer une inscription avant achat (guest checkout uniquement)
- [ ] Utiliser une couleur autre que noir/blanc/gris

---

## 9. Admin — principes UX

- Interface **sombre** (même palette que le site) mais plus fonctionnelle
- Tableaux lisibles, pas de cartes
- Actions destructives (supprimer, annuler) toujours derrière une confirmation
- Indicateurs de statut par couleur de texte uniquement :
  - `Disponible` → blanc
  - `Vendu / Réservé` → gris
  - `Brouillon` → gris pointillé
  - `Payée` → blanc
  - `Expédiée` → blanc brillant
  - `Livrée` → gris (archivé)
- Upload photo : drag & drop avec preview instantané

---

## 10. Livrables V1

### Must-have (lancement)
- [ ] Page boutique avec toutes les œuvres
- [ ] Page détail œuvre + checkout Stripe
- [ ] Confirmation de commande + emails auto
- [ ] Admin : CRUD œuvres + gestion commandes basique
- [ ] Auth admin sécurisée
- [ ] Œuvre passe automatiquement en "vendu" après paiement

### Nice-to-have (V2)
- [ ] Dashboard stats (revenus, vues)
- [ ] Page "Expositions à venir"
- [ ] Réservation d'une œuvre (sans paiement immédiat)
- [ ] Colissimo API pour calcul automatique des frais
- [ ] Certificat d'authenticité PDF généré automatiquement

---

## 11. Variables d'environnement nécessaires

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Resend
RESEND_API_KEY=
EMAIL_FROM=commandes@ottodrewit.com
EMAIL_OTTO=otto@ottodrewit.com

# App
NEXT_PUBLIC_SITE_URL=https://ottodrewit.com
```

---

*Version 2.0 — Mai 2026*
*Refonte complète : vitrine → boutique + admin*
