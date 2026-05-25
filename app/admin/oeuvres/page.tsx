import type { Metadata } from 'next'
import AdminNav from '@/components/AdminNav'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase-server'
import { oeuvres as staticOeuvres } from '@/data/oeuvres'
import { formatPrice } from '@/lib/format'

export const metadata: Metadata = { title: 'Œuvres' }

const STATUT_LABEL: Record<string, string> = {
  disponible: 'Disponible',
  vendu:      'Vendu',
  reserve:    'Réservé',
  nfs:        'Non disponible',
  brouillon:  'Brouillon',
}

async function getAllOeuvres() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return staticOeuvres as any[]
  try {
    const supabase = await createAdminClient()
    const { data } = await supabase
      .from('oeuvres')
      .select('id, slug, title, categorie, statut, price, year, created_at')
      .order('created_at', { ascending: false })
    return data ?? (staticOeuvres as any[])
  } catch {
    return staticOeuvres as any[]
  }
}

export default async function AdminOeuvresPage() {
  const oeuvres = await getAllOeuvres()

  return (
    <div>
      <AdminNav />

      <main className="max-w-7xl mx-auto px-6 py-10">

        <div className="flex items-center justify-between mb-8">
          <h1 className="font-mono text-[11px] text-otto-grey uppercase tracking-[0.25em]">
            {oeuvres.length} œuvre{oeuvres.length !== 1 ? 's' : ''}
          </h1>
          <Link
            href="/admin/oeuvres/nouvelle"
            className="font-mono text-[10px] uppercase tracking-[0.18em] border border-white/20 px-5 py-3 text-otto-chalk hover:bg-white/5 transition-all duration-200"
          >
            + Ajouter
          </Link>
        </div>

        <div className="border border-white/8">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/8">
                {['Titre', 'Catégorie', 'Format', 'Prix', 'Statut', 'Année', ''].map((h) => (
                  <th key={h} className="px-5 py-3 text-left font-mono text-[9px] text-otto-grey uppercase tracking-[0.15em]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {oeuvres.map((o: any) => (
                <tr key={o.id ?? o.slug} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/oeuvres/${o.id ?? o.slug}`}
                      className="font-mono text-[12px] text-otto-chalk hover:text-otto-white link-underline"
                    >
                      {o.title}
                    </Link>
                  </td>
                  <td className="px-5 py-4 font-mono text-[10px] text-otto-grey uppercase tracking-[0.1em]">
                    {o.categorie}
                  </td>
                  <td className="px-5 py-4 font-mono text-[11px] text-otto-grey">{o.format ?? '—'}</td>
                  <td className="px-5 py-4 font-mono text-[12px] text-otto-chalk">
                    {o.price ? formatPrice(o.price) : '—'}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`font-mono text-[10px] uppercase tracking-[0.1em] ${
                      o.statut === 'disponible' ? 'text-otto-chalk' :
                      o.statut === 'brouillon'  ? 'text-otto-grey/50 italic' :
                      'text-otto-grey/60'
                    }`}>
                      {STATUT_LABEL[o.statut] ?? o.statut}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono text-[11px] text-otto-grey">{o.year}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/admin/oeuvres/${o.id ?? o.slug}`}
                        className="font-mono text-[9px] text-otto-grey hover:text-otto-chalk uppercase tracking-[0.1em] transition-colors"
                      >
                        Modifier
                      </Link>
                      <Link
                        href={`/oeuvre/${o.slug}`}
                        target="_blank"
                        className="font-mono text-[9px] text-otto-grey/50 hover:text-otto-grey uppercase tracking-[0.1em] transition-colors"
                      >
                        Voir ↗
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {oeuvres.length === 0 && (
            <p className="font-mono text-otto-grey/40 text-[11px] text-center py-16 uppercase tracking-[0.15em]">
              Aucune œuvre — commencez par en ajouter une.
            </p>
          )}
        </div>

      </main>
    </div>
  )
}
