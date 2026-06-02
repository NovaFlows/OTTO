'use client'

import { useState, useRef, useTransition } from 'react'
import { createClient } from '@/lib/supabase'
import type { Interview } from '@/lib/types'

interface Props {
  interview?: Interview
  onSubmit: (formData: FormData) => Promise<{ error?: string } | void>
  onDelete?: () => void
  mode: 'create' | 'edit'
}

const SOURCES = [
  { value: 'youtube',   label: 'YouTube' },
  { value: 'tiktok',    label: 'TikTok' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'autre',     label: 'Autre' },
]

function isFileUrl(url?: string | null) {
  if (!url) return false
  return url.includes('/storage/') || /\.(mp4|mov|webm|avi|mkv)(\?|$)/i.test(url)
}

export default function InterviewForm({ interview, onSubmit, onDelete, mode }: Props) {
  const initialVideoMode = isFileUrl(interview?.video_url) ? 'file' : 'url'
  const [videoMode, setVideoMode]         = useState<'url' | 'file'>(initialVideoMode)
  const [videoUrl, setVideoUrl]           = useState<string>(interview?.video_url ?? '')
  const [thumbnail, setThumbnail]         = useState<string>(interview?.thumbnail_url ?? '')
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [uploadingThumb, setUploadingThumb] = useState(false)
  const [videoProgress, setVideoProgress] = useState(0)
  const [error, setError]                 = useState<string | null>(null)
  const [pending, start]                  = useTransition()
  const [deleting, startDelete]           = useTransition()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const videoInputRef                     = useRef<HTMLInputElement>(null)
  const thumbInputRef                     = useRef<HTMLInputElement>(null)

  async function uploadVideo(file: File) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) { alert('Supabase non configuré.'); return }
    setUploadingVideo(true)
    setVideoProgress(0)
    const supabase = createClient()
    const ext  = file.name.split('.').pop()
    const path = `videos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error } = await supabase.storage
      .from('interviews')
      .upload(path, file, { upsert: false, cacheControl: '3600' })

    if (error) { setError(error.message); setUploadingVideo(false); return }

    const { data } = supabase.storage.from('interviews').getPublicUrl(path)
    setVideoUrl(data.publicUrl)
    setVideoProgress(100)
    setUploadingVideo(false)
  }

  async function uploadThumbnail(file: File) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) { alert('Supabase non configuré.'); return }
    setUploadingThumb(true)
    const supabase = createClient()
    const ext  = file.name.split('.').pop()
    const path = `thumbnails/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from('interviews').upload(path, file, { upsert: false })
    if (error) { setError(error.message); setUploadingThumb(false); return }
    const { data } = supabase.storage.from('interviews').getPublicUrl(path)
    setThumbnail(data.publicUrl)
    setUploadingThumb(false)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)
    fd.set('video_url', videoUrl)
    fd.set('thumbnail_url', thumbnail)
    if (videoMode === 'file') fd.set('source', 'fichier')
    start(async () => {
      const result = await onSubmit(fd)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* Toggle URL / Fichier */}
      <div>
        <label className="block font-mono text-[9px] text-otto-grey uppercase tracking-[0.2em] mb-3">
          Source de la vidéo
        </label>
        <div className="flex gap-0 border border-white/10 w-fit">
          {(['url', 'file'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { setVideoMode(m); setVideoUrl('') }}
              className={`font-mono text-[10px] uppercase tracking-[0.15em] px-6 py-3 transition-colors ${
                videoMode === m
                  ? 'bg-white/10 text-otto-chalk'
                  : 'text-otto-grey hover:text-otto-chalk'
              }`}
            >
              {m === 'url' ? 'URL externe' : 'Fichier vidéo'}
            </button>
          ))}
        </div>
      </div>

      {/* URL externe */}
      {videoMode === 'url' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-mono text-[9px] text-otto-grey uppercase tracking-[0.2em] mb-2">
                Plateforme
              </label>
              <select
                name="source"
                defaultValue={interview?.source === 'fichier' ? 'youtube' : (interview?.source ?? 'youtube')}
                className="w-full bg-otto-charcoal border border-white/10 px-4 py-3 font-mono text-[12px] text-otto-chalk focus:outline-none focus:border-white/30 transition-colors appearance-none"
              >
                {SOURCES.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block font-mono text-[9px] text-otto-grey uppercase tracking-[0.2em] mb-2">
              URL de la vidéo
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              required={videoMode === 'url'}
              placeholder="https://www.youtube.com/watch?v=... ou lien TikTok"
              className="w-full bg-otto-charcoal border border-white/10 px-4 py-3 font-mono text-[12px] text-otto-chalk placeholder-otto-grey/30 focus:outline-none focus:border-white/30 transition-colors"
            />
            <p className="font-mono text-[9px] text-otto-grey/40 uppercase tracking-[0.1em] mt-2">
              YouTube : colle le lien normal, il sera converti automatiquement
            </p>
          </div>
        </div>
      )}

      {/* Upload fichier vidéo */}
      {videoMode === 'file' && (
        <div>
          <input name="source" type="hidden" value="fichier" />
          {videoUrl ? (
            <div className="space-y-3">
              <video
                src={videoUrl}
                controls
                className="w-full max-h-48 bg-otto-charcoal"
              />
              <div className="flex items-center gap-4">
                <p className="font-mono text-[9px] text-otto-grey/50 uppercase tracking-[0.1em] truncate flex-1">
                  Vidéo uploadée ✓
                </p>
                <button
                  type="button"
                  onClick={() => { setVideoUrl(''); setVideoProgress(0) }}
                  className="font-mono text-[9px] text-otto-grey/50 hover:text-red-400 uppercase tracking-[0.1em] transition-colors shrink-0"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => videoInputRef.current?.click()}
              className="border-2 border-dashed border-white/10 hover:border-white/25 px-8 py-12 text-center cursor-pointer transition-colors"
            >
              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/quicktime,video/webm,video/avi"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && uploadVideo(e.target.files[0])}
              />
              {uploadingVideo ? (
                <div className="space-y-3">
                  <div className="w-full bg-white/5 h-1">
                    <div className="bg-otto-chalk h-1 transition-all duration-300" style={{ width: `${videoProgress}%` }} />
                  </div>
                  <p className="font-mono text-[10px] text-otto-grey uppercase tracking-[0.15em]">
                    Upload en cours…
                  </p>
                </div>
              ) : (
                <>
                  <p className="font-mono text-[11px] text-otto-grey uppercase tracking-[0.15em] mb-2">
                    Glisser la vidéo ici · ou cliquer
                  </p>
                  <p className="font-mono text-[9px] text-otto-grey/40 uppercase tracking-[0.1em]">
                    MP4, MOV, WEBM · Stocké dans Supabase Storage
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Miniature */}
      <div>
        <label className="block font-mono text-[9px] text-otto-grey uppercase tracking-[0.2em] mb-3">
          Miniature (optionnel)
        </label>
        <div className="flex items-start gap-6">
          <div
            onClick={() => thumbInputRef.current?.click()}
            className="border-2 border-dashed border-white/10 hover:border-white/25 w-40 h-24 flex items-center justify-center cursor-pointer transition-colors shrink-0 relative overflow-hidden"
          >
            <input
              ref={thumbInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && uploadThumbnail(e.target.files[0])}
            />
            {thumbnail ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={thumbnail} alt="miniature" className="w-full h-full object-cover" />
            ) : (
              <p className="font-mono text-[9px] text-otto-grey/40 uppercase tracking-[0.1em] text-center px-2">
                {uploadingThumb ? 'Upload…' : 'Cliquer pour uploader'}
              </p>
            )}
          </div>
          {thumbnail && (
            <button type="button" onClick={() => setThumbnail('')}
              className="font-mono text-[9px] text-otto-grey/50 hover:text-red-400 uppercase tracking-[0.1em] transition-colors mt-1">
              Supprimer
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Field label="Titre" name="title" defaultValue={interview?.title} required
          placeholder="ex: Interview Konbini — Juillet 2025" className="md:col-span-2" />

        <Field
          label="Date de publication"
          name="published_at"
          type="date"
          defaultValue={interview?.published_at ?? new Date().toISOString().slice(0, 10)}
          required
        />

        <div className="md:col-span-2">
          <label className="block font-mono text-[9px] text-otto-grey uppercase tracking-[0.2em] mb-2">
            Description (optionnel)
          </label>
          <textarea
            name="description"
            defaultValue={interview?.description ?? ''}
            rows={3}
            placeholder="Courte intro visible sur le site..."
            className="w-full bg-otto-charcoal border border-white/10 px-4 py-3 font-mono text-[12px] text-otto-chalk placeholder-otto-grey/30 focus:outline-none focus:border-white/30 transition-colors resize-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="published"
            id="published"
            value="true"
            defaultChecked={interview?.published ?? false}
            className="w-4 h-4 bg-otto-charcoal border border-white/20 checked:bg-otto-chalk focus:outline-none"
          />
          <label htmlFor="published" className="font-mono text-[10px] text-otto-grey uppercase tracking-[0.15em]">
            Publier sur le site
          </label>
        </div>

      </div>

      {error && (
        <p className="font-mono text-[10px] text-red-400 uppercase tracking-[0.1em]">{error}</p>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-white/8">
        <button
          type="submit"
          disabled={pending || uploadingVideo || uploadingThumb || (videoMode === 'file' && !videoUrl)}
          className="font-mono text-[10px] uppercase tracking-[0.18em] border border-white/20 px-7 py-3 text-otto-chalk hover:bg-white/5 hover:border-white/35 transition-all duration-200 disabled:opacity-40"
        >
          {pending ? 'Enregistrement…' : mode === 'create' ? "Créer l'interview" : 'Enregistrer'}
        </button>

        {mode === 'edit' && onDelete && (
          <div>
            {confirmDelete ? (
              <div className="flex items-center gap-3">
                <span className="font-mono text-[9px] text-otto-grey uppercase tracking-[0.1em]">Confirmer ?</span>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => startDelete(async () => { await onDelete?.() })}
                  className="font-mono text-[9px] text-red-400 hover:text-red-300 uppercase tracking-[0.1em] transition-colors disabled:opacity-40"
                >
                  {deleting ? 'Suppression…' : 'Oui, supprimer'}
                </button>
                <button type="button" onClick={() => setConfirmDelete(false)}
                  className="font-mono text-[9px] text-otto-grey hover:text-otto-chalk uppercase tracking-[0.1em] transition-colors">
                  Annuler
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => setConfirmDelete(true)}
                className="font-mono text-[9px] text-otto-grey/50 hover:text-red-400 uppercase tracking-[0.1em] transition-colors">
                Supprimer l&apos;interview
              </button>
            )}
          </div>
        )}
      </div>

    </form>
  )
}

function Field({ label, name, type = 'text', defaultValue, required, placeholder, className }: {
  label: string; name: string; type?: string
  defaultValue?: string; required?: boolean; placeholder?: string; className?: string
}) {
  return (
    <div className={className}>
      <label className="block font-mono text-[9px] text-otto-grey uppercase tracking-[0.2em] mb-2">{label}</label>
      <input
        name={name} type={type} defaultValue={defaultValue} required={required} placeholder={placeholder}
        className="w-full bg-otto-charcoal border border-white/10 px-4 py-3 font-mono text-[12px] text-otto-chalk placeholder-otto-grey/30 focus:outline-none focus:border-white/30 transition-colors"
      />
    </div>
  )
}
