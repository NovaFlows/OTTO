import type { Metadata } from 'next'
import AdminNav from '@/components/AdminNav'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase-server'
import { formatPrice, formatDate } from '@/lib/format'

export const metadata: Metadata = { title: 'Dashboard' }

const STATUS_LABEL: Record<string, string> = {
  pending:   'En attente',
  paid:      'Payée',
  preparing: 'En préparation',
  shipped:   'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
}

const STATUS_DOT: Record<string, string> = {
  paid:      'bg-emerald-500',
  preparing: 'bg-amber-500',
  shipped:   'bg-blue-500',
  delivered: 'bg-[#6e6d69]',
  pending:   'bg-[#6e6d69]',
  cancelled: 'bg-red-400',
}

async function getStats() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { pending: 0, monthRevenue: 0, recentOrders: [], disponibles: 0 }
  }
  try {
    const supabase = await createAdminClient()
    const now   = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    const [ordersRes, monthRes, recentRes, dispRes] = await Promise.all([
      supabase.from('commandes').select('id', { count: 'exact' }).in('status', ['paid', 'preparing']),
      supabase.from('commandes').select('amount_total').eq('status', 'paid').gte('created_at', start),
      supabase.from('commandes')
        .select('id, order_number, buyer_name, status, amount_total, created_at, oeuvre:oeuvres(title)')
        .order('created_at', { ascending: false })
        .limit(6),
      supabase.from('oeuvres').select('id', { count: 'exact' }).eq('statut', 'disponible'),
    ])

    const monthRevenue = (monthRes.data ?? []).reduce((sum, o) => sum + (o.amount_total ?? 0), 0)

    return {
      pending:      ordersRes.count ?? 0,
      monthRevenue,
      recentOrders: recentRes.data ?? [],
      disponibles:  dispRes.count ?? 0,
    }
  } catch {
    return { pending: 0, monthRevenue: 0, recentOrders: [], disponibles: 0 }
  }
}

export default async function DashboardPage() {
  const { pending, monthRevenue, recentOrders, disponibles } = await getStats()

  return (
    <div>
      <AdminNav />

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { label: 'À expédier',         value: String(pending),            sub: 'commandes en cours' },
            { label: 'CA du mois',          value: formatPrice(monthRevenue),  sub: 'paiements confirmés' },
            { label: 'Œuvres disponibles',  value: String(disponibles),        sub: 'en boutique' },
          ].map(({ label, value, sub }) => (
            <div key={label} className="bg-white border border-black/8 px-6 py-7">
              <p className="font-mono text-[9px] text-[#6e6d69] uppercase tracking-[0.2em] mb-3">{label}</p>
              <p className="font-serif text-4xl font-light text-[#111] mb-1">{value}</p>
              <p className="font-mono text-[9px] text-[#6e6d69] uppercase tracking-[0.12em]">{sub}</p>
            </div>
          ))}
        </div>

        {/* Raccourcis */}
        <div className="flex gap-3 mb-10">
          <Link
            href="/admin/oeuvres/nouvelle"
            className="font-mono text-[10px] uppercase tracking-[0.18em] border border-black/20 px-5 py-3 text-[#111] hover:bg-black/[0.04] transition-all duration-200"
          >
            + Ajouter une œuvre
          </Link>
          <Link
            href="/admin/commandes"
            className="font-mono text-[10px] uppercase tracking-[0.18em] border border-black/10 px-5 py-3 text-[#6e6d69] hover:text-[#111] hover:border-black/20 transition-all duration-200"
          >
            Gérer les commandes
          </Link>
        </div>

        {/* Commandes récentes */}
        <div className="bg-white border border-black/8">
          <div className="flex items-center justify-between px-6 py-4 border-b border-black/8">
            <p className="font-mono text-[10px] text-[#6e6d69] uppercase tracking-[0.2em]">
              Commandes récentes
            </p>
            <Link
              href="/admin/commandes"
              className="font-mono text-[9px] text-[#6e6d69] hover:text-[#111] uppercase tracking-[0.15em] transition-colors link-underline"
            >
              Tout voir
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="font-mono text-[#6e6d69]/60 text-[11px] text-center py-14 uppercase tracking-[0.15em]">
              Aucune commande pour l&apos;instant.
            </p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-black/5">
                  {['Numéro', 'Client', 'Œuvre', 'Montant', 'Statut', 'Date'].map((h) => (
                    <th key={h} className="px-6 py-3 text-left font-mono text-[9px] text-[#6e6d69] uppercase tracking-[0.15em]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o: any) => (
                  <tr key={o.id} className="border-b border-black/5 hover:bg-black/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/commandes/${o.id}`}
                        className="font-mono text-[11px] text-[#111] hover:text-black link-underline"
                      >
                        {o.order_number}
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] text-[#111]">{o.buyer_name}</td>
                    <td className="px-6 py-4 font-mono text-[11px] text-[#6e6d69]">{o.oeuvre?.title ?? '—'}</td>
                    <td className="px-6 py-4 font-mono text-[11px] text-[#111]">{formatPrice(o.amount_total)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[o.status] ?? 'bg-[#6e6d69]'}`} />
                        <span className="font-mono text-[10px] text-[#6e6d69] uppercase tracking-[0.1em]">
                          {STATUS_LABEL[o.status] ?? o.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-[10px] text-[#6e6d69]">{formatDate(o.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </main>
    </div>
  )
}
