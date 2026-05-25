import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Admin — Otto',
    template: '%s | Admin Otto',
  },
  robots: 'noindex, nofollow',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#ECEAE4', color: '#111' }}>

      {/* Dégradés — même logique que la page principale */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, #111 0%, transparent 70%)', opacity: 0.04 }} />
        <div className="absolute -bottom-60 -right-60 w-[800px] h-[800px] rounded-full"
          style={{ background: 'radial-gradient(circle, #111 0%, transparent 70%)', opacity: 0.03 }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px]"
          style={{ background: 'radial-gradient(ellipse, #111 0%, transparent 70%)', opacity: 0.015 }} />
      </div>

      <div className="relative" style={{ zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}
