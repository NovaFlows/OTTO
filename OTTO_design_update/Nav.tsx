import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import OeuvreCard from '@/components/OeuvreCard'
import HeroAnimated from '@/components/HeroAnimated'
import ChalkDivider from '@/components/ChalkDivider'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase-server'
import { oeuvres as staticOeuvres } from '@/data/oeuvres'
import type { Oeuvre } from '@/lib/types'

export const dynamic = 'force-dynamic'

async function getFeaturedOeuvres(): Promise<Oeuvre[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return staticOeuvres.slice(0, 5) as any
  }
  try {
    const supabase = await createAdminClient()
    // Priorité aux œuvres mises en avant, sinon les 5 plus récentes
    const { data: featured } = await supabase
      .from('oeuvres')
      .select('*')
      .eq('is_featured', true)
      .neq('statut', 'brouillon')
      .order('created_at', { ascending: false })
      .limit(5)

    if (featured && featured.length > 0) return featured

    const { data: recent } = await supabase
      .from('oeuvres')
      .select('*')
      .neq('statut', 'brouillon')
      .order('created_at', { ascending: false })
      .limit(5)

    return recent ?? (staticOeuvres.slice(0, 5) as any)
  } catch {
    return staticOeuvres.slice(0, 5) as any
  }
}

export default async function HomePage() {
  const featured = await getFeaturedOeuvres()

  return (
    <main className="min-h-screen bg-otto-black">
      <Nav />

      {/* ── HERO ── */}
      <HeroAnimated />

      {/* ── GALERIE PREVIEW ── */}
      <section className="px-6 md:px-12 py-24">
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
      <section className="px-6 md:px-16 lg:px-32 py-28">
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

      {/* ── PROCESS ── */}
      <div className="px-6 md:px-12"><ChalkDivider /></div>
      <section id="process" className="px-6 md:px-12 py-24">
        <FadeIn>
          <h2
            className="font-serif font-light italic text-otto-chalk mb-2"
            style={{ fontSize: 'clamp(32px, 5vw, 52px)' }}
          >
            Process
          </h2>
          <p className="font-mono text-otto-grey text-[11px] uppercase tracking-[0.18em] mb-14">
            Dans l&apos;atelier
          </p>
        </FadeIn>

        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
          {[1, 2, 3].map((i) => (
            <FadeIn key={i} delay={i * 120} className="flex-none w-[260px] snap-center">
              <a
                href="https://www.tiktok.com/@ottodrewit"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-otto-charcoal hover:bg-[#161616] transition-colors duration-300"
                style={{ aspectRatio: '9/16' }}
              >
                <div className="h-full flex flex-col items-center justify-center gap-3 p-6">
                  <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-otto-grey ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <p className="font-mono text-otto-grey text-[10px] uppercase tracking-[0.2em] text-center">
                    @ottodrewit
                  </p>
                </div>
              </a>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={200}>
          <div className="mt-10">
            <a
              href="https://www.tiktok.com/@ottodrewit"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] text-otto-grey hover:text-otto-chalk uppercase tracking-[0.18em] transition-colors duration-200 link-underline"
            >
              Voir sur TikTok →
            </a>
          </div>
        </FadeIn>
      </section>

      <Footer />
    </main>
  )
}
