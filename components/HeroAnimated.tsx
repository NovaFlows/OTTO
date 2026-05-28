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

      {/* OTTO */}
      <div ref={strokesRef} className="relative z-10 text-center select-none px-6">
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
      </div>

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
