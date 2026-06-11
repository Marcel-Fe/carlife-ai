const euroFormat = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
})

const numberFormat = new Intl.NumberFormat('de-DE', {
  maximumFractionDigits: 1,
})

export function formatEuro(value: number): string {
  return euroFormat.format(value)
}

export function formatNumber(value: number, digits = 1): string {
  if (digits === 1) return numberFormat.format(value)
  return new Intl.NumberFormat('de-DE', { maximumFractionDigits: digits }).format(value)
}

export function formatKm(value: number): string {
  return `${new Intl.NumberFormat('de-DE').format(value)} km`
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}
