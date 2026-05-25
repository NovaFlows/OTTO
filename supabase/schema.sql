-- ═══════════════════════════════════════════════
--  Otto Shop — Supabase Schema
--  Exécuter dans Supabase → SQL Editor
-- ═══════════════════════════════════════════════

-- Extensions
create extension if not exists "uuid-ossp";

-- ─── Table : oeuvres ───────────────────────────
create table public.oeuvres (
  id            uuid primary key default uuid_generate_v4(),
  slug          text unique not null,
  title         text not null,
  description   text,
  technique     text not null,
  format        text not null,
  year          int not null,
  categorie     text not null check (categorie in ('danseuses','corbeaux','silhouettes','etudes')),
  price         numeric not null default 0,       -- en centimes (120000 = 1200 €)
  weight_grams  int not null default 500,
  statut        text not null default 'brouillon'
                check (statut in ('disponible','vendu','reserve','nfs','brouillon')),
  images        text[] not null default '{}',
  is_featured   boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- RLS
alter table public.oeuvres enable row level security;

-- Lecture publique (non-brouillons)
create policy "Lecture publique des oeuvres"
  on public.oeuvres for select
  using (statut != 'brouillon');

-- Écriture admin uniquement (service_role ou authenticated)
create policy "Admin peut tout faire"
  on public.oeuvres for all
  using (auth.role() = 'authenticated' or auth.role() = 'service_role');


-- ─── Table : commandes ─────────────────────────
create table public.commandes (
  id                        uuid primary key default uuid_generate_v4(),
  order_number              text unique not null,
  buyer_name                text not null,
  buyer_email               text not null,
  buyer_phone               text,
  shipping_address          jsonb,
  oeuvre_id                 uuid references public.oeuvres(id),
  stripe_session_id         text unique,
  stripe_payment_intent_id  text,
  amount_subtotal           numeric not null default 0,
  amount_shipping           numeric not null default 0,
  amount_total              numeric not null default 0,
  status                    text not null default 'pending'
                            check (status in ('pending','paid','preparing','shipped','delivered','cancelled')),
  tracking_number           text,
  tracking_carrier          text,
  notes                     text,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

-- RLS
alter table public.commandes enable row level security;

-- Admin uniquement
create policy "Admin peut tout faire"
  on public.commandes for all
  using (auth.role() = 'authenticated' or auth.role() = 'service_role');


-- ─── Table : shipping_rates ────────────────────
create table public.shipping_rates (
  id          uuid primary key default uuid_generate_v4(),
  zone        text not null check (zone in ('france','europe','world')),
  min_weight  int not null default 0,
  max_weight  int not null default 5000,
  price       numeric not null default 0,   -- centimes
  carrier     text not null default 'Colissimo'
);

-- RLS
alter table public.shipping_rates enable row level security;

create policy "Lecture publique des tarifs"
  on public.shipping_rates for select
  using (true);

create policy "Admin peut modifier les tarifs"
  on public.shipping_rates for all
  using (auth.role() = 'authenticated' or auth.role() = 'service_role');

-- Données initiales
insert into public.shipping_rates (zone, min_weight, max_weight, price, carrier) values
  ('france',  0,    2000,  1500,  'Colissimo'),
  ('france',  2001, 10000, 2000,  'Colissimo'),
  ('europe',  0,    2000,  2500,  'Colissimo International'),
  ('europe',  2001, 10000, 3500,  'Colissimo International'),
  ('world',   0,    2000,  4500,  'Colissimo International'),
  ('world',   2001, 10000, 6500,  'Colissimo International');


-- ─── Storage : images ──────────────────────────
-- Créer dans Supabase → Storage → New bucket → "images" (public)
-- Politique : authenticated peut uploader
-- Lecture : public


-- ─── Trigger updated_at automatique ───────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_oeuvres_updated_at
  before update on public.oeuvres
  for each row execute function update_updated_at();

create trigger set_commandes_updated_at
  before update on public.commandes
  for each row execute function update_updated_at();
