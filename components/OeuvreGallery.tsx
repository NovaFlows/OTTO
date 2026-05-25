'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Oeuvre } from '@/data/oeuvres'

const glowClass: Record<string, string> = {
  danseuses:   'glow-dancer',
  corbeaux:    'glow-crow',
  silhouettes: 'glow-silhouette',
  etudes:      'glow-sketch',
}

interface OeuvreGalleryProps {
  oeuvre: Oeuvre
}

export default function OeuvreGallery({ oeuvre }: OeuvreGalleryProps) {
  /* Consolider toutes les images en une liste */
  const allImages: (string | null)[] = oeuvre.images?.length
    ? oeuvre.images
    : oeuvre.imagePath
    ? [oeuvre.imagePath]
    : [null, null, null] // 3 slots placeholder si rien

  const [active, setActive] = useState(0)
  const isSketch = oeuvre.categorie === 'etudes'
  const currentImg = allImages[active]

  return (
    <div className="flex flex-col h-full">
      {/* ── Image principale ── */}
      <div
        className={`flex-1 relative flex items-center justify-center ${
          isSketch ? 'bg-otto-paper' : 'bg-[#080808]'
        }`}
        style={{ minHeight: '60vh' }}
      >
        {currentImg ? (
          <Image
            src={currentImg}
            alt={`${oeuvre.title} — vue ${active + 1}`}
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 58vw"
            priority={active === 0}
          />
        ) : (
          <>
            <div className={`absolute inset-0 ${glowClass[oeuvre.categorie]}`} />
            <p className="font-mono text-otto-grey/20 text-[10px] uppercase tracking-[0.2em] relative z-10">
              {allImages.length > 1 ? `Vue ${active + 1} / ${allImages.length}` : 'Image à venir'}
            </p>
          </>
        )}

        {/* Flèches nav si plusieurs images */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={() => setActive((p) => (p - 1 + allImages.length) % allImages.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center border border-white/15 text-otto-grey hover:text-otto-chalk hover:border-white/30 transition-all duration-200 bg-otto-black/40 backdrop-blur-sm"
              aria-label="Image précédente"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setActive((p) => (p + 1) % allImages.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center border border-white/15 text-otto-grey hover:text-otto-chalk hover:border-white/30 transition-all duration-200 bg-otto-black/40 backdrop-blur-sm"
              aria-label="Image suivante"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Compteur */}
        {allImages.length > 1 && (
          <div className="absolute bottom-4 right-4 font-mono text-[10px] text-otto-grey/50 tracking-[0.15em]">
            {active + 1} / {allImages.length}
          </div>
        )}
      </div>

      {/* ── Bande de miniatures ── */}
      {allImages.length > 1 && (
        <div
          className={`flex gap-2 p-3 overflow-x-auto scrollbar-none ${
            isSketch ? 'bg-otto-paper border-t border-black/10' : 'bg-[#0a0a0a] border-t border-white/5'
          }`}
        >
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative flex-none w-16 aspect-[4/5] overflow-hidden transition-all duration-200 ${
                active === i
                  ? 'ring-1 ring-otto-chalk opacity-100'
                  : 'opacity-35 hover:opacity-60'
              }`}
            >
              {img ? (
                <Image
                  src={img}
                  alt={`Miniature ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className={`absolute inset-0 ${glowClass[oeuvre.categorie]}`} />
              )}

              {/* Label "Détail" pour les images secondaires */}
              {i > 0 && !img && (
                <span className="absolute inset-0 flex items-end justify-start p-1">
                  <span className="font-mono text-[8px] text-otto-grey/40 uppercase tracking-wide">
                    Détail
                  </span>
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
