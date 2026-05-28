'use client'

import { useState, useEffect, useTransition } from 'react'
import { useParams } from 'next/navigation'
import AdminNav from '@/components/AdminNav'
import OeuvreForm from '@/components/OeuvreForm'
import Link from 'next/link'
import { updateOeuvre, deleteOeuvre } from '@/lib/actions'
import { createClient } from '@/lib/supabase'
import type { Oeuvre } from '@/lib/types'

export default function EditOeuvrePage() {
  const { id }              = useParams<{ id: string }>()
  const [oeuvre, setOeuvre] = useState<Oeuvre | null>(null)
  const [loading, setLoading] = useState(true)
  const [, start]           = useTransition()

  useEffect(() => {
    async function load() {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) { setLoading(false); return }
      const supabase = createClient()
      const { data } = await supabase.from('oeuvres').select('*').eq('id', id).single()
      setOeuvre(data)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div>
        <AdminNav />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="font-mono text-[10px] text-[#6e6d69] uppercase tracking-[0.2em]">Chargement…</p>
        </div>
      </div>
    )
  }

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
          <h1 className="font-serif font-light text-2xl text-[#111]">
            {oeuvre?.title ?? 'Modifier l\'œuvre'}
          </h1>
          <p className="font-mono text-[9px] text-[#6e6d69] uppercase tracking-[0.2em] mt-1">Édition</p>
        </div>

        <OeuvreForm
          mode="edit"
          oeuvre={oeuvre ?? undefined}
          onSubmit={(fd) => updateOeuvre(id, fd)}
          onDelete={() => {
            start(async () => { await deleteOeuvre(id) })
          }}
        />
      </main>
    </div>
  )
}
