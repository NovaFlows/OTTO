'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient, createAdminClient } from '@/lib/supabase-server'
import { getStripe, SHIPPING_OPTIONS } from '@/lib/stripe'
import type { Oeuvre, StatutOeuvre } from '@/lib/types'
import type { CartItem } from '@/lib/cart'

/* ── Checkout panier (multi-articles) ── */

export async function createCartCheckoutSession(items: CartItem[]) {
  if (!items.length) throw new Error('Le panier est vide.')

  const supabase = await createAdminClient()

  // Vérifie que toutes les œuvres sont encore disponibles
  const { data: oeuvres, error } = await supabase
    .from('oeuvres')
    .select('id, title, statut')
    .in('id', items.map((i) => i.id))

  if (error) throw new Error('Erreur lors de la vérification des œuvres.')

  const unavailable = oeuvres?.filter((o) => o.statut !== 'disponible') ?? []
  if (unavailable.length > 0) {
    throw new Error(`Ces œuvres ne sont plus disponibles : ${unavailable.map((o) => o.title).join(', ')}`)
  }

  const session = await getStripe().checkout.sessions.create({
    mode: 'payment',
    line_items: items.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.title,
          description: `${item.technique} — ${item.format}`,
          ...(item.image ? { images: [item.image] } : {}),
        },
        unit_amount: item.price,
      },
      quantity: 1,
    })),
    shipping_address_collection: {
      allowed_countries: ['FR', 'BE', 'CH', 'LU', 'MC', 'DE', 'ES', 'IT', 'PT', 'NL', 'AT', 'GB', 'US', 'CA', 'JP', 'AU'],
    },
    shipping_options: SHIPPING_OPTIONS,
    phone_number_collection: { enabled: true },
    metadata: {
      oeuvre_ids:        items.map((i) => i.id).join(','),
      oeuvre_slugs:      items.map((i) => i.slug).join(','),
      oeuvre_quantities: items.map((i) => i.quantity).join(','),
    },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/merci?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  `${process.env.NEXT_PUBLIC_SITE_URL}/boutique`,
    locale: 'fr',
  })

  redirect(session.url!)
}

/* ── Checkout ── */

