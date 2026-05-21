import { useEffect, useState, useCallback } from 'react'
import type { Ingredient } from '@/types'

const apiFetch = globalThis.fetch.bind(globalThis)

export function useIngredients() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const res = await apiFetch('/api/ingredients', { cache: 'no-store' })
      if (!res.ok) throw new Error('Erreur serveur')
      const data = await res.json()
      setIngredients(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const create = async (payload: Omit<Ingredient, 'id' | 'created_at' | 'updated_at' | 'business_id'>) => {
    const res = await apiFetch('/api/ingredients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Erreur création')
    const data = await res.json()
    setIngredients((prev) => [...prev, data])
    return data
  }

  const update = async (id: string, payload: Partial<Ingredient>) => {
    const res = await apiFetch(`/api/ingredients/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Erreur modification')
    const data = await res.json()
    setIngredients((prev) => prev.map((i) => (i.id === id ? data : i)))
    return data
  }

  const remove = async (id: string) => {
    const res = await apiFetch(`/api/ingredients/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Erreur suppression')
    setIngredients((prev) => prev.filter((i) => i.id !== id))
  }

  return { ingredients, loading, error, create, update, remove, refetch: load }
}
