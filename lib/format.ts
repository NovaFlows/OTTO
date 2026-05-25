export function formatPrice(centimes: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(centimes / 100)
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso))
}

export function formatOrderNumber(n: number): string {
  const year = new Date().getFullYear()
  return `OTTO-${year}-${String(n).padStart(4, '0')}`
}
