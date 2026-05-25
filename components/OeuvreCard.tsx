import Link from 'next/link'
import Image from 'next/image'

const glowClass: Record<string, string> = {
  danseuses:   'glow-dancer',
  corbeaux:    'glow-crow',
  silhouettes: 'glow-silhouette',
  etudes:      'glow-sketch',
}

export default function OeuvreCard({ oeuvre }: { oeuvre: any }) {
  const isSketch  = oeuvre.categorie === 'etudes'
  const imageUrl  = oeuvre.images?.[0] ?? oeuvre.imagePath ?? null

  return (
    <Link href={`/oeuvre/${oeuvre.slug}`} className="block group">
      {/* Image zone */}
      <div
        className={`relative overflow-hidden aspect-[4/5] ${
          isSketch ? 'bg-otto-paper' : 'bg-otto-charcoal'
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

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-otto-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
          <p className="font-serif italic text-otto-chalk text-lg leading-tight">{oeuvre.title}</p>
          <p className="font-mono text-otto-grey text-[10px] uppercase tracking-[0.18em] mt-1">{oeuvre.year}</p>
        </div>

        {/* Disponible dot */}
        {oeuvre.statut === 'disponible' && (
          <span className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-otto-chalk opacity-50" />
        )}
      </div>

      {/* Caption */}
      <div className="mt-3 px-0.5">
        <p className="font-serif italic text-otto-chalk text-sm leading-tight">{oeuvre.title}</p>
        <p className="font-mono text-otto-grey text-[10px] uppercase tracking-[0.18em] mt-1">{oeuvre.year}</p>
      </div>
    </Link>
  )
}
