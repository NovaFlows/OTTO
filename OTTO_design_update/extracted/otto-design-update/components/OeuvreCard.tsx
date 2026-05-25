import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/format'

const glowClass: Record<string, string> = {
  danseuses:   'glow-dancer',
  corbeaux:    'glow-crow',
  silhouettes: 'glow-silhouette',
  etudes:      'glow-sketch',
}

export default function OeuvreCard({ oeuvre }: { oeuvre: any }) {
  const isSketch  = oeuvre.categorie === 'etudes'
  const imageUrl  = oeuvre.images?.[0] ?? oeuvre.imagePath ?? null
  const statut    = oeuvre.statut

  return (
    <Link href={`/oeuvre/${oeuvre.slug}`} className="block group">
      {/* Image zone — cadre tableau */}
      <div
        className={`frame relative overflow-hidden aspect-[4/5] ${
          isSketch ? 'bg-otto-paper' : ''
        }`}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={oeuvre.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className={`absolute inset-0 ${glowClass[oeuvre.categorie] ?? ''}`} />
        )}

        {/* Étiquette de stock — coin haut droit */}
        {statut === 'disponible' && (
          <span
            className={`absolute top-3.5 right-3.5 font-mono text-[9px] uppercase tracking-[0.3em] ${
              isSketch ? 'text-otto-black/70' : 'text-otto-chalk/80'
            }`}
          >
            Dispo
          </span>
        )}
        {(statut === 'vendu' || statut === 'reserve') && (
          <span
            className={`absolute top-3.5 right-3.5 font-mono text-[9px] uppercase tracking-[0.3em] ${
              isSketch ? 'text-otto-black/40' : 'text-otto-grey/60'
            }`}
          >
            {statut === 'vendu' ? 'Vendu' : 'Réservé'}
          </span>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-otto-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
          <p className="font-serif italic text-otto-chalk text-lg leading-tight">{oeuvre.title}</p>
          <p className="font-mono text-otto-grey text-[10px] uppercase tracking-[0.18em] mt-1">{oeuvre.year}</p>
        </div>
      </div>

      {/* Caption */}
      <div className="mt-3 px-0.5 flex items-baseline justify-between gap-3">
        <div>
          <p className="font-serif italic text-otto-chalk text-sm leading-tight">{oeuvre.title}</p>
          <p className="font-mono text-otto-grey text-[10px] uppercase tracking-[0.18em] mt-1">{oeuvre.year}</p>
        </div>
        {statut === 'disponible' && oeuvre.price && (
          <p className="font-mono text-otto-white text-[12px] leading-none shrink-0">
            {formatPrice(oeuvre.price)}
          </p>
        )}
      </div>
    </Link>
  )
}
