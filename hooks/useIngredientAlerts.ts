import { useEffect, useState, useCallback } from 'react'
import type { Ingredient } from '@/types'

export interface AlertItem {
  ingredient_id: string
  ingredient_name: string
  type: 'low_stock' | 'expiring_soon'
  current_quantity: number
  alert_threshold: number
  expiry_date?: string
  days_until_expiry?: number
}

export function useIngredientAlerts(daysBeforeExpiry: number = 3) {
  const [alerts, setAlerts] = useState<AlertItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const res = await globalThis.fetch(`/api/ingredients/alerts?days_before=${daysBeforeExpiry}`, { cache: 'no-store' })
      if (!res.ok) throw new Error('Erreur serveur')
      const data = await res.json()
      setAlerts(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }, [daysBeforeExpiry])

  useEffect(() => {
    load()
  }, [load])

  return { alerts, loading, error, refetch: load }
}
