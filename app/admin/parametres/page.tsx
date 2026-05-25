'use client'

import { useState, useEffect, useTransition } from 'react'
import AdminNav from '@/components/AdminNav'
import { createClient } from '@/lib/supabase'
import { formatPrice } from '@/lib/format'

interface ShippingRate {
  id: string
  zone: string
  min_weight: number
  max_weight: number
  price: number
  carrier: string
}

const ZONE_LABEL: Record<string, string> = {
  france:  'France',
  europe:  'Europe',
  world:   'Monde',
}

export default function ParametresPage() {
  const [rates, setRates]   = useState<ShippingRate[]>([])
  const [, start]           = useTransition()
  const [saved, setSaved]   = useState(false)
  const [noSupabase]        = useState(!process.env.NEXT_PUBLIC_SUPABASE_URL)

  useEffect(() => {
    if (noSupabase) return
    const supabase = createClient()
    supabase
      .from('shipping_rates')
      .select('*')
      .order('zone')
      .then(({ data }) => setRates(data ?? []))
  }, [noSupabase])

  async function handleSaveRate(rate: ShippingRate) {
    if (noSupabase) return
    const supabase = createClient()
    await supabase.from('shipping_rates').upsert(rate)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function updateRate(id: string, field: keyof ShippingRate, value: string | number) {
    setRates((prev) => prev.map((r) => r.id === id ? { ...r, [field]: value } : r))
  }

  return (
    <div>
      <AdminNav />

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-10">

        <div>
          <p className="font-mono text-[9px] text-otto-grey uppercase tracking-[0.2em] mb-1">Admin</p>
          <h1 className="font-serif font-light italic text-otto-chalk text-3xl">Paramètres</h1>
        </div>

        {noSupabase ? (
          <div className="border border-white/8 p-6">
            <p className="font-mono text-[11px] text-otto-grey uppercase tracking-[0.15em]">
              Supabase non configuré — les paramètres sont indisponibles en mode démo.
            </p>
          </div>
        ) : (
          <>
            {/* Tarifs livraison */}
            <section className="border border-white/8">
              <div className="border-b border-white/8 px-6 py-4 flex items-center justify-between">
                <p className="font-mono text-[10px] text-otto-grey uppercase tracking-[0.2em]">
                  Tarifs de livraison
                </p>
                {saved && (
                  <p className="font-mono text-[9px] text-otto-chalk uppercase tracking-[0.1em]">Sauvegardé ✓</p>
                )}
              </div>

              {rates.length === 0 ? (
                <p className="font-mono text-otto-grey/40 text-[11px] text-center py-12 uppercase tracking-[0.15em]">
                  Aucun tarif configuré.
                </p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      {['Zone', 'Poids min (g)', 'Poids max (g)', 'Prix (€)', 'Transporteur', ''].map((h) => (
                        <th key={h} className="px-5 py-3 text-left font-mono text-[9px] text-otto-grey uppercase tracking-[0.1em]">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rates.map((rate) => (
                      <tr key={rate.id} className="border-b border-white/5">
                        <td className="px-5 py-3 font-mono text-[11px] text-otto-grey">
                          {ZONE_LABEL[rate.zone] ?? rate.zone}
                        </td>
                        <td className="px-5 py-3">
                          <input
                            type="number"
                            value={rate.min_weight}
                            onChange={(e) => updateRate(rate.id, 'min_weight', Number(e.target.value))}
                            className="bg-otto-charcoal border border-white/10 px-3 py-1 font-mono text-[11px] text-otto-chalk w-24 focus:outline-none focus:border-white/30"
                          />
                        </td>
                        <td className="px-5 py-3">
                          <input
                            type="number"
                            value={rate.max_weight}
                            onChange={(e) => updateRate(rate.id, 'max_weight', Number(e.target.value))}
                            className="bg-otto-charcoal border border-white/10 px-3 py-1 font-mono text-[11px] text-otto-chalk w-24 focus:outline-none focus:border-white/30"
                          />
                        </td>
                        <td className="px-5 py-3">
                          <input
                            type="number"
                            value={rate.price / 100}
                            onChange={(e) => updateRate(rate.id, 'price', Math.round(Number(e.target.value) * 100))}
                            className="bg-otto-charcoal border border-white/10 px-3 py-1 font-mono text-[11px] text-otto-chalk w-24 focus:outline-none focus:border-white/30"
                          />
                        </td>
                        <td className="px-5 py-3">
                          <input
                            value={rate.carrier}
                            onChange={(e) => updateRate(rate.id, 'carrier', e.target.value)}
                            className="bg-otto-charcoal border border-white/10 px-3 py-1 font-mono text-[11px] text-otto-chalk w-28 focus:outline-none focus:border-white/30"
                          />
                        </td>
                        <td className="px-5 py-3">
                          <button
                            onClick={() => start(() => handleSaveRate(rate))}
                            className="font-mono text-[9px] text-otto-grey hover:text-otto-chalk uppercase tracking-[0.1em] transition-colors"
                          >
                            Sauvegarder
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>

            {/* Infos site */}
            <section className="border border-white/8 p-6 space-y-4">
              <p className="font-mono text-[10px] text-otto-grey uppercase tracking-[0.2em] mb-4">
                Emails
              </p>
              <div>
                <label className="block font-mono text-[9px] text-otto-grey uppercase tracking-[0.15em] mb-2">
                  Email de notification (commandes)
                </label>
                <input
                  type="email"
                  defaultValue={process.env.NEXT_PUBLIC_EMAIL_OTTO ?? 'otto@ottodrewit.com'}
                  readOnly
                  className="w-full max-w-sm bg-otto-charcoal border border-white/8 px-4 py-2 font-mono text-[12px] text-otto-grey focus:outline-none cursor-not-allowed"
                />
                <p className="font-mono text-[9px] text-otto-grey/40 mt-2 uppercase tracking-[0.1em]">
                  À configurer dans les variables d&apos;environnement (EMAIL_OTTO)
                </p>
              </div>
            </section>
          </>
        )}

      </main>
    </div>
  )
}
