'use client'

import { useState } from 'react'
import type { Interview } from '@/lib/types'

interface Props {
  interview: Interview
  delay?: number
}

export default function InterviewCard({ interview }: Props) {
  const [open, setOpen] = useState(false)
  const isYoutube = interview.video_url.includes('youtube.com/embed')
  const isFile    = interview.source === 'fichier' || /\.(mp4|mov|webm|avi)(\?|$)/i.test(interview.video_url)

  return (
    <>
      {/* Card */}
      <button
        onClick={() => setOpen(true)}
        className="block w-full text-left bg-otto-charcoal border border-white/5 hover:border-white/15 transition-colors duration-300 cursor-pointer"
        style={{ aspectRatio: '9/16' }}
      >
        <div className="h-full flex flex-col items-center justify-center gap-4 p-6 relative overflow-hidden">
          {interview.thumbnail_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={interview.thumbnail_url}
              alt={interview.title}
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
          )}
          <div className="relative flex flex-col items-center gap-4">
            <div className="w-11 h-11 rounded-full border border-white/25 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-otto-grey ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="font-mono text-otto-chalk text-[10px] uppercase tracking-[0.2em]">
                {interview.title}
              </p>
              {interview.description && (
                <p className="font-serif italic text-otto-grey text-[12px] mt-1.5 leading-tight line-clamp-2">
                  {interview.description}
                </p>
              )}
            </div>
            <p className="font-mono text-otto-grey/50 text-[9px] uppercase tracking-[0.15em]">
              {new Date(interview.published_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute -top-10 right-0 font-mono text-[10px] text-otto-grey hover:text-otto-chalk uppercase tracking-[0.2em] transition-colors"
            >
              Fermer ×
            </button>

            {isYoutube ? (
              <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                <iframe
                  src={`${interview.video_url}?autoplay=1`}
                  title={interview.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            ) : isFile ? (
              <video
                src={interview.video_url}
                controls
                autoPlay
                className="w-full max-h-[70vh] bg-black"
                poster={interview.thumbnail_url ?? undefined}
              />
            ) : (
              /* Autres plateformes : preview + lien externe */
              <div className="bg-otto-charcoal p-10 flex flex-col items-center gap-6 text-center">
                {interview.thumbnail_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={interview.thumbnail_url} alt={interview.title} className="w-full max-h-64 object-cover" />
                )}
                <div>
                  <p className="font-mono text-otto-grey text-[10px] uppercase tracking-[0.2em] mb-3">
                    {interview.source} · {new Date(interview.published_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                  </p>
                  <p className="font-serif italic text-otto-chalk text-xl mb-2">{interview.title}</p>
                  {interview.description && (
                    <p className="font-sans text-otto-grey text-sm leading-relaxed mt-3">{interview.description}</p>
                  )}
                </div>
                <a href={interview.video_url} target="_blank" rel="noopener noreferrer"
                  className="font-mono text-[10px] uppercase tracking-[0.18em] border border-white/20 px-8 py-3 text-otto-chalk hover:bg-white/8 transition-all duration-200">
                  Voir sur {interview.source} ↗
                </a>
              </div>
            )}

            <p className="mt-4 font-mono text-otto-grey/40 text-[9px] uppercase tracking-[0.15em] text-center">
              {interview.title}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
