import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import OeuvreCard from '@/components/OeuvreCard'
import HeroAnimated from '@/components/HeroAnimated'
import ChalkDivider from '@/components/ChalkDivider'
import InterviewCard from '@/components/InterviewCard'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase-server'
import { oeuvres as staticOeuvres } from '@/data/oeuvres'
import type { Oeuvre, Interview } from '@/lib/types'

export const dynamic = 'force-dynamic'

async function getFeaturedOeuvres(): Promise<Oeuvre[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return staticOeuvres.slice(0, 5) as any
  }
  try {
    const supabase = await createAdminClient()

    // Récupère toutes les œuvres disponibles, triées : mises en avant d'abord, puis les plus récentes
    const { data } = await supabase
      .from('oeuvres')
      .select('*')
      .eq('statut', 'disponible')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(5)

    return data ?? (staticOeuvres.slice(0, 5) as any)
  } catch {
    return staticOeuvres.slice(0, 5) as any
  }
}

async function getRecentInterviews(): Promise<Interview[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return []
  try {
    const supabase = await createAdminClient()
    const { data } = await supabase
      .from('interviews')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .limit(3)
    return data ?? []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const [featured, interviews] = await Promise.all([
    getFeaturedOeuvres(),
    getRecentInterviews(),
  ])

  return (
    <main className="min-h-screen bg-otto-black">
      <Nav />

      {/* ── HERO ── */}
      <HeroAnimated />

      {/* ── GALERIE PREVIEW ── */}
      <section className="px-6 md:px-12 py-20">
        <FadeIn>
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="font-mono text-otto-grey text-[10px] uppercase tracking-[0.35em] mb-3">Sélection</p>
              <h2
                className="font-serif font-light italic text-otto-chalk"
                style={{ fontSize: 'clamp(32px, 5vw, 52px)' }}
              >
                Œuvres
              </h2>
            </div>
            <Link
              href="/boutique"
              className="font-mono text-[11px] text-otto-grey hover:text-otto-chalk uppercase tracking-[0.18em] transition-colors duration-200 link-underline"
            >
              Tout voir
            </Link>
          </div>
        </FadeIn>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {featured.map((oeuvre: any, i: number) => (
            <FadeIn key={oeuvre.slug ?? oeuvre.id} delay={i * 80}>
              <OeuvreCard oeuvre={oeuvre} />
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── CITATION ── */}
      <div className="px-6 md:px-12"><ChalkDivider /></div>
      <section className="px-6 md:px-16 lg:px-32 py-20">
        <FadeIn>
          <blockquote
            className="font-serif italic text-otto-chalk text-center mx-auto max-w-3xl leading-snug"
            style={{ fontSize: 'clamp(26px, 4vw, 48px)' }}
          >
            Je peins ce que je n&apos;ai pas vécu.
            <br />
            La lumière naît toujours du noir.
          </blockquote>
          <p className="font-mono text-otto-grey text-[11px] uppercase tracking-[0.25em] text-center mt-8">
            — Otto
          </p>
        </FadeIn>
      </section>

      {/* ── INTERVIEWS ── */}
      <div className="px-6 md:px-12"><ChalkDivider /></div>
      <section id="process" className="px-6 md:px-12 py-20">
        <FadeIn>
          <div className="flex items-baseline justify-between mb-14">
            <div>
              <h2
                className="font-serif font-light italic text-otto-chalk mb-2"
                style={{ fontSize: 'clamp(32px, 5vw, 52px)' }}
              >
                Process
              </h2>
              <p className="font-mono text-otto-grey text-[11px] uppercase tracking-[0.18em]">
                Dans l&apos;atelier
              </p>
            </div>
            {interviews.length > 0 && (
              <Link
                href="/about#interviews"
                className="font-mono text-[10px] text-otto-grey hover:text-otto-chalk uppercase tracking-[0.15em] transition-colors link-underline"
              >
                Tout voir →
              </Link>
            )}
          </div>
        </FadeIn>

        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
          {interviews.length > 0 ? interviews.map((item, i) => (
            <FadeIn key={item.id} delay={i * 120} className="flex-none w-[260px] snap-center">
              <InterviewCard interview={item} />
            </FadeIn>
          )) : (
            [{label:'Interview I',sub:"La naissance d'une œuvre"},{label:'Interview II',sub:'Le geste et la matière'},{label:'Interview III',sub:'Ce que peindre veut dire'}].map((item, i) => (
              <FadeIn key={i} delay={i * 120} className="flex-none w-[260px] snap-center">
                <div className="bg-otto-charcoal border border-white/5" style={{ aspectRatio: '9/16' }}>
                  <div className="h-full flex flex-col items-center justify-center gap-4 p-6">
                    <div className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-otto-grey ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="font-mono text-otto-chalk text-[10px] uppercase tracking-[0.2em]">{item.label}</p>
                      <p className="font-serif italic text-otto-grey text-[13px] mt-1.5 leading-tight">{item.sub}</p>
                    </div>
                    <p className="font-mono text-otto-grey/40 text-[9px] uppercase tracking-[0.15em]">À venir</p>
                  </div>
                </div>
              </FadeIn>
            ))
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
