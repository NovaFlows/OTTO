export type Categorie = 'danseuses' | 'corbeaux' | 'silhouettes' | 'etudes'
export type StatutOeuvre = 'disponible' | 'vendu' | 'reserve' | 'nfs' | 'brouillon'
export type StatutCommande = 'pending' | 'paid' | 'preparing' | 'shipped' | 'delivered' | 'cancelled'
export type ZoneLivraison = 'france' | 'europe' | 'world'

export interface Oeuvre {
  id: string
  slug: string
  title: string
  description: string | null
  technique: string
  format: string
  year: number
  categorie: Categorie
  price: number
  weight_grams: number
  statut: StatutOeuvre
  images: string[]
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface ShippingAddress {
  line1: string
  line2?: string
  city: string
  postal_code: string
  country: string
}

export interface Commande {
  id: string
  order_number: string
  buyer_name: string
  buyer_email: string
  buyer_phone: string | null
  shipping_address: ShippingAddress
  oeuvre_id: string
  oeuvre?: Oeuvre
  stripe_session_id: string
  stripe_payment_intent_id: string | null
  amount_subtotal: number
  amount_shipping: number
  amount_total: number
  status: StatutCommande
  tracking_number: string | null
  tracking_carrier: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface ShippingRate {
  id: string
  zone: ZoneLivraison
  min_weight: number
  max_weight: number
  price: number
  carrier: string
}
