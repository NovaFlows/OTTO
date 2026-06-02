import type { Metadata } from 'next'
import AdminNav from '@/components/AdminNav'
import InterviewForm from '@/components/InterviewForm'
import { createInterview } from '@/lib/actions'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Nouvelle interview' }

export default function NouvelleInterviewPage() {
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
          <h1 className="font-serif text-2xl font-light text-otto-chalk">Nouvelle interview</h1>
        </div>

        <div className="bg-otto-black p-8">
          <InterviewForm
            mode="create"
            onSubmit={createInterview}
          />
        </div>

      </main>
    </div>
  )
}
