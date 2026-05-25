import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import OeuvreGallery from '@/components/OeuvreGallery'
import Link from 'next/link'
import { oeuvres, getOeuvreBySlug } from '@/data/oeuvres'

interface Props {
  params: { slug: string }
}

export function generateStaticParams() {
  return oeuvres.map((o) => ({ slug: o.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const oeuvre = getOeuvreBySlug(params.slug)
  if (!oeuvre) return {}
  return {
    title: oeuvre.title,
    description: oeuvre.description ?? `${oeuvre.title}, ${oeuvre.year}. ${oeuvre.technique}.`,
  }
}

const statutLabel: Record<string, string> = {
  disponible: 'Disponible',
  vendu:      'Vendu',
  nfs:        'Non disponible',
}

export default function OeuvreDetailPage({ params }: Props) {
  const oeuvre = getOeuvreBySlug(params.slug)
  if (!oeuvre) notFound()

  const index = oeuvres.findIndex((o) => o.slug === params.slug)
  const prev  = index > 0 ? oeuvres[index - 1] : null
  const next  = index < oeuvres.length - 1 ? oeuvres[index + 1] : null

  return (
    <main className="min-h-screen bg-otto-black">
      <Nav />

      <div className="pt-20">
        {/* ── Galerie + infos ── */}
        <div className="flex flex-col lg:flex-row" style={{ minHeight: '85vh' }}>
          {/* Galerie d'images (client component) */}
          <div className="lg:w-[58%]">
            <OeuvreGallery oeuvre={oeuvre} />
          </div>

          {/* Infos */}
          <div className="lg:w-[42%] px-8 md:px-14 py-14 flex flex-col justify-center border-l border-white/5">
            <FadeIn>
              <p className="font-mono text-otto-grey text-[10px] uppercase tracking-[0.25em] mb-8">
                {oeuvre.categorie}
              </p>

              <h1
                className="font-serif font-light italic text-otto-chalk leading-tight mb-10"
                style={{ fontSize: 'clamp(32px, 4vw, 52px)' }}
              >
                {oeuvre.title}
              </h1>

              {/* Fiche technique */}
              <div className="space-y-4 border-t border-white/5 pt-8">
                {[
                  { label: 'Année',     value: String(oeuvre.year) },
                  { label: 'Technique', value: oeuvre.technique },
                  { label: 'Format',    value: oeuvre.format },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between gap-8">
                    <span className="font-mono text-otto-grey text-[10px] uppercase tracking-[0.18em] shrink-0">
                      {label}
                    </span>
                    <span className="font-mono text-otto-chalk text-[11px] text-right leading-relaxed">
                      {value}
                    </span>
                  </div>
                ))}

                <div className="flex justify-between items-center pt-2">
                  <span className="font-mono text-otto-grey text-[10px] uppercase tracking-[0.18em]">
                    Statut
                  </span>
                  <span
                    className={`font-mono text-[10px] uppercase tracking-[0.18em] ${
                      oeuvre.statut === 'disponible' ? 'text-otto-chalk' : 'text-otto-grey/50'
                    }`}
                  >
                    {statutLabel[oeuvre.statut]}
                  </span>
                </div>
              </div>

              {oeuvre.description && (
                <p className="font-serif italic text-otto-grey text-xl mt-10 leading-relaxed">
                  {oeuvre.description}
                </p>
              )}

              {oeuvre.statut === 'disponible' && (
                <div className="mt-12">
                  <Link
                    href="/contact"
                    className="font-mono text-[11px] text-otto-chalk uppercase tracking-[0.18em] border border-white/20 px-8 py-4 hover:bg-white/5 hover:border-white/35 transition-all duration-200 inline-block"
                  >
                    Intéressé ? Contactez Otto
                  </Link>
                </div>
              )}
            </FadeIn>
          </div>
        </div>

        {/* ── Prev / Next ── */}
        <div className="flex justify-between items-center px-8 md:px-12 py-10 border-t border-white/5">
          {prev ? (
            <Link
              href={`/oeuvres/${prev.slug}`}
              className="font-mono text-[11px] text-otto-grey hover:text-otto-chalk uppercase tracking-[0.15em] transition-colors duration-200 link-underline"
            >
              ← {prev.title}
            </Link>
          ) : (
            <div />
          )}

          <Link
            href="/oeuvres"
            className="font-mono text-[11px] text-otto-grey hover:text-otto-chalk uppercase tracking-[0.15em] transition-colors duration-200 link-underline"
          >
            Galerie
          </Link>

          {next ? (
            <Link
              href={`/oeuvres/${next.slug}`}
              className="font-mono text-[11px] text-otto-grey hover:text-otto-chalk uppercase tracking-[0.15em] transition-colors duration-200 link-underline"
            >
              {next.title} →
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
