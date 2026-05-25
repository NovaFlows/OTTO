'use client'

import { useState, useEffect, useTransition } from 'react'
import { useParams } from 'next/navigation'
import AdminNav from '@/components/AdminNav'
import OeuvreForm from '@/components/OeuvreForm'
import { updateOeuvre, deleteOeuvre } from '@/lib/actions'
import { createClient } from '@/lib/supabase'
import type { Oeuvre } from '@/lib/types'

export default function EditOeuvrePage() {
  const { id }            = useParams<{ id: string }>()
  const [oeuvre, setOeuvre] = useState<Oeuvre | null>(null)
  const [loading, setLoading] = useState(true)
  const [, start] = useTransition()

  useEffect(() => {
    async function load() {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        setLoading(false)
        return
      }
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
          <p className="font-mono text-[10px] text-otto-grey uppercase tracking-[0.2em]">Chargement…</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <AdminNav />

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-10">
          <p className="font-mono text-[9px] text-otto-grey uppercase tracking-[0.2em] mb-1">
            Œuvres / Modifier
          </p>
          <h1 className="font-serif font-light italic text-otto-chalk text-3xl">
            {oeuvre?.title ?? id}
          </h1>
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
