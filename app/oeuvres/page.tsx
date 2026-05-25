'use client'

import { useState } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import OeuvreCard from '@/components/OeuvreCard'
import FadeIn from '@/components/FadeIn'
import { oeuvres, type Categorie } from '@/data/oeuvres'

type Filtre = 'tout' | Categorie

const filtres: { value: Filtre; label: string }[] = [
  { value: 'tout',        label: 'Tout' },
  { value: 'danseuses',   label: 'Danseuses' },
  { value: 'corbeaux',    label: 'Corbeaux' },
  { value: 'silhouettes', label: 'Silhouettes' },
  { value: 'etudes',      label: 'Études' },
]

export default function GaleriePage() {
  const [filtre, setFiltre] = useState<Filtre>('tout')

  const filtered =
    filtre === 'tout' ? oeuvres : oeuvres.filter((o) => o.categorie === filtre)

  return (
    <main className="min-h-screen bg-otto-black">
      <Nav />

      <div className="px-6 md:px-12 pt-36 pb-24">
        <FadeIn>
          <h1
            className="font-serif font-light italic text-otto-chalk"
            style={{ fontSize: 'clamp(42px, 8vw, 80px)' }}
          >
            Œuvres
          </h1>
          <p className="font-mono text-otto-grey text-[11px] uppercase tracking-[0.18em] mt-2">
            {oeuvres.length} pièces
          </p>
        </FadeIn>

        {/* Filtres */}
        <FadeIn delay={100}>
          <div className="flex flex-wrap gap-6 mt-12 mb-14 border-t border-white/5 pt-8">
            {filtres.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setFiltre(value)}
                className={`font-mono text-[11px] uppercase tracking-[0.18em] transition-all duration-200 pb-1 border-b ${
                  filtre === value
                    ? 'text-otto-white border-otto-white'
                    : 'text-otto-grey border-transparent hover:text-otto-chalk hover:border-white/30'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Masonry grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
          {filtered.map((oeuvre, i) => (
            <div key={oeuvre.slug} className="break-inside-avoid mb-5">
              <FadeIn delay={i * 40}>
                <OeuvreCard oeuvre={oeuvre} />
              </FadeIn>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  )
}
