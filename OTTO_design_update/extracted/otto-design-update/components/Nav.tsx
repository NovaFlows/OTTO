'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import ThemeToggle from '@/components/ThemeToggle'
import OttoSignature from '@/components/OttoSignature'

const navLinks = [
  { href: '/boutique', label: 'Boutique' },
  { href: '/#process', label: 'Process' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Nav() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || menuOpen
            ? 'bg-otto-black/90 backdrop-blur-md border-b border-white/5'
            : 'bg-transparent'
        }`}
      >
        <nav className="flex items-center justify-between px-6 py-5 md:px-12">
          {/* Logo : OTTO + signature manuscrite « drewit » */}
          <Link href="/" className="flex items-baseline gap-1" onClick={() => setMenuOpen(false)}>
            <span className="font-serif text-xl text-otto-white tracking-wide leading-none">OTTO</span>
            <OttoSignature size={18} opacity={0.85} className="ml-0.5" />
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-10">
            {pathname !== '/' && (
              <li>
                <Link
                  href="/"
                  className="font-mono text-[11px] text-otto-grey hover:text-otto-chalk uppercase tracking-[0.18em] transition-colors duration-200 flex items-center gap-2"
                >
                  <span className="text-[13px] leading-none">←</span>
                  Accueil
                </Link>
              </li>
            )}
            {navLinks.map(({ href, label }) => {
              const active =
                pathname === href || pathname.startsWith(href + '/')
              return (
                <li key={href}>
                  <Link
                    href={href}
                    data-active={active ? 'true' : undefined}
                    className={`chalk-under font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-200 ${
                      active
                        ? 'text-otto-white'
                        : 'text-otto-grey hover:text-otto-chalk'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Toggle jour/nuit */}
          <ThemeToggle />

          {/* Mobile burger */}
          <button
            className="md:hidden flex flex-col gap-[5px] p-2 -mr-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Fermer' : 'Menu'}
          >
            <span
              className={`block w-5 h-px bg-otto-chalk transition-all duration-300 origin-center ${
                menuOpen ? 'rotate-45 translate-y-[6px]' : ''
              }`}
            />
            <span
              className={`block w-5 h-px bg-otto-chalk transition-all duration-300 ${
                menuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block w-5 h-px bg-otto-chalk transition-all duration-300 origin-center ${
                menuOpen ? '-rotate-45 -translate-y-[6px]' : ''
              }`}
            />
          </button>
        </nav>
      </header>

      {/* Mobile fullscreen menu */}
      <div
        className={`fixed inset-0 z-40 bg-otto-black flex flex-col items-center justify-center transition-all duration-500 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <ul className="flex flex-col items-center gap-10">
          {pathname !== '/' && (
            <li>
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="font-mono text-[12px] text-otto-grey hover:text-otto-chalk uppercase tracking-[0.25em] transition-colors duration-200 flex items-center gap-2"
              >
                ← Accueil
              </Link>
            </li>
          )}
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setMenuOpen(false)}
                className="font-serif text-4xl font-light italic text-otto-chalk hover:text-otto-white transition-colors duration-200"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
