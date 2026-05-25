import { NextRequest } from 'next/server'
import Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const body      = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return new Response('Missing stripe-signature header', { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error('Webhook signature failed:', err.message)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    await handleCheckoutComplete(session)
  }

  return new Response('OK', { status: 200 })
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const { createAdminClient } = await import('@/lib/supabase-server')
  const supabase = await createAdminClient()

  const oeuvreId   = session.metadata?.oeuvre_id
  const oeuvreSlug = session.metadata?.oeuvre_slug

  if (!oeuvreId) {
    console.error('No oeuvre_id in session metadata')
    return
  }

  // Récupère l'œuvre
  const { data: oeuvre } = await supabase
    .from('oeuvres')
    .select('*')
    .eq('id', oeuvreId)
    .single()

  // Adresse de livraison
  const addr = session.shipping_details?.address
  const shipping_address = addr ? {
    line1:       addr.line1 ?? '',
    line2:       addr.line2 ?? undefined,
    city:        addr.city ?? '',
    postal_code: addr.postal_code ?? '',
    country:     addr.country ?? '',
  } : null

  // Numéro de commande séquentiel
  const { count } = await supabase.from('commandes').select('id', { count: 'exact' }).single()
  const orderNumber = `OTTO-${new Date().getFullYear()}-${String((count ?? 0) + 1).padStart(4, '0')}`

  // Crée la commande
  const { data: commande, error } = await supabase.from('commandes').insert({
    order_number:                orderNumber,
    buyer_name:                  session.shipping_details?.name ?? session.customer_details?.name ?? 'Client',
    buyer_email:                 session.customer_details?.email ?? '',
    buyer_phone:                 session.customer_details?.phone ?? null,
    shipping_address:            shipping_address,
    oeuvre_id:                   oeuvreId,
    stripe_session_id:           session.id,
    stripe_payment_intent_id:    typeof session.payment_intent === 'string' ? session.payment_intent : null,
    amount_subtotal:             session.amount_subtotal ?? 0,
    amount_shipping:             session.shipping_cost?.amount_total ?? 0,
    amount_total:                session.amount_total ?? 0,
    status:                      'paid',
  }).select().single()

  if (error) {
    console.error('Failed to create commande:', error)
    return
  }

  // Passe l'œuvre en "reserve"
  await supabase
    .from('oeuvres')
    .update({ statut: 'reserve', updated_at: new Date().toISOString() })
    .eq('id', oeuvreId)

  // Emails
  const resend = new Resend(process.env.RESEND_API_KEY)

  const buyerName  = commande.buyer_name
  const buyerEmail = commande.buyer_email
  const oeuvreTitle = oeuvre?.title ?? 'votre œuvre'
  const totalStr    = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format((commande.amount_total ?? 0) / 100)

  // Email acheteur
  await resend.emails.send({
    from:    process.env.EMAIL_FROM!,
    to:      buyerEmail,
    subject: `Commande confirmée — ${orderNumber}`,
    html:    buildBuyerEmail({ buyerName, orderNumber, oeuvreTitle, totalStr, oeuvreSlug }),
  }).catch((e) => console.error('Buyer email failed:', e))

  // Email Otto
  await resend.emails.send({
    from:    process.env.EMAIL_FROM!,
    to:      process.env.EMAIL_OTTO!,
    subject: `Nouvelle commande ${orderNumber} — ${oeuvreTitle}`,
    html:    buildOttoEmail({ orderNumber, buyerName, buyerEmail, oeuvreTitle, totalStr, shipping_address }),
  }).catch((e) => console.error('Otto email failed:', e))
}

function buildBuyerEmail({ buyerName, orderNumber, oeuvreTitle, totalStr, oeuvreSlug }: any) {
  return `
    <div style="font-family: monospace; max-width: 560px; margin: 0 auto; padding: 40px 20px; background: #060606; color: #F2F0EB;">
      <h1 style="font-size: 28px; font-weight: 300; margin-bottom: 8px; letter-spacing: 0.05em;">Merci.</h1>
      <p style="color: #8A8A8A; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 40px;">${orderNumber}</p>
      <p style="margin-bottom: 8px;">Bonjour ${buyerName},</p>
      <p style="color: #8A8A8A; margin-bottom: 32px;">
        Votre commande pour <strong style="color: #F2F0EB;">${oeuvreTitle}</strong> a bien été reçue.
        Montant total&nbsp;: <strong style="color: #fff;">${totalStr}</strong>
      </p>
      <p style="margin-bottom: 32px; color: #8A8A8A; font-size: 14px; line-height: 1.8;">
        Otto emballera votre œuvre avec soin et vous enverra le numéro de suivi par email
        dès qu'elle sera expédiée. Comptez 5 à 7 jours ouvrés.
      </p>
      <p style="font-size: 13px; color: #8A8A8A; margin-bottom: 4px;">Un certificat d'authenticité est inclus.</p>
      <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 40px 0;" />
      <p style="color: #8A8A8A; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em;">OTTO · Eaubonne · ottodrewit.com</p>
    </div>
  `
}

function buildOttoEmail({ orderNumber, buyerName, buyerEmail, oeuvreTitle, totalStr, shipping_address }: any) {
  const addrStr = shipping_address
    ? `${shipping_address.line1}${shipping_address.line2 ? ', ' + shipping_address.line2 : ''}, ${shipping_address.postal_code} ${shipping_address.city}, ${shipping_address.country}`
    : 'Non fournie'

  return `
    <div style="font-family: monospace; max-width: 560px; margin: 0 auto; padding: 40px 20px; background: #060606; color: #F2F0EB;">
      <h1 style="font-size: 24px; font-weight: 300; margin-bottom: 8px;">Nouvelle commande</h1>
      <p style="color: #8A8A8A; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 32px;">${orderNumber}</p>
      <table style="width: 100%; border-collapse: collapse;">
        ${[
          ['Œuvre',   oeuvreTitle],
          ['Acheteur', buyerName],
          ['Email',   buyerEmail],
          ['Montant', totalStr],
          ['Adresse', addrStr],
        ].map(([label, value]) => `
          <tr>
            <td style="padding: 8px 0; color: #8A8A8A; font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; width: 100px;">${label}</td>
            <td style="padding: 8px 0; font-size: 13px;">${value}</td>
          </tr>
        `).join('')}
      </table>
      <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 32px 0;" />
      <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/commandes" style="color: #F2F0EB; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em;">
        Voir dans l'admin →
      </a>
    </div>
  `
}
