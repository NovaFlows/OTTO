export default function BackgroundTraces() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    >
      {/* Coin haut gauche */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.06]"
        style={{ background: 'radial-gradient(circle, rgb(var(--c-chalk)) 0%, transparent 70%)' }} />

      {/* Coin bas droit */}
      <div className="absolute -bottom-60 -right-60 w-[800px] h-[800px] rounded-full opacity-[0.05]"
        style={{ background: 'radial-gradient(circle, rgb(var(--c-chalk)) 0%, transparent 70%)' }} />

      {/* Centre léger */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] opacity-[0.03]"
        style={{ background: 'radial-gradient(ellipse, rgb(var(--c-chalk)) 0%, transparent 70%)' }} />
    </div>
  )
}
