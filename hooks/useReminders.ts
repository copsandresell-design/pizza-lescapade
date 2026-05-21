import { useEffect, useState, useCallback } from 'react'
import type { Reminder } from '@/types'

const apiFetch = globalThis.fetch.bind(globalThis)

export function useReminders(filterDate?: string) {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const url = new URL('/api/reminders', window.location.origin)
      if (filterDate) url.searchParams.append('date', filterDate)

      const res = await apiFetch(url.toString(), { cache: 'no-store' })
      if (!res.ok) throw new Error('Erreur serveur')
      const data = await res.json()
      setReminders(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }, [filterDate])

  useEffect(() => {
    load()
  }, [load])

  const create = async (payload: {
    title: string
    note?: string
    reminder_datetime: string
    recurrence?: string
  }) => {
    const res = await apiFetch('/api/reminders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Erreur création')
    const data = await res.json()
    setReminders((prev) => [...prev, data])
    return data
  }

  const toggle = async (id: string, isDone: boolean) => {
    const res = await apiFetch(`/api/reminders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_done: isDone }),
    })
    if (!res.ok) throw new Error('Erreur modification')
    const data = await res.json()
    setReminders((prev) => prev.map((r) => (r.id === id ? data : r)))
    return data
  }

  const remove = async (id: string) => {
    const res = await apiFetch(`/api/reminders/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Erreur suppression')
    setReminders((prev) => prev.filter((r) => r.id !== id))
  }

  return { reminders, loading, error, create, toggle, remove, refetch: load }
}
