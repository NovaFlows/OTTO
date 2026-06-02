'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutAdmin } from '@/lib/actions'
import { useTransition } from 'react'
import { useAdminTheme } from '@/components/AdminThemeProvider'

const links = [
  { href: '/admin/dashboard',   label: 'Dashboard' },
  { href: '/admin/oeuvres',     label: 'Œuvres' },
  { href: '/admin/interviews',  label: 'Interviews' },
  { href: '/admin/commandes',   label: 'Commandes' },
  { href: '/admin/parametres',  label: 'Paramètres' },
]

export default function AdminNav() {
  const pathname       = usePathname()
  const [, start]      = useTransition()
  const { theme, toggle } = useAdminTheme()

  function handleLogout() {
    start(async () => { await logoutAdmin() })
  }

  return (
    <header className="sticky top-0 z-50 bg-otto-black/90 border-b border-otto-chalk/10 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">

        <Link href="/admin/dashboard" className="flex items-baseline gap-1.5">
          <span className="font-serif text-lg tracking-wide leading-none text-otto-chalk">OTTO</span>
          <span className="font-mono text-[9px] tracking-[0.25em] uppercase leading-none text-otto-grey">admin</span>
        </Link>

        <nav className="flex items-center gap-8">
          {links.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className={`font-mono text-[11px] uppercase tracking-[0.15em] transition-colors duration-200 ${
                  active ? 'text-otto-chalk' : 'text-otto-grey hover:text-otto-chalk'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-5">

          {/* Toggle thème */}
          <button
            onClick={toggle}
            className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-otto-grey hover:text-otto-chalk transition-colors duration-200"
          >
            {theme === 'dark' ? (
              <>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
                Clair
              </>
            ) : (
              <>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
                </svg>
                Sombre
              </>
            )}
          </button>

          <Link
            href="/"
            target="_blank"
            className="font-mono text-[10px] uppercase tracking-[0.15em] text-otto-grey hover:text-otto-chalk transition-colors duration-200"
          >
            Voir le site ↗
          </Link>

          <button
            onClick={handleLogout}
            className="font-mono text-[10px] uppercase tracking-[0.15em] text-otto-grey hover:text-otto-chalk transition-colors duration-200"
          >
            Déconnexion
          </button>

        </div>
      </div>
    </header>
  )
}
