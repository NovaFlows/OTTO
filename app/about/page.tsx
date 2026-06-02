import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import ChalkDivider from '@/components/ChalkDivider'
import { createAdminClient } from '@/lib/supabase-server'
import type { Interview } from '@/lib/types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'About',
  description: 'Otto — Peintre autodidacte. Eaubonne, banlieue parisienne.',
}

async function getInterviews(): Promise<Interview[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return []
  try {
    const supabase = await createAdminClient()
    const { data } = await supabase
      .from('interviews')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false })
    return data ?? []
  } catch {
    return []
  }
}

function isYouTubeEmbed(url: string) {
  return url.includes('youtube.com/embed/')
}

function isDirectFile(item: Interview) {
  return item.source === 'fichier' || /\.(mp4|mov|webm|avi)(\?|$)/i.test(item.video_url)
}

export default async function AboutPage() {
  const interviews = await getInterviews()

  return (
    <main className="min-h-screen bg-otto-black">
      <Nav />

      <div className="px-6 md:px-12 pt-36 pb-24">

        {/* ── Portrait + bio ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-28">
          <FadeIn>
            <div className="w-full aspect-[3/4] bg-otto-charcoal flex items-center justify-center relative overflow-hidden">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(ellipse 60% 70% at 40% 55%, rgba(255,255,255,0.07) 0%, transparent 65%)',
                }}
              />
              <p className="font-mono text-otto-grey/20 text-[10px] uppercase tracking-[0.2em] relative">
                Portrait
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={150}>
            <div className="flex flex-col justify-center h-full">
              <p className="font-mono text-otto-grey text-[11px] uppercase tracking-[0.25em] mb-6">
                Eaubonne, 95
              </p>
              <h1
                className="font-serif font-light italic text-otto-chalk mb-10 leading-none"
                style={{ fontSize: 'clamp(44px, 7vw, 72px)' }}
              >
                Otto
              </h1>

              <div className="space-y-6 font-sans text-otto-chalk/75 text-[15px] leading-[1.8]">
                <p>
                  J&apos;ai commencé à peindre parce que j&apos;en avais besoin. Pas par vocation,
                  pas par école — par nécessité.
                </p>
                <p>
                  Je vis en banlieue parisienne. Les danseuses classiques que je peins,
                  je ne les ai jamais vues en vrai. Je les imagine. Je les construis
                  trait par trait, jusqu&apos;à ce qu&apos;elles existent sur la toile noire.
                </p>
                <p>
                  La lumière que je pose sur le noir, c&apos;est la seule lumière qui
                  m&apos;intéresse — celle qu&apos;on arrache à l&apos;obscurité.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* ── Atelier ── */}
        <FadeIn>
          <ChalkDivider />
          <div className="pt-16 mb-28">
            <p className="font-mono text-otto-grey text-[11px] uppercase tracking-[0.25em] mb-12">
              L&apos;atelier
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-otto-charcoal aspect-square relative overflow-hidden flex items-center justify-center"
                >
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      background: `radial-gradient(ellipse ${40 + i * 10}% ${50 + i * 5}% at ${30 + i * 20}% ${40 + i * 15}%, rgba(255,255,255,0.08) 0%, transparent 65%)`,
                    }}
                  />
                  <p className="font-mono text-otto-grey/15 text-[9px] uppercase tracking-[0.2em] relative">
                    Atelier
                  </p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* ── INTERVIEWS ── */}
        {interviews.length > 0 && (
          <>
            <ChalkDivider />
            <div id="interviews" className="pt-16 mb-20">
              <FadeIn>
                <p className="font-mono text-otto-grey text-[11px] uppercase tracking-[0.3em] mb-16">
                  Interviews
                </p>
              </FadeIn>

              <div className="space-y-20">
                {interviews.map((item, i) => (
                  <FadeIn key={item.id} delay={i * 80}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start border-t border-white/8 pt-12">

                      {/* Vidéo ou miniature */}
                      <div className="w-full aspect-video bg-otto-charcoal relative overflow-hidden">
                        {isYouTubeEmbed(item.video_url) ? (
                          <iframe
                            src={item.video_url}
                            title={item.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full"
                          />
                        ) : isDirectFile(item) ? (
                          <video
                            src={item.video_url}
                            controls
                            className="absolute inset-0 w-full h-full object-cover"
                            poster={item.thumbnail_url ?? undefined}
                          />
                        ) : item.thumbnail_url ? (
                          <a href={item.video_url} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/10 transition-colors">
                              <div className="w-12 h-12 border border-white/40 flex items-center justify-center">
                                <span className="text-white/80 text-lg ml-1">▶</span>
                              </div>
                            </div>
                          </a>
                        ) : (
                          <a href={item.video_url} target="_blank" rel="noopener noreferrer"
                            className="absolute inset-0 flex flex-col items-center justify-center gap-3 hover:bg-white/4 transition-colors">
                            <div className="w-12 h-12 border border-white/20 flex items-center justify-center">
                              <span className="text-white/50 text-lg ml-1">▶</span>
                            </div>
                            <p className="font-mono text-[9px] text-otto-grey uppercase tracking-[0.15em]">Voir sur {item.source}</p>
                          </a>
                        )}
                      </div>

                      {/* Texte */}
                      <div className="flex flex-col justify-center">
                        <p className="font-mono text-otto-grey text-[10px] uppercase tracking-[0.2em] mb-4">
                          {new Date(item.published_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                          {' · '}{item.source}
                        </p>
                        <h2
                          className="font-serif font-light italic text-otto-chalk leading-snug mb-6"
                          style={{ fontSize: 'clamp(22px, 2.5vw, 32px)' }}
                        >
                          {item.title}
                        </h2>
                        {item.description && (
                          <p className="font-sans text-otto-chalk/60 text-[14px] leading-relaxed mb-8">
                            {item.description}
                          </p>
                        )}
                        {!isYouTubeEmbed(item.video_url) && (
                          <a
                            href={item.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-[10px] text-otto-grey hover:text-otto-chalk uppercase tracking-[0.18em] transition-colors link-underline w-fit"
                          >
                            Voir l&apos;interview ↗
                          </a>
                        )}
                      </div>

                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Réseaux ── */}
        <FadeIn>
          <ChalkDivider />
          <div className="flex flex-wrap gap-10 pt-16">
            <a
              href="https://www.instagram.com/ottodrewit/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] text-otto-grey hover:text-otto-chalk uppercase tracking-[0.18em] transition-colors duration-200 link-underline"
            >
              Instagram @ottodrewit
            </a>
            <a
              href="https://www.tiktok.com/@ottodrewit"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] text-otto-grey hover:text-otto-chalk uppercase tracking-[0.18em] transition-colors duration-200 link-underline"
            >
              TikTok @ottodrewit
            </a>
          </div>
        </FadeIn>

      </div>

      <Footer />
    </main>
  )
}
