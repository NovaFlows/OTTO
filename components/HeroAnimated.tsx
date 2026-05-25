'use client'

import { useEffect, useRef } from 'react'

export default function HeroAnimated() {
  const nameRef     = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)

  /* Zoom OTTO au scroll — DOM direct, 0 re-render */
  useEffect(() => {
    const onScroll = () => {
      const progress = Math.min(window.scrollY / (window.innerHeight * 0.5), 1)
      if (nameRef.current)
        nameRef.current.style.transform = `scale(${1 + progress * 0.11})`
      if (subtitleRef.current)
        subtitleRef.current.style.opacity = String(Math.max(0, 1 - progress * 2.5))
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
            'radial-gradient(ellipse 55% 70% at 50% 60%, rgba(255,255,255,0.065) 0%, rgba(255,255,255,0.02) 45%, transparent 72%)',
        }}
      />

      {/* OTTO */}
      <div className="relative z-10 text-center select-none px-6">
        <h1
          ref={nameRef}
          className="font-serif font-light text-otto-white leading-none tracking-tight"
          style={{
            fontSize: 'clamp(72px, 15vw, 180px)',
            transformOrigin: 'center center',
            willChange: 'transform',
          }}
        >
          OTTO
        </h1>
        <p
          ref={subtitleRef}
          className="font-mono text-otto-grey text-[11px] uppercase tracking-[0.35em] mt-6"
        >
          Peintre · Eaubonne
        </p>
      </div>

      {/* Indicateur scroll */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-30">
        <span className="font-mono text-otto-grey text-[9px] uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-px h-14 bg-gradient-to-b from-otto-grey to-transparent" />
      </div>
    </section>
  )
}
