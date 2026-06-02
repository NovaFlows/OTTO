import type { Metadata } from 'next'
import AdminNav from '@/components/AdminNav'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase-server'
import type { Interview } from '@/lib/types'

export const metadata: Metadata = { title: 'Interviews' }

const SOURCE_LABEL: Record<string, string> = {
  youtube:   'YouTube',
  tiktok:    'TikTok',
  instagram: 'Instagram',
  fichier:   'Fichier',
  autre:     'Autre',
}

async function getInterviews(): Promise<Interview[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return []
  try {
    const supabase = await createAdminClient()
    const { data } = await supabase
      .from('interviews')
      .select('*')
      .order('published_at', { ascending: false })
    return data ?? []
  } catch {
    return []
  }
}

export default async function InterviewsPage() {
  const interviews = await getInterviews()

  return (
    <div>
      <AdminNav />
      <main className="max-w-7xl mx-auto px-6 py-10">

        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-2xl font-light text-otto-chalk">Interviews</h1>
          <Link
            href="/admin/interviews/nouvelle"
            className="font-mono text-[10px] uppercase tracking-[0.18em] border border-otto-chalk/20 px-6 py-3 text-otto-chalk hover:bg-otto-chalk/5 transition-all duration-200"
          >
            + Ajouter une interview
          </Link>
        </div>

        <div className="border border-otto-chalk/10">
          {interviews.length === 0 ? (
            <p className="font-mono text-otto-grey text-[11px] text-center py-16 uppercase tracking-[0.15em]">
              Aucune interview pour l&apos;instant.
            </p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-otto-chalk/10">
                  {['Titre', 'Source', 'Date', 'Statut', ''].map((h) => (
                    <th key={h} className="px-6 py-3 text-left font-mono text-[9px] text-otto-grey uppercase tracking-[0.15em]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {interviews.map((item) => (
                  <tr key={item.id} className="border-b border-otto-chalk/5 hover:bg-otto-chalk/3 transition-colors">
                    <td className="px-6 py-4 font-mono text-[12px] text-otto-chalk font-medium">
                      {item.title}
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] text-otto-grey">
                      {SOURCE_LABEL[item.source] ?? item.source}
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] text-otto-grey">
                      {new Date(item.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-mono text-[10px] uppercase tracking-[0.1em] ${item.published ? 'text-green-500' : 'text-otto-grey/50'}`}>
                        {item.published ? 'Publié' : 'Brouillon'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/interviews/${item.id}`}
                        className="font-mono text-[10px] text-otto-grey hover:text-otto-chalk uppercase tracking-[0.1em] transition-colors link-underline"
                      >
                        Éditer
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
