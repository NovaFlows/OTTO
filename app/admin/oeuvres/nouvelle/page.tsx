import type { Metadata } from 'next'
import AdminNav from '@/components/AdminNav'
import OeuvreForm from '@/components/OeuvreForm'
import Link from 'next/link'
import { createOeuvre } from '@/lib/actions'

export const metadata: Metadata = { title: 'Nouvelle œuvre' }

export default function NouvelleOeuvrePage() {
  return (
    <div>
      <AdminNav />

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <Link
            href="/admin/oeuvres"
            className="font-mono text-[9px] text-[#6e6d69] hover:text-[#111] uppercase tracking-[0.15em] transition-colors"
          >
            ← Retour aux œuvres
          </Link>
        </div>
        <div className="mb-10">
          <h1 className="font-serif font-light text-2xl text-[#111]">Nouvelle œuvre</h1>
          <p className="font-mono text-[9px] text-[#6e6d69] uppercase tracking-[0.2em] mt-1">
            Remplissez les informations ci-dessous
          </p>
        </div>

        <OeuvreForm mode="create" onSubmit={createOeuvre} />
      </main>
    </div>
  )
}
