import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'

export const metadata: Metadata = {
  title: 'About',
  description: 'Otto — Peintre autodidacte. Eaubonne, banlieue parisienne.',
}

/* ── Q&A à remplacer par la vraie interview ── */
const INTERVIEW = [
  {
    q: "Tu n'as jamais vu de danseuses classiques en vrai. Comment on peint ce qu'on n'a pas vécu ?",
    a: "En l'inventant. Je ne cherche pas la réalité — je cherche le mouvement. Ce que je veux capturer, c'est l'énergie, pas la photographie d'un corps.",
  },
  {
    q: "Pourquoi le fond noir systématiquement ?",
    a: "Parce que la lumière n'existe que grâce au noir. Sur blanc, j'enlève de la lumière. Sur noir, j'en crée. C'est pas pareil.",
  },
  {
    q: "Et les corbeaux — c'est quoi ce lien avec les danseuses ?",
    a: "La danseuse c'est la grâce, le corbeau c'est la noirceur. Les deux m'appartiennent. Je peux pas avoir l'un sans l'autre.",
  },
  {
    q: "Tu te vois où dans cinq ans ?",
    a: "Avec de grandes toiles. Des salles entières. Que les gens rentrent dedans et qu'ils se sentent à l'intérieur de la peinture.",
  },
]

export default function AboutPage() {
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
          <div className="border-t border-white/5 pt-16 mb-28">
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

        {/* ── INTERVIEW ── */}
        <div id="interview" className="border-t border-white/5 pt-16 mb-20">
          <FadeIn>
            <div className="flex items-baseline justify-between mb-16">
              <p className="font-mono text-otto-grey text-[11px] uppercase tracking-[0.3em]">
                Interview
              </p>
              <p className="font-mono text-otto-grey/30 text-[10px] tracking-[0.15em]">
                2025
              </p>
            </div>
          </FadeIn>

          <div className="max-w-2xl space-y-0">
            {INTERVIEW.map(({ q, a }, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div className="border-t border-white/8 py-12">
                  {/* Question */}
                  <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-otto-grey leading-relaxed mb-8">
                    {q}
                  </p>
                  {/* Réponse */}
                  <blockquote
                    className="font-serif italic text-otto-chalk pl-6 border-l border-white/12 leading-snug"
                    style={{ fontSize: 'clamp(20px, 2.5vw, 30px)' }}
                  >
                    « {a} »
                  </blockquote>
                </div>
              </FadeIn>
            ))}
            {/* Dernière bordure */}
            <div className="border-t border-white/8" />
          </div>
        </div>

        {/* ── Réseaux ── */}
        <FadeIn>
          <div className="flex flex-wrap gap-10">
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
