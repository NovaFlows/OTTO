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

const STATUS_DOT: Record<string, string> = {
  paid:      'bg-emerald-500',
  preparing: 'bg-amber-500',
  shipped:   'bg-blue-500',
  delivered: 'bg-[#6e6d69]',
  pending:   'bg-[#6e6d69]',
  cancelled: 'bg-red-400',
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
          <div>
            <h1 className="font-serif font-light text-2xl text-[#111]">Commandes</h1>
            <p className="font-mono text-[9px] text-[#6e6d69] uppercase tracking-[0.2em] mt-1">
              {commandes.length} commande{commandes.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Filtres */}
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
                    ? 'border-black/25 text-[#111] bg-white'
                    : 'border-black/10 text-[#6e6d69] hover:border-black/20 hover:text-[#111]'
                }`}
              >
                {label}
              </a>
            )
          })}
        </div>

        <div className="bg-white border border-black/8">
          {commandes.length === 0 ? (
            <p className="font-mono text-[#6e6d69]/40 text-[11px] text-center py-16 uppercase tracking-[0.15em]">
              Aucune commande.
            </p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-black/8">
                  {['Numéro', 'Client', 'Œuvre', 'Montant', 'Statut', 'Date', ''].map((h) => (
                    <th key={h} className="px-5 py-3 text-left font-mono text-[9px] text-[#6e6d69] uppercase tracking-[0.15em]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {commandes.map((o: any) => (
                  <tr key={o.id} className="border-b border-black/5 hover:bg-black/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/commandes/${o.id}`}
                        className="font-mono text-[12px] text-[#111] hover:text-black link-underline"
                      >
                        {o.order_number}
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-mono text-[12px] text-[#111]">{o.buyer_name}</p>
                      <p className="font-mono text-[9px] text-[#6e6d69]">{o.buyer_email}</p>
                    </td>
                    <td className="px-5 py-4 font-mono text-[11px] text-[#6e6d69]">{o.oeuvre?.title ?? '—'}</td>
                    <td className="px-5 py-4 font-mono text-[12px] text-[#111]">{formatPrice(o.amount_total)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[o.status] ?? 'bg-[#6e6d69]'}`} />
                        <span className="font-mono text-[10px] text-[#6e6d69] uppercase tracking-[0.1em]">
                          {STATUS_LABEL[o.status] ?? o.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-[10px] text-[#6e6d69]">{formatDate(o.created_at)}</td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/commandes/${o.id}`}
                        className="font-mono text-[9px] text-[#6e6d69] hover:text-[#111] uppercase tracking-[0.1em] transition-colors"
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
