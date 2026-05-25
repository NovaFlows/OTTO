'use client'

import { useState, useEffect, useTransition } from 'react'
import { useParams } from 'next/navigation'
import AdminNav from '@/components/AdminNav'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { formatPrice, formatDate } from '@/lib/format'
import { updateOrderTracking, updateOrderStatus, addOrderNote } from '@/lib/actions'

const STATUS_LABEL: Record<string, string> = {
  pending:   'En attente',
  paid:      'Payée',
  preparing: 'En préparation',
  shipped:   'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
}

export default function CommandeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [commande, setCommande]     = useState<any>(null)
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState<string | null>(null)
  const [, start]                   = useTransition()

  // Tracking form state
  const [trackingNumber, setTrackingNumber] = useState('')
  const [carrier, setCarrier]               = useState('Colissimo')
  const [note, setNote]                     = useState('')

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) { setLoading(false); return }
    const supabase = createClient()
    supabase
      .from('commandes')
      .select('*, oeuvre:oeuvres(*)')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setCommande(data)
        setTrackingNumber(data?.tracking_number ?? '')
        setCarrier(data?.tracking_carrier ?? 'Colissimo')
        setNote(data?.notes ?? '')
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div>
        <AdminNav />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="font-mono text-[10px] text-otto-grey uppercase tracking-[0.2em]">Chargement…</p>
        </div>
      </div>
    )
  }

  if (!commande) {
    return (
      <div>
        <AdminNav />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <p className="font-mono text-[10px] text-otto-grey uppercase tracking-[0.2em]">Commande introuvable.</p>
          <Link href="/admin/commandes" className="font-mono text-[9px] text-otto-grey link-underline uppercase tracking-[0.15em]">
            ← Retour
          </Link>
        </div>
      </div>
    )
  }

  const addr = commande.shipping_address

  return (
    <div>
      <AdminNav />

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">

        {/* En-tête */}
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-[9px] text-otto-grey uppercase tracking-[0.2em] mb-1">
              Commande
            </p>
            <h1 className="font-serif font-light text-3xl text-otto-chalk">{commande.order_number}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-otto-grey uppercase tracking-[0.1em]">
              {STATUS_LABEL[commande.status] ?? commande.status}
            </span>
            <select
              value={commande.status}
              onChange={(e) => {
                const s = e.target.value
                start(async () => {
                  const r = await updateOrderStatus(id, s)
                  if (!r?.error) setCommande((p: any) => ({ ...p, status: s }))
                  else setError(r.error)
                })
              }}
              className="bg-otto-charcoal border border-white/10 px-3 py-2 font-mono text-[10px] text-otto-chalk focus:outline-none focus:border-white/30 appearance-none"
            >
              {Object.entries(STATUS_LABEL).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid infos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">

          {/* Acheteur */}
          <div className="bg-otto-black p-6">
            <p className="font-mono text-[9px] text-otto-grey uppercase tracking-[0.2em] mb-4">Acheteur</p>
            <p className="font-mono text-[13px] text-otto-chalk mb-1">{commande.buyer_name}</p>
            <p className="font-mono text-[11px] text-otto-grey mb-1">{commande.buyer_email}</p>
            {commande.buyer_phone && (
              <p className="font-mono text-[11px] text-otto-grey">{commande.buyer_phone}</p>
            )}
          </div>

          {/* Livraison */}
          <div className="bg-otto-black p-6">
            <p className="font-mono text-[9px] text-otto-grey uppercase tracking-[0.2em] mb-4">Adresse de livraison</p>
            {addr ? (
              <address className="not-italic font-mono text-[11px] text-otto-chalk leading-6">
                {addr.line1}<br />
                {addr.line2 && <>{addr.line2}<br /></>}
                {addr.postal_code} {addr.city}<br />
                {addr.country}
              </address>
            ) : (
              <p className="font-mono text-[11px] text-otto-grey">—</p>
            )}
          </div>

          {/* Montants */}
          <div className="bg-otto-black p-6">
            <p className="font-mono text-[9px] text-otto-grey uppercase tracking-[0.2em] mb-4">Montant</p>
            <div className="space-y-2">
              {[
                { label: 'Œuvre',    value: formatPrice(commande.amount_subtotal) },
                { label: 'Livraison', value: formatPrice(commande.amount_shipping) },
                { label: 'Total',    value: formatPrice(commande.amount_total) },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="font-mono text-[10px] text-otto-grey uppercase tracking-[0.1em]">{label}</span>
                  <span className="font-mono text-[12px] text-otto-chalk">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Œuvre */}
        {commande.oeuvre && (
          <div className="border border-white/8 p-6 flex items-center justify-between">
            <div>
              <p className="font-mono text-[9px] text-otto-grey uppercase tracking-[0.2em] mb-2">Œuvre commandée</p>
              <p className="font-mono text-[13px] text-otto-chalk">{commande.oeuvre.title}</p>
              <p className="font-mono text-[10px] text-otto-grey mt-1">
                {commande.oeuvre.technique} — {commande.oeuvre.format}
              </p>
            </div>
            <Link
              href={`/admin/oeuvres/${commande.oeuvre.id}`}
              className="font-mono text-[9px] text-otto-grey hover:text-otto-chalk uppercase tracking-[0.1em] transition-colors"
            >
              Voir l&apos;œuvre →
            </Link>
          </div>
        )}

        {/* Suivi */}
        <div className="border border-white/8 p-6">
          <p className="font-mono text-[9px] text-otto-grey uppercase tracking-[0.2em] mb-5">Numéro de suivi</p>

          {commande.tracking_number ? (
            <div className="mb-4">
              <p className="font-mono text-[13px] text-otto-chalk">
                {commande.tracking_carrier} — {commande.tracking_number}
              </p>
              <p className="font-mono text-[10px] text-otto-grey mt-1">
                Email de suivi envoyé à {commande.buyer_email}
              </p>
            </div>
          ) : null}

          <div className="flex items-end gap-3 flex-wrap">
            <div>
              <label className="block font-mono text-[9px] text-otto-grey uppercase tracking-[0.15em] mb-1">
                Transporteur
              </label>
              <input
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                placeholder="Colissimo"
                className="bg-otto-charcoal border border-white/10 px-4 py-2 font-mono text-[12px] text-otto-chalk w-32 focus:outline-none focus:border-white/30"
              />
            </div>
            <div>
              <label className="block font-mono text-[9px] text-otto-grey uppercase tracking-[0.15em] mb-1">
                Numéro
              </label>
              <input
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="2C123456789FR"
                className="bg-otto-charcoal border border-white/10 px-4 py-2 font-mono text-[12px] text-otto-chalk w-48 focus:outline-none focus:border-white/30"
              />
            </div>
            <button
              onClick={() => {
                if (!trackingNumber) return
                start(async () => {
                  const r = await updateOrderTracking(id, trackingNumber, carrier)
                  if (!r?.error) setCommande((p: any) => ({
                    ...p, tracking_number: trackingNumber, tracking_carrier: carrier, status: 'shipped'
                  }))
                  else setError(r.error)
                })
              }}
              className="font-mono text-[10px] uppercase tracking-[0.15em] border border-white/20 px-6 py-2 text-otto-chalk hover:bg-white/5 transition-all duration-200"
            >
              Enregistrer + Envoyer email
            </button>
          </div>
        </div>

        {/* Note interne */}
        <div className="border border-white/8 p-6">
          <p className="font-mono text-[9px] text-otto-grey uppercase tracking-[0.2em] mb-4">Note interne</p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Notes internes (non envoyées au client)"
            className="w-full bg-otto-charcoal border border-white/10 px-4 py-3 font-mono text-[12px] text-otto-chalk placeholder-otto-grey/30 focus:outline-none focus:border-white/30 resize-none mb-3"
          />
          <button
            onClick={() => start(async () => { await addOrderNote(id, note) })}
            className="font-mono text-[9px] uppercase tracking-[0.15em] border border-white/10 px-5 py-2 text-otto-grey hover:text-otto-chalk hover:border-white/20 transition-all duration-200"
          >
            Sauvegarder la note
          </button>
        </div>

        {error && (
          <p className="font-mono text-[10px] text-red-400 uppercase tracking-[0.1em]">{error}</p>
        )}

        <div className="flex items-center gap-6 pt-4 border-t border-white/5">
          <Link
            href="/admin/commandes"
            className="font-mono text-[9px] text-otto-grey hover:text-otto-chalk uppercase tracking-[0.1em] transition-colors link-underline"
          >
            ← Retour aux commandes
          </Link>
          <p className="font-mono text-[9px] text-otto-grey/40 uppercase tracking-[0.1em]">
            {commande.stripe_session_id}
          </p>
        </div>

      </main>
    </div>
  )
}
