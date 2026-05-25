'use client'

import { useTransition } from 'react'
import { createCheckoutSession } from '@/lib/actions'

interface Props {
  oeuvreId: string
}

export default function BuyButton({ oeuvreId }: Props) {
  const [pending, startTransition] = useTransition()

  function handleClick() {
    startTransition(async () => {
      try {
        await createCheckoutSession(oeuvreId)
      } catch (e: any) {
        alert(e.message ?? 'Une erreur est survenue.')
      }
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="font-mono text-[11px] text-otto-chalk uppercase tracking-[0.18em] border border-white/20 px-8 py-4 hover:bg-white/8 hover:border-white/35 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed w-full text-center"
    >
      {pending ? 'Redirection…' : 'Acheter cette œuvre'}
    </button>
  )
}
