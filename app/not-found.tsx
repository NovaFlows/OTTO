import Link from 'next/link'
import Nav from '@/components/Nav'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-otto-black flex flex-col">
      <Nav />
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">

        <p className="font-serif font-light text-otto-chalk/10 leading-none select-none mb-8"
          style={{ fontSize: 'clamp(120px, 25vw, 280px)' }}>
          404
        </p>

        <p className="font-mono text-otto-grey text-[11px] uppercase tracking-[0.3em] mb-4">
          Page introuvable
        </p>
        <p className="font-serif italic text-otto-chalk/50 text-xl mb-12">
          Cette page n&apos;existe pas — ou plus.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Link
            href="/"
            className="font-mono text-[10px] text-otto-grey hover:text-otto-chalk uppercase tracking-[0.2em] transition-colors duration-200 link-underline"
          >
            ← Accueil
          </Link>
          <span className="text-otto-grey/20 hidden sm:block">·</span>
          <Link
            href="/boutique"
            className="font-mono text-[10px] text-otto-grey hover:text-otto-chalk uppercase tracking-[0.2em] transition-colors duration-200 link-underline"
          >
            Boutique →
          </Link>
        </div>

      </div>
    </main>
  )
}
