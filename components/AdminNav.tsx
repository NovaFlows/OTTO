'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutAdmin } from '@/lib/actions'
import { useTransition } from 'react'

const links = [
  { href: '/admin/dashboard',  label: 'Dashboard' },
  { href: '/admin/oeuvres',    label: 'Œuvres' },
  { href: '/admin/commandes',  label: 'Commandes' },
  { href: '/admin/parametres', label: 'Paramètres' },
]

export default function AdminNav() {
  const pathname  = usePathname()
  const [, start] = useTransition()

  function handleLogout() {
    start(async () => { await logoutAdmin() })
  }

  return (
    <header className="sticky top-0 z-50 border-b border-black/10"
      style={{ backgroundColor: 'rgba(236,234,228,0.92)', backdropFilter: 'blur(12px)' }}>
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">

        <Link href="/admin/dashboard" className="flex items-baseline gap-1.5">
          <span className="font-serif text-lg tracking-wide leading-none" style={{ color: '#111' }}>OTTO</span>
          <span className="font-mono text-[9px] tracking-[0.25em] uppercase leading-none" style={{ color: '#6e6d69' }}>admin</span>
        </Link>

        <nav className="flex items-center gap-8">
          {links.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className="font-mono text-[11px] uppercase tracking-[0.15em] transition-colors duration-200"
                style={{ color: active ? '#111' : '#6e6d69' }}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-5">
          <Link
            href="/"
            target="_blank"
            className="font-mono text-[10px] uppercase tracking-[0.15em] transition-colors duration-200"
            style={{ color: '#6e6d69' }}
          >
            Voir le site ↗
          </Link>
          <button
            onClick={handleLogout}
            className="font-mono text-[10px] uppercase tracking-[0.15em] transition-colors duration-200"
            style={{ color: '#6e6d69' }}
          >
            Déconnexion
          </button>
        </div>

      </div>
    </header>
  )
}
