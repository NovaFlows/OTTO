'use client'

import { useState, useRef, useTransition } from 'react'
import { createClient } from '@/lib/supabase'
import type { Oeuvre } from '@/lib/types'

interface Props {
  oeuvre?: Oeuvre
  onSubmit: (formData: FormData) => Promise<{ error?: string } | void>
  onDelete?: () => void
  mode: 'create' | 'edit'
}

const CATEGORIES = ['danseuses', 'corbeaux', 'silhouettes', 'etudes']
const STATUTS    = ['disponible', 'vendu', 'reserve', 'nfs', 'brouillon']

const inputCls = 'w-full bg-white border border-black/10 px-4 py-3 font-mono text-[12px] text-[#111] placeholder-[#6e6d69]/40 focus:outline-none focus:border-black/25 transition-colors'
const selectCls = `${inputCls} appearance-none cursor-pointer`
const labelCls = 'block font-mono text-[9px] text-[#6e6d69] uppercase tracking-[0.2em] mb-2'

export default function OeuvreForm({ oeuvre, onSubmit, onDelete, mode }: Props) {
  const [images, setImages]               = useState<string[]>(oeuvre?.images ?? [])
  const [uploading, setUploading]         = useState(false)
  const [dragOver, setDragOver]           = useState(false)
  const [error, setError]                 = useState<string | null>(null)
  const [pending, start]                  = useTransition()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const fileInputRef                      = useRef<HTMLInputElement>(null)

  async function uploadFiles(files: FileList | File[]) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      alert('Supabase non configuré — upload impossible en mode démo.')
      return
    }
    setUploading(true)
    const supabase = createClient()
    const uploaded: string[] = []

    for (const file of Array.from(files)) {
      const ext  = file.name.split('.').pop()
      const path = `oeuvres/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('images').upload(path, file, { upsert: false })
      if (error) { setError(error.message); continue }
      const { data } = supabase.storage.from('images').getPublicUrl(path)
      uploaded.push(data.publicUrl)
    }

    setImages((prev) => [...prev, ...uploaded])
    setUploading(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files)
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((u) => u !== url))
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)
    fd.set('images', JSON.stringify(images))
    start(async () => {
      const result = await onSubmit(fd)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* Photos */}
      <div>
        <label className={labelCls}>Photos</label>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed px-8 py-10 text-center cursor-pointer transition-colors ${
            dragOver ? 'border-black/30 bg-black/[0.03]' : 'border-black/10 hover:border-black/20 hover:bg-black/[0.02]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && uploadFiles(e.target.files)}
          />
          <p className="font-mono text-[10px] text-[#6e6d69] uppercase tracking-[0.15em]">
            {uploading
              ? 'Upload en cours…'
              : 'Glisser les photos ici · ou cliquer pour sélectionner'}
          </p>
        </div>

        {images.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-4">
            {images.map((url, i) => (
              <div key={url} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Photo ${i + 1}`} className="w-20 h-20 object-cover border border-black/10" />
                {i === 0 && (
                  <span className="absolute bottom-0 left-0 bg-black/60 font-mono text-[7px] text-white uppercase px-1">
                    principale
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute top-0 right-0 bg-black/80 text-white w-5 h-5 flex items-center justify-center font-mono text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Champs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Field label="Titre" name="title" defaultValue={oeuvre?.title} required />
        <Field label="Slug (URL — ex: arabeque-i)" name="slug" defaultValue={oeuvre?.slug} required placeholder="arabeque-i" />

        <div>
          <label className={labelCls}>Catégorie</label>
          <select name="categorie" defaultValue={oeuvre?.categorie ?? 'danseuses'} className={selectCls}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className={labelCls}>Statut</label>
          <select name="statut" defaultValue={oeuvre?.statut ?? 'brouillon'} className={selectCls}>
            {STATUTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <Field label="Prix (€ — ex: 1200)" name="price" type="number"
          defaultValue={oeuvre?.price ? oeuvre.price / 100 : undefined} placeholder="1200" />
        <Field label="Année" name="year" type="number"
          defaultValue={oeuvre?.year ?? new Date().getFullYear()} required />
        <Field label="Technique" name="technique" defaultValue={oeuvre?.technique} required />
        <Field label="Format (ex: 80 × 100 cm)" name="format" defaultValue={oeuvre?.format} required />
        <Field label="Poids en grammes" name="weight_grams" type="number"
          defaultValue={oeuvre?.weight_grams} placeholder="500" />

        <div className="md:col-span-2">
          <label className={labelCls}>Description (optionnel)</label>
          <textarea
            name="description"
            defaultValue={oeuvre?.description ?? ''}
            rows={3}
            className="w-full bg-white border border-black/10 px-4 py-3 font-mono text-[12px] text-[#111] placeholder-[#6e6d69]/40 focus:outline-none focus:border-black/25 transition-colors resize-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="is_featured"
            id="is_featured"
            value="true"
            defaultChecked={oeuvre?.is_featured ?? false}
            className="w-4 h-4 border border-black/20 focus:outline-none accent-[#111]"
          />
          <label htmlFor="is_featured" className="font-mono text-[10px] text-[#6e6d69] uppercase tracking-[0.15em] cursor-pointer">
            Mettre en avant sur l&apos;accueil
          </label>
        </div>
      </div>

      {error && (
        <p className="font-mono text-[10px] text-red-600 uppercase tracking-[0.1em]">{error}</p>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-black/8">
        <button
          type="submit"
          disabled={pending || uploading}
          className="font-mono text-[10px] uppercase tracking-[0.18em] border border-black/20 px-7 py-3 text-[#111] hover:bg-black/[0.04] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {pending ? 'Enregistrement…' : mode === 'create' ? 'Créer l\'œuvre' : 'Enregistrer'}
        </button>

        {mode === 'edit' && onDelete && (
          <div>
            {confirmDelete ? (
              <div className="flex items-center gap-3">
                <span className="font-mono text-[9px] text-[#6e6d69] uppercase tracking-[0.1em]">Confirmer ?</span>
                <button type="button" onClick={onDelete}
                  className="font-mono text-[9px] text-red-600 hover:text-red-700 uppercase tracking-[0.1em] transition-colors">
                  Oui, supprimer
                </button>
                <button type="button" onClick={() => setConfirmDelete(false)}
                  className="font-mono text-[9px] text-[#6e6d69] hover:text-[#111] uppercase tracking-[0.1em] transition-colors">
                  Annuler
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => setConfirmDelete(true)}
                className="font-mono text-[9px] text-[#6e6d69]/50 hover:text-red-600 uppercase tracking-[0.1em] transition-colors">
                Supprimer l&apos;œuvre
              </button>
            )}
          </div>
        )}
      </div>

    </form>
  )
}

function Field({ label, name, type = 'text', defaultValue, required, placeholder }: {
  label: string; name: string; type?: string
  defaultValue?: string | number; required?: boolean; placeholder?: string
}) {
  return (
    <div>
      <label className="block font-mono text-[9px] text-[#6e6d69] uppercase tracking-[0.2em] mb-2">{label}</label>
      <input
        name={name} type={type} defaultValue={defaultValue as string}
        required={required} placeholder={placeholder}
        className="w-full bg-white border border-black/10 px-4 py-3 font-mono text-[12px] text-[#111] placeholder-[#6e6d69]/40 focus:outline-none focus:border-black/25 transition-colors"
      />
    </div>
  )
}
