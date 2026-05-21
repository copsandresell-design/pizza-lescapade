'use client'
import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface ReminderFormProps {
  onSubmit: (data: {
    title: string
    note?: string
    reminder_datetime: string
    recurrence?: string
  }) => Promise<void>
}

export function ReminderForm({ onSubmit }: ReminderFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      setLoading(true)
      await onSubmit({
        title: formData.get('title') as string,
        note: (formData.get('note') as string) || undefined,
        reminder_datetime: formData.get('reminder_datetime') as string,
        recurrence: formData.get('recurrence') as string,
      })
      form.reset()
      setIsOpen(false)
      toast.success('Rappel créé')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
        style={{
          backgroundColor: '#d4a843',
          color: '#2c1a0e',
        }}
      >
        <Plus size={16} />
        Ajouter rappel
      </button>

      {isOpen && (
        <form
          onSubmit={handleSubmit}
          className="p-4 rounded-lg space-y-3 mt-3"
          style={{ backgroundColor: '#3a2010' }}
        >
          <input
            type="text"
            name="title"
            placeholder="Titre du rappel"
            required
            className="w-full px-3 py-2 rounded text-sm"
            style={{ backgroundColor: '#2c1a0e', color: '#fdf6ec' }}
          />

          <textarea
            name="note"
            placeholder="Note (optionnelle)"
            rows={2}
            className="w-full px-3 py-2 rounded text-sm"
            style={{ backgroundColor: '#2c1a0e', color: '#fdf6ec' }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="datetime-local"
              name="reminder_datetime"
              required
              className="px-3 py-2 rounded text-sm"
              style={{ backgroundColor: '#2c1a0e', color: '#fdf6ec' }}
            />

            <select
              name="recurrence"
              className="px-3 py-2 rounded text-sm"
              style={{ backgroundColor: '#2c1a0e', color: '#fdf6ec' }}
            >
              <option value="none">Pas de récurrence</option>
              <option value="daily">Chaque jour</option>
              <option value="weekly">Chaque semaine</option>
              <option value="monthly">Chaque mois</option>
            </select>
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: '#d4a843', color: '#2c1a0e' }}
            >
              {loading ? 'Création...' : 'Créer'}
            </Button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 rounded text-sm flex items-center gap-1"
              style={{ backgroundColor: '#4a3020', color: '#9a7c4e' }}
            >
              <X size={14} />
              Annuler
            </button>
          </div>
        </form>
      )}
    </>
  )
}