export async function createCheckoutSession(oeuvreId: string) {
  const supabase = await createAdminClient()

  const { data: oeuvre, error } = await supabase
    .from('oeuvres')
    .select('*')
    .eq('id', oeuvreId)
    .single()

  if (error || !oeuvre || oeuvre.statut !== 'disponible') {
    throw new Error("Cette œuvre n'est plus disponible.")
  }

  const session = await getStripe().checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: oeuvre.title,
            description: `${oeuvre.technique} — ${oeuvre.format}`,
            images: oeuvre.images?.length ? [oeuvre.images[0]] : [],
          },
          unit_amount: oeuvre.price,
        },
        quantity: 1,
      },
    ],
    shipping_address_collection: {
      allowed_countries: [
        'FR', 'BE', 'CH', 'LU', 'MC',
        'DE', 'ES', 'IT', 'PT', 'NL', 'AT', 'GB',
        'US', 'CA', 'JP', 'AU',
      ],
    },
    shipping_options: SHIPPING_OPTIONS,
    phone_number_collection: { enabled: true },
    metadata: { oeuvre_id: oeuvre.id, oeuvre_slug: oeuvre.slug },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/merci?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/oeuvre/${oeuvre.slug}`,
    locale: 'fr',
  })

  redirect(session.url!)
}

/* ── Auth ── */

export async function loginAdmin(formData: FormData) {
  const email    = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }

  redirect('/admin/dashboard')
}

export async function logoutAdmin() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin')
}

/* ── Oeuvres CRUD ── */

export async function createOeuvre(formData: FormData) {
  const supabase = await createAdminClient()

  const data = {
    slug:         formData.get('slug') as string,
    title:        formData.get('title') as string,
    description:  formData.get('description') as string || null,
    technique:    formData.get('technique') as string,
    format:       formData.get('format') as string,
    year:         Number(formData.get('year')),
    categorie:    formData.get('categorie') as string,
    price:        Math.round(Number(formData.get('price')) * 100),
    weight_grams: Number(formData.get('weight_grams')),
    stock:        Math.max(0, Number(formData.get('stock')) || 1),
    statut:       formData.get('statut') as StatutOeuvre,
    images:       JSON.parse(formData.get('images') as string || '[]'),
    is_featured:  formData.get('is_featured') === 'true',
  }

  const { data: oeuvre, error } = await supabase
    .from('oeuvres')
    .insert(data)
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/admin/oeuvres')
  revalidatePath('/boutique')
  redirect(`/admin/oeuvres/${oeuvre.id}`)
}

export async function updateOeuvre(id: string, formData: FormData) {
  const supabase = await createAdminClient()

  const data: Partial<Oeuvre> = {
    slug:         formData.get('slug') as string,
    title:        formData.get('title') as string,
    description:  formData.get('description') as string || null,
    technique:    formData.get('technique') as string,
    format:       formData.get('format') as string,
    year:         Number(formData.get('year')),
    categorie:    formData.get('categorie') as Oeuvre['categorie'],
    price:        Math.round(Number(formData.get('price')) * 100),
    weight_grams: Number(formData.get('weight_grams')),
    stock:        Math.max(0, Number(formData.get('stock')) || 1),
    statut:       formData.get('statut') as StatutOeuvre,
    images:       JSON.parse(formData.get('images') as string || '[]'),
    is_featured:  formData.get('is_featured') === 'true',
  }

  const { error } = await supabase
    .from('oeuvres')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/oeuvres')
  revalidatePath('/boutique')
  revalidatePath(`/oeuvre/${data.slug}`)
  redirect(`/admin/oeuvres/${id}`)
}

export async function deleteOeuvre(id: string) {
  const supabase = await createAdminClient()

  const { error } = await supabase.from('oeuvres').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/oeuvres')
  revalidatePath('/boutique')
  redirect('/admin/oeuvres')
}

/* ── Commandes ── */

export async function updateOrderTracking(
  orderId: string,
  trackingNumber: string,
  carrier: string
) {
  const supabase = await createAdminClient()

  const { error } = await supabase
    .from('commandes')
    .update({
      tracking_number: trackingNumber,
      tracking_carrier: carrier,
      status: 'shipped',
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId)

  if (error) return { error: error.message }

  // Trigger tracking email via Resend
  try {
    const { data: order } = await supabase
      .from('commandes')
      .select('*, oeuvre:oeuvres(*)')
      .eq('id', orderId)
      .single()

    if (order) {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to: order.buyer_email,
        subject: `Votre commande ${order.order_number} est en route`,
        html: buildTrackingEmail(order),
      })
    }
  } catch (e) {
    console.error('Email tracking failed:', e)
  }

  revalidatePath(`/admin/commandes/${orderId}`)
  revalidatePath('/admin/commandes')
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createAdminClient()

  const { error } = await supabase
    .from('commandes')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId)

  if (error) return { error: error.message }

  revalidatePath(`/admin/commandes/${orderId}`)
  revalidatePath('/admin/commandes')
}

export async function addOrderNote(orderId: string, notes: string) {
  const supabase = await createAdminClient()

  const { error } = await supabase
    .from('commandes')
    .update({ notes, updated_at: new Date().toISOString() })
    .eq('id', orderId)

  if (error) return { error: error.message }
  revalidatePath(`/admin/commandes/${orderId}`)
}

/* ── Interviews CRUD ── */

export async function createInterview(formData: FormData) {
  const supabase = await createAdminClient()

  const videoUrl = normalizeVideoUrl(formData.get('video_url') as string)
  const data = {
    title:         formData.get('title') as string,
    source:        resolveSource(videoUrl, formData.get('source') as string),
    video_url:     videoUrl,
    thumbnail_url: formData.get('thumbnail_url') as string || null,
    description:   formData.get('description') as string || null,
    published_at:  formData.get('published_at') as string,
    published:     formData.get('published') === 'true',
  }

  const { data: interview, error } = await supabase
    .from('interviews')
    .insert(data)
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/admin/interviews')
  revalidatePath('/about')
  redirect(`/admin/interviews/${interview.id}`)
}

export async function updateInterview(id: string, formData: FormData) {
  const supabase = await createAdminClient()

  const videoUrl = normalizeVideoUrl(formData.get('video_url') as string)
  const data = {
    title:         formData.get('title') as string,
    source:        resolveSource(videoUrl, formData.get('source') as string),
    video_url:     videoUrl,
    thumbnail_url: formData.get('thumbnail_url') as string || null,
    description:   formData.get('description') as string || null,
    published_at:  formData.get('published_at') as string,
    published:     formData.get('published') === 'true',
  }

  const { error } = await supabase.from('interviews').update(data).eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/interviews')
  revalidatePath('/about')
  redirect(`/admin/interviews/${id}`)
}

export async function deleteInterview(id: string) {
  const supabase = await createAdminClient()
  const { error } = await supabase.from('interviews').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/interviews')
  revalidatePath('/about')
  redirect('/admin/interviews')
}

function normalizeVideoUrl(url: string): string {
  if (!url) return url
  // Convertit https://www.youtube.com/watch?v=ID ou https://youtu.be/ID → embed URL
  const watchMatch = url.match(/youtube\.com\/watch\?v=([\w-]+)/)
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`
  const shortMatch = url.match(/youtu\.be\/([\w-]+)/)
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`
  return url
}

function resolveSource(url: string, formSource: string): string {
  // Si l'URL est un fichier vidéo direct (Supabase Storage ou extension vidéo), force 'fichier'
  if (url.includes('/storage/') || /\.(mp4|mov|webm|avi|mkv)(\?|$)/i.test(url)) {
    return 'fichier'
  }
  return formSource
}

/* ── Email helpers ── */

function buildTrackingEmail(order: any): string {
  return `
    <div style="font-family: monospace; max-width: 560px; margin: 0 auto; padding: 40px 20px; background: #060606; color: #F2F0EB;">
      <h1 style="font-size: 28px; font-weight: 300; margin-bottom: 24px; letter-spacing: 0.05em;">Votre commande est en route</h1>
      <p style="color: #8A8A8A; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 32px;">
        Commande ${order.order_number}
      </p>
      <p style="margin-bottom: 16px;">Bonjour ${order.buyer_name},</p>
      <p style="margin-bottom: 24px; color: #8A8A8A;">
        Votre œuvre <strong style="color: #F2F0EB;">${order.oeuvre?.title ?? ''}</strong> a été expédiée.
      </p>
      ${order.tracking_number ? `
        <div style="border: 1px solid rgba(255,255,255,0.1); padding: 20px; margin-bottom: 32px;">
          <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #8A8A8A; margin-bottom: 8px;">Numéro de suivi</p>
          <p style="font-size: 16px;">${order.tracking_carrier ?? ''} — ${order.tracking_number}</p>
        </div>
      ` : ''}
      <p style="color: #8A8A8A; font-size: 13px;">Comptez 5 à 7 jours ouvrés pour la livraison.</p>
      <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 40px 0;" />
      <p style="color: #8A8A8A; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em;">OTTO · Eaubonne</p>
    </div>
  `
}
