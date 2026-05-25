import Link from 'next/link'
import Nav from '@/components/Nav'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-otto-black flex flex-col">
      <Nav />
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <p className="font-mono text-otto-grey text-[11px] uppercase tracking-[0.3em] mb-6">404</p>
        <h1 className="font-serif font-light italic text-otto-chalk text-5xl mb-10">
          Page introuvable
        </h1>
        <Link
          href="/"
          className="font-mono text-[11px] text-otto-grey hover:text-otto-chalk uppercase tracking-[0.2em] transition-colors duration-200 link-underline"
        >
          ← Retour
        </Link>
      </div>
    </main>
  )
}
