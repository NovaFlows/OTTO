import type { Metadata } from 'next'
import AdminNav from '@/components/AdminNav'
import OeuvreForm from '@/components/OeuvreForm'
import { createOeuvre } from '@/lib/actions'

export const metadata: Metadata = { title: 'Nouvelle œuvre' }

export default function NouvelleOeuvrePage() {
  return (
    <div>
      <AdminNav />

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-10">
          <p className="font-mono text-[9px] text-otto-grey uppercase tracking-[0.2em] mb-1">
            Œuvres / Nouvelle
          </p>
          <h1 className="font-serif font-light italic text-otto-chalk text-3xl">
            Ajouter une œuvre
          </h1>
        </div>

        <OeuvreForm mode="create" onSubmit={createOeuvre} />
      </main>
    </div>
  )
}
