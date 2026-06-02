import type { Metadata } from 'next'
import { AdminThemeProvider } from '@/components/AdminThemeProvider'

export const metadata: Metadata = {
  title: {
    default: 'Admin — Otto',
    template: '%s | Admin Otto',
  },
  robots: 'noindex, nofollow',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminThemeProvider>
      {children}
    </AdminThemeProvider>
  )
}
