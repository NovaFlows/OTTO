import type { Metadata } from 'next'
import AdminNav from '@/components/AdminNav'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase-server'
import { formatPrice, formatDate } from '@/lib/format'

export const metadata: Metadata = { title: 'Commandes' }

const STATUS_LABEL: Record<string, string> = {
  pending:   'En attente',
  paid:      'Payée',
  preparing: 'En préparation',
  shipped:   'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
}

const STATUS_COLOR: Record<string, string> = {
  paid:      'text-otto-chalk',
  preparing: 'text-otto-chalk',
  shipped:   'text-otto-white',
  delivered: 'text-otto-grey',
  pending:   'text-otto-grey',
  cancelled: 'text-otto-grey/40',
}

interface Props {
  searchParams: { status?: string }
}

async function getCommandes(statusFilter?: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return []
  try {
    const supabase = await createAdminClient()
    let query = supabase
      .from('commandes')
      .select('id, order_number, buyer_name, buyer_email, status, amount_total, created_at, oeuvre:oeuvres(title)')
      .order('created_at', { ascending: false })

    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter)
    }

    const { data } = await query
    return data ?? []
  } catch {
    return []
  }
}

export default async function AdminCommandesPage({ searchParams }: Props) {
  const commandes = await getCommandes(searchParams.status)

  const FILTERS = [
    { value: 'all',       label: 'Toutes' },
    { value: 'paid',      label: 'Payées' },
    { value: 'preparing', label: 'En préparation' },
    { value: 'shipped',   label: 'Expédiées' },
    { value: 'delivered', label: 'Livrées' },
  ]

  return (
    <div>
      <AdminNav />

      <main className="max-w-7xl mx-auto px-6 py-10">

        <div className="flex items-center justify-between mb-8">
          <h1 className="font-mono text-[11px] text-otto-grey uppercase tracking-[0.25em]">
            {commandes.length} commande{commandes.length !== 1 ? 's' : ''}
          </h1>
        </div>

        {/* Filtres statut */}
        <div className="flex flex-wrap gap-2 mb-8">
          {FILTERS.map(({ value, label }) => {
            const active = value === 'all'
              ? !searchParams.status || searchParams.status === 'all'
              : searchParams.status === value

            return (
              <a
                key={value}
                href={value === 'all' ? '/admin/commandes' : `/admin/commandes?status=${value}`}
                className={`font-mono text-[9px] uppercase tracking-[0.15em] px-4 py-2 border transition-colors ${
                  active
                    ? 'border-white/30 text-otto-chalk'
                    : 'border-white/8 text-otto-grey hover:border-white/20 hover:text-otto-chalk'
                }`}
              >
                {label}
              </a>
            )
          })}
        </div>

        <div className="border border-white/8">
          {commandes.length === 0 ? (
            <p className="font-mono text-otto-grey/40 text-[11px] text-center py-16 uppercase tracking-[0.15em]">
              Aucune commande.
            </p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/8">
                  {['Numéro', 'Client', 'Œuvre', 'Montant', 'Statut', 'Date', ''].map((h) => (
                    <th key={h} className="px-5 py-3 text-left font-mono text-[9px] text-otto-grey uppercase tracking-[0.15em]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {commandes.map((o: any) => (
                  <tr key={o.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/commandes/${o.id}`}
                        className="font-mono text-[12px] text-otto-chalk hover:text-otto-white link-underline"
                      >
                        {o.order_number}
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-mono text-[12px] text-otto-chalk">{o.buyer_name}</p>
                      <p className="font-mono text-[9px] text-otto-grey">{o.buyer_email}</p>
                    </td>
                    <td className="px-5 py-4 font-mono text-[11px] text-otto-grey">{o.oeuvre?.title ?? '—'}</td>
                    <td className="px-5 py-4 font-mono text-[12px] text-otto-chalk">{formatPrice(o.amount_total)}</td>
                    <td className="px-5 py-4">
                      <span className={`font-mono text-[10px] uppercase tracking-[0.1em] ${STATUS_COLOR[o.status] ?? 'text-otto-grey'}`}>
                        {STATUS_LABEL[o.status] ?? o.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono text-[10px] text-otto-grey">{formatDate(o.created_at)}</td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/commandes/${o.id}`}
                        className="font-mono text-[9px] text-otto-grey hover:text-otto-chalk uppercase tracking-[0.1em] transition-colors"
                      >
                        Détail →
                      </Link>
                    </td>
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
