'use client'

import { useState, useTransition } from 'react'
import type { FormEvent } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FadeIn from '@/components/FadeIn'
import { sendContactEmail } from '@/lib/actions'

const sujets = ['Commande', 'Collaboration', 'Presse', 'Autre'] as const

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [sujet, setSujet]         = useState<string>('Commande')
  const [error, setError]         = useState<string | null>(null)
  const [pending, start]          = useTransition()

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)
    fd.set('sujet', sujet)
    start(async () => {
      const result = await sendContactEmail(fd)
      if (result?.error) setError(result.error)
      else setSubmitted(true)
    })
  }

  return (
    <main className="min-h-screen bg-otto-black">
      <Nav />

      <div className="px-6 md:px-12 pt-36 pb-24">
        <div className="max-w-lg">
          <FadeIn>
            <h1
              className="font-serif font-light italic text-otto-chalk mb-2 leading-none"
              style={{ fontSize: 'clamp(44px, 8vw, 80px)' }}
            >
              Contact
            </h1>
            <p className="font-mono text-otto-grey text-[11px] uppercase tracking-[0.25em] mb-16">
              Parler à Otto
            </p>
          </FadeIn>

          {submitted ? (
            <FadeIn>
              <div className="border border-white/10 p-10">
                <p className="font-serif italic text-otto-chalk text-2xl mb-4">
                  Message envoyé.
                </p>
                <p className="font-mono text-otto-grey text-[11px] uppercase tracking-[0.2em]">
                  Otto reviendra vers vous bientôt.
                </p>
              </div>
            </FadeIn>
          ) : (
            <FadeIn delay={100}>
              <form onSubmit={handleSubmit} className="space-y-10">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <label className="font-mono text-otto-grey text-[10px] uppercase tracking-[0.2em] block mb-3">
                      Prénom
                    </label>
                    <input
                      name="prenom"
                      type="text"
                      required
                      placeholder="Votre prénom"
                      className="w-full bg-transparent border-b border-white/15 py-3 text-otto-chalk font-sans text-sm focus:outline-none focus:border-otto-chalk/60 transition-colors duration-200 placeholder:text-otto-grey/30"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-otto-grey text-[10px] uppercase tracking-[0.2em] block mb-3">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="votre@email.com"
                      className="w-full bg-transparent border-b border-white/15 py-3 text-otto-chalk font-sans text-sm focus:outline-none focus:border-otto-chalk/60 transition-colors duration-200 placeholder:text-otto-grey/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-mono text-otto-grey text-[10px] uppercase tracking-[0.2em] block mb-4">
                    Sujet
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {sujets.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSujet(s)}
                        className={`font-mono text-[10px] uppercase tracking-[0.18em] px-4 py-2 border transition-all duration-200 ${
                          sujet === s
                            ? 'text-otto-white border-white/35 bg-white/5'
                            : 'text-otto-grey border-white/10 hover:text-otto-chalk hover:border-white/20'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-mono text-otto-grey text-[10px] uppercase tracking-[0.2em] block mb-3">
                    Message
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    placeholder="Votre message..."
                    className="w-full bg-transparent border-b border-white/15 py-3 text-otto-chalk font-sans text-sm focus:outline-none focus:border-otto-chalk/60 transition-colors duration-200 resize-none placeholder:text-otto-grey/30"
                  />
                </div>

                {error && (
                  <p className="font-mono text-[10px] text-red-400 uppercase tracking-[0.1em]">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={pending}
                  className="font-mono text-[11px] text-otto-chalk uppercase tracking-[0.2em] border border-white/20 px-10 py-4 hover:bg-white/5 hover:border-white/35 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {pending ? 'Envoi…' : 'Envoyer'}
                </button>
              </form>
            </FadeIn>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
