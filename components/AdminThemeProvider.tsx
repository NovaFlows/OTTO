'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type AdminTheme = 'light' | 'dark'

const AdminThemeContext = createContext<{
  theme: AdminTheme
  toggle: () => void
} | null>(null)

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<AdminTheme>('light')

  useEffect(() => {
    const saved = localStorage.getItem('otto-admin-theme') as AdminTheme | null
    if (saved === 'dark' || saved === 'light') setTheme(saved)
  }, [])

  function toggle() {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light'
      localStorage.setItem('otto-admin-theme', next)
      return next
    })
  }

  return (
    <AdminThemeContext.Provider value={{ theme, toggle }}>
      <div
        className="admin-root min-h-screen bg-otto-black text-otto-chalk"
        data-admin-theme={theme}
      >
        {children}
      </div>
    </AdminThemeContext.Provider>
  )
}

export function useAdminTheme() {
  const ctx = useContext(AdminThemeContext)
  if (!ctx) throw new Error('useAdminTheme must be inside AdminThemeProvider')
  return ctx
}
