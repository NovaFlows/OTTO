import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import OeuvreCard from '@/components/OeuvreCard'
import BuyButton from '@/components/BuyButton'
import ChalkDivider from '@/components/ChalkDivider'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase-server'
import { oeuvres as staticOeuvres, getOeuvreBySlug as getStatic } from '@/data/oeuvres'
import { formatPrice } from '@/lib/format'
import type { Oeuvre } from '@/lib/types'

interface Props {
  params: { slug: string }
}

async function getOeuvre(slug: string): Promise<Oeuvre | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return getStatic(slug) as any ?? null
  }
  try {
    const supabase = await createAdminClient()
    const { data } = await supabase
      .from('oeuvres')
      .select('*')
      .eq('slug', slug)
      .single()
    return data ?? (getStatic(slug) as any ?? null)
  } catch {
    return getStatic(slug) as any ?? null
  }
}

async function getSimilar(categorie: string, excludeId: string): Promise<Oeuvre[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return staticOeuvres
      .filter((o) => o.categorie === categorie && o.slug !== excludeId)
      .slice(0, 3) as any
  }
  try {
    const supabase = await createAdminClient()
    const { data } = await supabase
      .from('oeuvres')
      .select('*')
      .eq('categorie', categorie)
      .neq('id', excludeId)
      .neq('statut', 'brouillon')
      .limit(3)
    return data ?? []
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const oeuvre = await getOeuvre(params.slug)
  if (!oeuvre) return {}
  return {
    title: oeuvre.title,
    description: oeuvre.description ?? `${oeuvre.title}, ${oeuvre.year}. ${oeuvre.technique}.`,
  }
}

const statutLabel: Record<string, string> = {
  disponible: 'Disponible',
  vendu:      'Vendu',
  reserve:    'Réservé',
  nfs:        'Non disponible',
  brouillon:  'Brouillon',
}

export default async function OeuvreDetailPage({ params }: Props) {
  const oeuvre = await getOeuvre(params.slug)
  if (!oeuvre) notFound()

  const similar = await getSimilar(oeuvre.categorie, (oeuvre as any).id ?? oeuvre.slug)
  const mainImage  = (oeuvre as any).images?.[0] ?? null
  const extraImages: string[] = (oeuvre as any).images?.slice(1) ?? []

  return (
    <main className="min-h-screen bg-otto-black">
      <Nav />

      <div className="pt-20">
        {/* ── Galerie + infos ── */}
        <div className="flex flex-col lg:flex-row" style={{ minHeight: '85vh' }}>

          {/* Images */}
          <div className="lg:w-[58%] bg-otto-charcoal relative">
            {mainImage ? (
              <div className="relative w-full h-full" style={{ minHeight: '60vh' }}>
                <Image
                  src={mainImage}
                  alt={oeuvre.title}
                  fill
                  className="object-contain p-8"
                  priority
                />
              </div>
            ) : (
              <div
                className={`w-full h-full flex items-center justify-center relative overflow-hidden`}
                style={{ minHeight: '60vh' }}
              >
                <div
                  className={`absolute inset-0 ${
                    oeuvre.categorie === 'danseuses'   ? 'glow-dancer'    :
                    oeuvre.categorie === 'corbeaux'    ? 'glow-crow'      :
                    oeuvre.categorie === 'silhouettes' ? 'glow-silhouette':
                    'glow-sketch'
                  }`}
                />
                <p className="font-mono text-otto-grey/20 text-[10px] uppercase tracking-[0.2em] relative">
                  {oeuvre.title}
                </p>
              </div>
            )}

            {/* Extra images strip */}
            {extraImages.length > 0 && (
              <div className="flex gap-2 p-4 overflow-x-auto">
                {[mainImage, ...extraImages].map((img, i) => img && (
                  <div key={i} className="relative flex-none w-20 h-20 bg-otto-black">
                    <Image src={img} alt={`${oeuvre.title} ${i + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Infos + achat */}
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
                      (oeuvre as any).statut === 'disponible' ? 'text-otto-chalk' : 'text-otto-grey/50'
                    }`}
                  >
                    {statutLabel[(oeuvre as any).statut] ?? (oeuvre as any).statut}
                  </span>
                </div>
              </div>

              {oeuvre.description && (
                <p className="font-serif italic text-otto-grey text-xl mt-10 leading-relaxed">
                  {oeuvre.description}
                </p>
              )}

              {/* Prix + bouton achat */}
              {(oeuvre as any).statut === 'disponible' && (
                <div className="mt-12 space-y-4">
                  {(oeuvre as any).price && (
                    <p className="font-mono text-otto-white text-2xl">
                      {formatPrice((oeuvre as any).price)}
                    </p>
                  )}
                  <BuyButton oeuvreId={(oeuvre as any).id ?? (oeuvre as any).slug} />
                  <p className="font-mono text-otto-grey/50 text-[9px] uppercase tracking-[0.15em] text-center leading-relaxed">
                    Envoi soigné sous 5–7 jours · Certificat d&apos;authenticité inclus
                  </p>
                </div>
              )}

              {(oeuvre as any).statut !== 'disponible' && (
                <div className="mt-12">
                  <p className="font-mono text-otto-grey text-[10px] uppercase tracking-[0.18em]">
                    Cette œuvre n&apos;est plus disponible à la vente.
                  </p>
                  <Link
                    href="/boutique"
                    className="font-mono text-[10px] text-otto-grey hover:text-otto-chalk uppercase tracking-[0.15em] transition-colors duration-200 link-underline inline-block mt-4"
                  >
                    Voir les œuvres disponibles →
                  </Link>
                </div>
              )}
            </FadeIn>
          </div>
        </div>

        {/* ── Œuvres similaires ── */}
        {similar.length > 0 && (
          <>
            <div className="px-6 md:px-12"><ChalkDivider /></div>
            <section className="px-6 md:px-12 py-16">
            <FadeIn>
              <p className="font-mono text-otto-grey text-[10px] uppercase tracking-[0.3em] mb-10">
                Dans la même série
              </p>
            </FadeIn>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {similar.map((s: any, i: number) => (
                <FadeIn key={s.slug ?? s.id} delay={i * 80}>
                  <OeuvreCard oeuvre={s} />
                </FadeIn>
              ))}
            </div>
            </section>
          </>
        )}

        {/* ── Navigation ── */}
        <div className="px-6 md:px-12"><ChalkDivider /></div>
        <div className="flex justify-center px-8 py-10">
          <Link
            href="/boutique"
            className="font-mono text-[11px] text-otto-grey hover:text-otto-chalk uppercase tracking-[0.15em] transition-colors duration-200 link-underline"
          >
            ← Retour à la boutique
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  )
}
