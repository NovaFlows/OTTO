'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

export default function HeroAnimated() {
  const nameRef     = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const strokesRef  = useRef<HTMLDivElement>(null)
  const ctaRef      = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const progress = Math.min(window.scrollY / (window.innerHeight * 0.5), 1)
      if (nameRef.current)
        nameRef.current.style.transform = `scale(${1 + progress * 0.11})`
      if (subtitleRef.current)
        subtitleRef.current.style.opacity = String(Math.max(0, 1 - progress * 2.5))
      if (strokesRef.current)
        strokesRef.current.style.opacity = String(Math.max(0, 1 - progress * 2.5))
      if (ctaRef.current)
        ctaRef.current.style.opacity = String(Math.max(0, 1 - progress * 2.5))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Halo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.04) 35%, transparent 70%)',
        }}
      />

      {/* OTTO encadré par traits de craie gestuels */}
      <div ref={strokesRef} className="relative z-10 flex items-center justify-center gap-8 md:gap-12 px-4 select-none">

        {/* ── Craie gauche ── */}
        <svg
          width="190" height="110"
          viewBox="0 0 190 110"
          aria-hidden="true"
          className="hidden sm:block text-otto-chalk flex-none"
          style={{ opacity: 0.5 }}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
        >
          {/* Trait principal ample — courbe lente */}
          <path d="M 4,58 C 18,44 48,52 82,48 C 112,44 148,50 180,52 C 184,52 187,53 188,54"
            strokeWidth="1.3"/>
          {/* Deuxième passage légèrement décalé — effet craie double */}
          <path d="M 6,61 C 22,50 54,55 88,52 C 118,49 152,54 182,57"
            strokeWidth="0.5" opacity="0.6"/>
          {/* Trait inférieur — incurvé différemment */}
          <path d="M 20,70 C 48,65 82,68 112,66 C 140,64 165,68 184,72"
            strokeWidth="0.9"/>
          {/* Trait supérieur court — comme une 2e tentative */}
          <path d="M 35,38 C 65,28 100,34 128,32 C 148,30 165,34 178,38"
            strokeWidth="0.7" strokeDasharray="6 3"/>
          {/* Fragment nerveux — coin gauche, marque de pression */}
          <path d="M 2,50 C 12,42 26,46 32,54 C 36,60 30,68 20,66"
            strokeWidth="1.6"/>
          {/* Petit trait oblique supérieur */}
          <path d="M 60,22 C 72,14 90,18 98,28 C 102,34 98,42 88,42"
            strokeWidth="0.8"/>
          {/* Trait rapide bas gauche */}
          <path d="M 8,82 C 28,76 52,80 68,86"
            strokeWidth="1.1"/>
          {/* Trait très fin diagonal */}
          <path d="M 110,20 C 115,38 112,58 108,74"
            strokeWidth="0.45" strokeDasharray="4 4" opacity="0.7"/>
          {/* Petit arc fermé — comme un cercle ébauché */}
          <path d="M 148,22 C 158,10 175,12 180,24 C 184,34 178,44 166,44 C 156,44 148,36 150,26"
            strokeWidth="0.7"/>
          {/* Poussière de craie */}
          <circle cx="45" cy="55" r="1" fill="currentColor" opacity="0.6"/>
          <circle cx="95" cy="47" r="0.7" fill="currentColor" opacity="0.5"/>
          <circle cx="160" cy="58" r="0.8" fill="currentColor" opacity="0.55"/>
          <circle cx="28" cy="72" r="0.6" fill="currentColor" opacity="0.4"/>
          <circle cx="130" cy="42" r="0.5" fill="currentColor" opacity="0.5"/>
          <circle cx="75" cy="34" r="0.6" fill="currentColor" opacity="0.4"/>
        </svg>

        <h1
          ref={nameRef}
          className="font-serif font-light text-otto-white leading-none flex-none"
          style={{
            fontSize: 'clamp(72px, 15vw, 180px)',
            transformOrigin: 'center center',
            willChange: 'transform',
            letterSpacing: '0.01em',
          }}
        >
          OTTO
        </h1>

        {/* ── Craie droite ── */}
        <svg
          width="190" height="110"
          viewBox="0 0 190 110"
          aria-hidden="true"
          className="hidden sm:block text-otto-chalk flex-none"
          style={{ opacity: 0.5 }}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
        >
          {/* Trait principal — légèrement descendant */}
          <path d="M 2,52 C 18,54 48,50 82,56 C 116,62 152,58 178,52 C 182,51 186,50 188,50"
            strokeWidth="1.3"/>
          {/* Deuxième passage */}
          <path d="M 4,55 C 22,58 56,54 90,60 C 122,66 155,61 182,55"
            strokeWidth="0.5" opacity="0.6"/>
          {/* Trait supérieur — courbe inverse */}
          <path d="M 8,38 C 38,32 72,36 100,34 C 132,32 162,36 182,42"
            strokeWidth="0.9" strokeDasharray="7 3"/>
          {/* Trait inférieur ample */}
          <path d="M 14,72 C 44,68 80,74 118,70 C 150,67 172,72 186,76"
            strokeWidth="0.8"/>
          {/* Fragment nerveux — coin droit */}
          <path d="M 158,44 C 168,36 182,40 186,52 C 188,60 182,70 170,68 C 160,66 156,56 162,48"
            strokeWidth="1.6"/>
          {/* Petit arc supérieur droite */}
          <path d="M 90,16 C 102,6 120,8 126,20 C 130,28 124,38 112,38 C 102,38 94,30 98,20"
            strokeWidth="0.7"/>
          {/* Trait rapide bas droite */}
          <path d="M 120,84 C 142,80 165,84 182,88"
            strokeWidth="1.1"/>
          {/* Trait fin diagonal */}
          <path d="M 68,18 C 72,36 70,56 66,72"
            strokeWidth="0.45" strokeDasharray="4 4" opacity="0.7"/>
          {/* Grand S nerveux */}
          <path d="M 34,28 C 48,16 62,22 60,36 C 58,50 44,54 44,66"
            strokeWidth="0.8"/>
          {/* Poussière de craie */}
          <circle cx="145" cy="54" r="1" fill="currentColor" opacity="0.6"/>
          <circle cx="95" cy="60" r="0.7" fill="currentColor" opacity="0.5"/>
          <circle cx="40" cy="48" r="0.8" fill="currentColor" opacity="0.55"/>
          <circle cx="170" cy="66" r="0.6" fill="currentColor" opacity="0.4"/>
          <circle cx="62" cy="42" r="0.5" fill="currentColor" opacity="0.5"/>
          <circle cx="115" cy="36" r="0.6" fill="currentColor" opacity="0.4"/>
        </svg>

      </div>

      {/* Trait de craie horizontal sous OTTO */}
      <svg width="200" height="16" viewBox="0 0 200 16" aria-hidden="true"
        className="text-otto-chalk mt-8 relative z-10 hidden sm:block"
        style={{ opacity: 0.38 }}
        fill="none" stroke="currentColor" strokeLinecap="round">
        <path d="M 4,8 C 20,5 50,9 80,7 C 110,5 140,8 168,6 C 178,5 188,7 196,8"
          strokeWidth="0.9"/>
        <path d="M 12,11 C 38,9 72,12 104,10 C 132,8 158,11 188,10"
          strokeWidth="0.45" opacity="0.6"/>
        <circle cx="32" cy="8" r="0.6" fill="currentColor" opacity="0.5"/>
        <circle cx="130" cy="7" r="0.5" fill="currentColor" opacity="0.4"/>
        <circle cx="175" cy="9" r="0.6" fill="currentColor" opacity="0.45"/>
      </svg>

      <p
        ref={subtitleRef}
        className="font-mono text-otto-grey text-[11px] uppercase tracking-[0.42em] mt-4 relative z-10"
      >
        Peintre&nbsp;·&nbsp;Eaubonne
      </p>

      {/* CTA */}
      <div ref={ctaRef} className="mt-10 relative z-10">
        <Link
          href="/boutique"
          className="font-mono text-[10px] text-otto-grey hover:text-otto-chalk uppercase tracking-[0.3em] transition-colors duration-300 border border-white/15 px-7 py-3 hover:border-white/30 inline-block"
        >
          Voir les œuvres
        </Link>
      </div>

      {/* Indicateur scroll */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-30">
        <span className="font-mono text-otto-grey text-[9px] uppercase tracking-[0.3em]">Descendre</span>
        <div className="w-px h-14 bg-gradient-to-b from-otto-grey to-transparent" />
      </div>
    </section>
  )
}
