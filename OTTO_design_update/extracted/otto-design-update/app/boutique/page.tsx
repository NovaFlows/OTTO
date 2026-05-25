import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import OeuvreCard from '@/components/OeuvreCard'
import { createAdminClient } from '@/lib/supabase-server'
import { oeuvres as staticOeuvres } from '@/data/oeuvres'
import type { Oeuvre, Categorie } from '@/lib/types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Boutique',
  description: 'Acquérir une œuvre originale d\'Otto. Peintures sur toile noire, danseuses et corbeaux.',
}

const CATEGORIES: { value: Categorie | 'all'; label: string }[] = [
  { value: 'all',          label: 'Tout' },
  { value: 'danseuses',    label: 'Danseuses' },
  { value: 'corbeaux',     label: 'Corbeaux' },
  { value: 'silhouettes',  label: 'Silhouettes' },
  { value: 'etudes',       label: 'Études' },
]

async function getOeuvres(): Promise<Oeuvre[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return staticOeuvres as any
  }
  try {
    const supabase = await createAdminClient()
    const { data } = await supabase
      .from('oeuvres')
      .select('*')
      .neq('statut', 'brouillon')
      .order('created_at', { ascending: false })
    return data ?? (staticOeuvres as any)
  } catch {
    return staticOeuvres as any
  }
}

interface Props {
  searchParams: { categorie?: string }
}

export default async function BoutiquePage({ searchParams }: Props) {
  const all = await getOeuvres()
  const activeCategorie = searchParams.categorie as Categorie | undefined

  const filtered = activeCategorie
    ? all.filter((o) => o.categorie === activeCategorie)
    : all

  const disponibles = filtered.filter((o) => o.statut === 'disponible')
  const autres      = filtered.filter((o) => o.statut !== 'disponible')

  return (
    <main className="min-h-screen bg-otto-black">
      <Nav />

      <div className="px-6 md:px-12 pt-36 pb-24">

        {/* ── En-tête ── */}
        <FadeIn>
          <div className="flex items-end justify-between mb-12">
            <h1
              className="font-serif font-light italic text-otto-chalk leading-none"
              style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}
            >
              Boutique
            </h1>
            <p className="font-mono text-otto-grey text-[10px] uppercase tracking-[0.25em]">
              {disponibles.length} disponible{disponibles.length !== 1 ? 's' : ''}
            </p>
          </div>
        </FadeIn>

        {/* ── Filtres ── */}
        <FadeIn delay={80}>
          <div className="flex flex-wrap gap-x-10 gap-y-4 mb-16 border-t border-white/5 pt-10 items-baseline">
            {CATEGORIES.map(({ value, label }) => {
              const isActive = value === 'all'
                ? !activeCategorie
                : activeCategorie === value

              return (
                <a
                  key={value}
                  href={value === 'all' ? '/boutique' : `/boutique?categorie=${value}`}
                  data-active={isActive ? 'true' : undefined}
                  className={`chalk-under font-mono text-[10px] uppercase tracking-[0.25em] transition-colors duration-200 ${
                    isActive
                      ? 'text-otto-chalk'
                      : 'text-otto-grey hover:text-otto-chalk'
                  }`}
                >
                  {label}
                </a>
              )
            })}
          </div>
        </FadeIn>

        {/* ── Disponibles ── */}
        {disponibles.length > 0 && (
          <section className="mb-20">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {disponibles.map((oeuvre, i) => (
                <FadeIn key={(oeuvre as any).slug ?? oeuvre.id} delay={i * 60}>
                  <OeuvreCard oeuvre={oeuvre as any} />
                </FadeIn>
              ))}
            </div>
          </section>
        )}

        {/* ── Autres ── */}
        {autres.length > 0 && (
          <section>
            {disponibles.length > 0 && (
              <FadeIn>
                <p className="font-mono text-otto-grey text-[10px] uppercase tracking-[0.3em] mb-8 border-t border-white/5 pt-12">
                  Vendues / Non disponibles
                </p>
              </FadeIn>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 opacity-40">
              {autres.map((oeuvre, i) => (
                <FadeIn key={(oeuvre as any).slug ?? oeuvre.id} delay={i * 40}>
                  <OeuvreCard oeuvre={oeuvre as any} />
                </FadeIn>
              ))}
            </div>
          </section>
        )}

        {filtered.length === 0 && (
          <FadeIn>
            <p className="font-mono text-otto-grey text-[11px] uppercase tracking-[0.2em] text-center py-24">
              Aucune œuvre dans cette catégorie.
            </p>
          </FadeIn>
        )}

      </div>

      <Footer />
    </main>
  )
}
