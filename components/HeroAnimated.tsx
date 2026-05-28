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
            'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.04) 35%, transparent 70%), radial-gradient(ellipse 30% 40% at 50% 50%, rgba(255,255,255,0.04) 0%, transparent 80%)',
        }}
      />

      {/* OTTO encadré par traits de craie */}
      <div ref={strokesRef} className="relative z-10 flex items-center justify-center gap-6 md:gap-9 px-6 select-none">
        {/* trait gauche */}
        <svg width="140" height="36" viewBox="0 0 140 36" aria-hidden="true"
          className="hidden sm:block text-otto-chalk" style={{ opacity: 0.45 }}>
          <path d="M 6 18 Q 35 12, 70 19 T 134 17" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
          <path d="M 14 24 Q 50 28, 90 23" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
          <circle cx="2" cy="18" r="1" fill="currentColor" />
          <circle cx="138" cy="20" r="0.8" fill="currentColor" />
        </svg>

        <h1
          ref={nameRef}
          className="font-serif font-light text-otto-white leading-none"
          style={{
            fontSize: 'clamp(72px, 15vw, 180px)',
            transformOrigin: 'center center',
            willChange: 'transform',
            letterSpacing: '0.01em',
          }}
        >
          OTTO
        </h1>

        {/* trait droit */}
        <svg width="140" height="36" viewBox="0 0 140 36" aria-hidden="true"
          className="hidden sm:block text-otto-chalk" style={{ opacity: 0.45 }}>
          <path d="M 6 20 Q 40 24, 75 17 T 134 19" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
          <path d="M 30 12 Q 70 8, 110 14" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
          <circle cx="2" cy="22" r="0.8" fill="currentColor" />
          <circle cx="138" cy="18" r="1" fill="currentColor" />
        </svg>
      </div>

      {/* petit trait de craie + cartel */}
      <svg width="58" height="8" viewBox="0 0 58 8" aria-hidden="true"
        className="text-otto-chalk mt-9 relative z-10" style={{ opacity: 0.45 }}>
        <path d="M 2 4 C 12 2.5, 24 5, 36 3.5 C 46 2.5, 54 4.5, 56 4" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
      </svg>
      <p
        ref={subtitleRef}
        className="font-mono text-otto-grey text-[11px] uppercase tracking-[0.42em] mt-4 relative z-10"
      >
        Peintre&nbsp;·&nbsp;Eaubonne
      </p>

      {/* CTA */}
      <div ref={ctaRef} className="mt-10 relative z-10 transition-opacity duration-300">
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
