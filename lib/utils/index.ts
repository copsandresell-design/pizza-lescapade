import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrix(prix: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
  }).format(prix)
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9).toUpperCase()
}

export function generateNumero(): number {
  return Math.floor(100 + Math.random() * 900)
}

export function formatHeure(date: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function getCreneauxDisponibles(): string[] {
  const now = new Date()
  const creneaux: string[] = []

  const periodes = [
    { debut: 11, debutMin: 30, fin: 14, finMin: 0 },
    { debut: 18, debutMin: 30, fin: 22, finMin: 0 },
  ]

  for (const periode of periodes) {
    let h = periode.debut
    let m = periode.debutMin
    while (h < periode.fin || (h === periode.fin && m < periode.finMin)) {
      const slot = new Date(now)
      slot.setHours(h, m, 0, 0)
      if (slot.getTime() > now.getTime() + 20 * 60 * 1000) {
        creneaux.push(
          `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
        )
      }
      m += 15
      if (m >= 60) {
        m -= 60
        h++
      }
    }
  }

  return creneaux
}
