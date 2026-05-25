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
        .limit(5),
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-white/5 mb-10">
          {[
            { label: 'Commandes à expédier', value: String(pending) },
            { label: 'CA du mois',            value: formatPrice(monthRevenue) },
            { label: 'Œuvres disponibles',    value: String(disponibles) },
          ].map(({ label, value }) => (
            <div key={label} className="bg-otto-black px-6 py-8">
              <p className="font-mono text-[9px] text-otto-grey uppercase tracking-[0.2em] mb-3">{label}</p>
              <p className="font-serif text-3xl font-light text-otto-chalk">{value}</p>
            </div>
          ))}
        </div>

        {/* Commandes récentes */}
        <div className="border border-white/8">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
            <p className="font-mono text-[10px] text-otto-grey uppercase tracking-[0.2em]">
              Commandes récentes
            </p>
            <Link
              href="/admin/commandes"
              className="font-mono text-[9px] text-otto-grey hover:text-otto-chalk uppercase tracking-[0.15em] transition-colors link-underline"
            >
              Tout voir
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="font-mono text-otto-grey/40 text-[11px] text-center py-12 uppercase tracking-[0.15em]">
              Aucune commande pour l&apos;instant.
            </p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['Numéro', 'Client', 'Œuvre', 'Montant', 'Statut', 'Date'].map((h) => (
                    <th key={h} className="px-6 py-3 text-left font-mono text-[9px] text-otto-grey uppercase tracking-[0.15em]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o: any) => (
                  <tr key={o.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/commandes/${o.id}`}
                        className="font-mono text-[11px] text-otto-chalk hover:text-otto-white link-underline"
                      >
                        {o.order_number}
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] text-otto-chalk">{o.buyer_name}</td>
                    <td className="px-6 py-4 font-mono text-[11px] text-otto-grey">{o.oeuvre?.title ?? '—'}</td>
                    <td className="px-6 py-4 font-mono text-[11px] text-otto-chalk">{formatPrice(o.amount_total)}</td>
                    <td className="px-6 py-4">
                      <span className={`font-mono text-[10px] uppercase tracking-[0.1em] ${
                        o.status === 'paid' || o.status === 'shipped' ? 'text-otto-chalk' :
                        o.status === 'delivered' ? 'text-otto-grey' :
                        'text-otto-grey'
                      }`}>
                        {STATUS_LABEL[o.status] ?? o.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-[10px] text-otto-grey">{formatDate(o.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Raccourcis */}
        <div className="flex gap-4 mt-8">
          <Link
            href="/admin/oeuvres/nouvelle"
            className="font-mono text-[10px] uppercase tracking-[0.18em] border border-white/20 px-6 py-3 text-otto-chalk hover:bg-white/5 transition-all duration-200"
          >
            + Ajouter une œuvre
          </Link>
          <Link
            href="/admin/commandes"
            className="font-mono text-[10px] uppercase tracking-[0.18em] border border-white/8 px-6 py-3 text-otto-grey hover:text-otto-chalk hover:border-white/20 transition-all duration-200"
          >
            Gérer les commandes
          </Link>
        </div>

      </main>
    </div>
  )
}
