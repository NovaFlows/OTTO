import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import AdminNav from '@/components/AdminNav'
import InterviewForm from '@/components/InterviewForm'
import { updateInterview, deleteInterview } from '@/lib/actions'
import { createAdminClient } from '@/lib/supabase-server'
import Link from 'next/link'
import type { Interview } from '@/lib/types'

interface Props { params: { id: string } }

export const metadata: Metadata = { title: 'Éditer interview' }

async function getInterview(id: string): Promise<Interview | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null
  try {
    const supabase = await createAdminClient()
    const { data } = await supabase.from('interviews').select('*').eq('id', id).single()
    return data ?? null
  } catch {
    return null
  }
}

export default async function EditInterviewPage({ params }: Props) {
  const interview = await getInterview(params.id)
  if (!interview) notFound()

  async function handleUpdate(formData: FormData) {
    'use server'
    return updateInterview(params.id, formData)
  }

  async function handleDelete() {
    'use server'
    return deleteInterview(params.id)
  }

  return (
    <div>
      <AdminNav />

      <main className="max-w-3xl mx-auto px-6 py-10">

        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin/interviews"
            className="font-mono text-[10px] text-otto-grey hover:text-otto-chalk uppercase tracking-[0.15em] transition-colors"
          >
            ← Interviews
          </Link>
          <span className="text-otto-grey/30">/</span>
          <h1 className="font-serif text-2xl font-light text-otto-chalk truncate">{interview.title}</h1>
        </div>

        <div className="bg-otto-black p-8">
          <InterviewForm
            mode="edit"
            interview={interview}
            onSubmit={handleUpdate}
            onDelete={handleDelete}
          />
        </div>

      </main>
    </div>
  )
}
