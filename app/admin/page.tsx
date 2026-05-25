'use client'

import { useState, useTransition } from 'react'
import { loginAdmin } from '@/lib/actions'

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [pending, start]  = useTransition()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)
    start(async () => {
      const result = await loginAdmin(fd)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">

        <div className="mb-12 text-center">
          <p className="font-serif text-2xl tracking-wide mb-1" style={{ color: '#111' }}>OTTO</p>
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: '#6e6d69' }}>
            Administration
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-mono text-[9px] uppercase tracking-[0.2em] mb-2" style={{ color: '#6e6d69' }}>
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full bg-white border border-black/10 px-4 py-3 font-mono text-[13px] focus:outline-none focus:border-black/25 transition-colors"
              style={{ color: '#111' }}
            />
          </div>

          <div>
            <label className="block font-mono text-[9px] uppercase tracking-[0.2em] mb-2" style={{ color: '#6e6d69' }}>
              Mot de passe
            </label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full bg-white border border-black/10 px-4 py-3 font-mono text-[13px] focus:outline-none focus:border-black/25 transition-colors"
              style={{ color: '#111' }}
            />
          </div>

          {error && (
            <p className="font-mono text-[10px] text-red-600 uppercase tracking-[0.1em]">{error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full font-mono text-[11px] uppercase tracking-[0.2em] border border-black/20 py-4 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed mt-2 hover:bg-black/[0.04]"
            style={{ color: '#111' }}
          >
            {pending ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

      </div>
    </div>
  )
}
