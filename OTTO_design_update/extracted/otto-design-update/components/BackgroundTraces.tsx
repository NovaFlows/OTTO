/**
 * Décor de fond statique : halos radiaux dans les coins +
 * éclaboussures de craie fixes. L'animation des traits aléatoires
 * est gérée par <ChalkAmbient />.
 */
export default function BackgroundTraces() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    >
      {/* Coin haut gauche — halo */}
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.06]"
        style={{ background: 'radial-gradient(circle, rgb(var(--c-chalk)) 0%, transparent 70%)' }}
      />

      {/* Coin bas droit — halo */}
      <div
        className="absolute -bottom-60 -right-60 w-[800px] h-[800px] rounded-full opacity-[0.05]"
        style={{ background: 'radial-gradient(circle, rgb(var(--c-chalk)) 0%, transparent 70%)' }}
      />

      {/* Centre léger */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] opacity-[0.03]"
        style={{ background: 'radial-gradient(ellipse, rgb(var(--c-chalk)) 0%, transparent 70%)' }}
      />

      {/* Éclaboussures fixes — coin haut gauche */}
      <svg
        className="absolute -top-10 -left-10 w-[360px] h-[360px] text-otto-chalk"
        viewBox="0 0 360 360"
        style={{ opacity: 0.12 }}
        fill="currentColor"
      >
        <circle cx="40" cy="50" r="1.4" />
        <circle cx="80" cy="30" r="0.8" />
        <circle cx="120" cy="60" r="2" />
        <circle cx="180" cy="40" r="0.6" />
        <circle cx="60" cy="120" r="1.2" />
        <circle cx="100" cy="160" r="0.9" />
        <circle cx="150" cy="200" r="1.6" />
        <circle cx="40" cy="220" r="0.7" />
        <circle cx="200" cy="120" r="0.8" />
        <circle cx="240" cy="80" r="0.5" />
        <circle cx="220" cy="180" r="1.0" />
        <circle cx="80" cy="280" r="0.6" />
        <circle cx="140" cy="260" r="0.9" />
        <circle cx="20" cy="300" r="1.3" />
        <path
          d="M 30 100 Q 70 90, 110 110"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M 180 50 Q 210 60, 240 50"
          stroke="currentColor"
          strokeWidth="0.4"
          fill="none"
          opacity="0.5"
        />
      </svg>

      {/* Éclaboussures fixes — coin bas droit */}
      <svg
        className="absolute -bottom-20 -right-20 w-[520px] h-[520px] text-otto-chalk"
        viewBox="0 0 520 520"
        style={{ opacity: 0.09 }}
        fill="currentColor"
      >
        <circle cx="80" cy="120" r="1.4" />
        <circle cx="140" cy="60" r="0.7" />
        <circle cx="200" cy="100" r="1.2" />
        <circle cx="260" cy="180" r="0.6" />
        <circle cx="340" cy="140" r="1.8" />
        <circle cx="400" cy="220" r="1.0" />
        <circle cx="460" cy="300" r="0.9" />
        <circle cx="120" cy="300" r="0.5" />
        <circle cx="200" cy="380" r="1.4" />
        <circle cx="280" cy="420" r="0.6" />
        <circle cx="360" cy="360" r="1.0" />
        <circle cx="440" cy="440" r="1.6" />
        <circle cx="60" cy="240" r="0.7" />
        <circle cx="180" cy="220" r="0.4" />
        <circle cx="320" cy="280" r="0.8" />
        <circle cx="420" cy="120" r="0.5" />
        <path
          d="M 300 200 Q 360 240, 420 260"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M 100 350 Q 160 380, 220 360"
          stroke="currentColor"
          strokeWidth="0.4"
          fill="none"
          opacity="0.4"
        />
      </svg>
    </div>
  )
}
