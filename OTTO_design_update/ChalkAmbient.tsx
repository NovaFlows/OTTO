import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter, Space_Mono } from 'next/font/google'
import BackgroundTraces from '@/components/BackgroundTraces'
import ChalkAmbient from '@/components/ChalkAmbient'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Otto — Peintre',
    template: '%s | Otto',
  },
  description: 'Otto — Peintre. Danseuses et corbeaux. Eaubonne.',
  openGraph: {
    title: 'Otto — Peintre',
    description: 'Figures de lumière sur fond noir. Danseuses et corbeaux.',
    type: 'website',
    locale: 'fr_FR',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${cormorant.variable} ${inter.variable} ${spaceMono.variable}`}
    >
      {/* Anti-flash : lit le thème avant le rendu React */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            var t = localStorage.getItem('otto-theme');
            if (t) document.documentElement.setAttribute('data-theme', t);
          } catch(e) {}
        `}} />
      </head>
      <body>
        <div className="grain-overlay" aria-hidden="true" />
        <BackgroundTraces />
        <ChalkAmbient />
        {children}
      </body>
    </html>
  )
}
