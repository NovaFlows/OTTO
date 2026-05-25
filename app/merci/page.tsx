import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Merci pour votre commande',
  description: 'Votre commande a été confirmée.',
}

export default function MerciPage() {
  return (
    <main className="min-h-screen bg-otto-black flex flex-col">
      <Nav />

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center py-24">

        {/* Icône */}
        <div className="w-12 h-12 border border-white/15 flex items-center justify-center mb-10">
          <svg
            className="w-5 h-5 text-otto-chalk"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        <p className="font-mono text-otto-grey text-[10px] uppercase tracking-[0.35em] mb-6">
          Commande confirmée
        </p>

        <h1
          className="font-serif font-light italic text-otto-chalk mb-8 leading-tight"
          style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}
        >
          Merci.
        </h1>

        <p className="font-sans text-otto-chalk/70 text-[15px] leading-[1.8] max-w-md mb-4">
          Votre commande a bien été reçue. Un email de confirmation vous a été envoyé.
        </p>
        <p className="font-sans text-otto-chalk/50 text-[14px] leading-[1.8] max-w-md mb-14">
          Otto emballera votre œuvre avec soin et vous contactera dès qu&apos;elle sera en route,
          avec le numéro de suivi.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link
            href="/boutique"
            className="font-mono text-[11px] text-otto-chalk uppercase tracking-[0.18em] border border-white/20 px-8 py-4 hover:bg-white/5 hover:border-white/35 transition-all duration-200"
          >
            Voir la boutique
          </Link>
          <Link
            href="/"
            className="font-mono text-[11px] text-otto-grey hover:text-otto-chalk uppercase tracking-[0.18em] transition-colors duration-200 link-underline"
          >
            Retour à l&apos;accueil
          </Link>
        </div>

      </div>

      <Footer />
    </main>
  )
}
