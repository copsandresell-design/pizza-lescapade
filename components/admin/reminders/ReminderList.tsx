'use client'
import { CheckCircle2, Circle, Trash2, Clock } from 'lucide-react'
import { useReminders } from '@/hooks/useReminders'
import { ReminderForm } from './ReminderForm'
import { toast } from 'sonner'

export function ReminderList() {
  const { reminders, loading, create, toggle, remove } = useReminders()

  const handleToggle = async (id: string, isDone: boolean) => {
    try {
      await toggle(id, !isDone)
      toast.success(!isDone ? 'Marqué fait' : 'Marqué à faire')
    } catch (err) {
      toast.error('Erreur')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce rappel ?')) return
    try {
      await remove(id)
      toast.success('Rappel supprimé')
    } catch (err) {
      toast.error('Erreur')
    }
  }

  if (loading) {
    return <div style={{ color: '#9a7c4e' }}>Chargement...</div>
  }

  const active = reminders.filter((r) => !r.is_done)
  const done = reminders.filter((r) => r.is_done)

  return (
    <div className="space-y-4">
      <ReminderForm onSubmit={create} />

      {reminders.length === 0 ? (
        <div style={{ color: '#6b5040' }} className="text-center py-8">
          Aucun rappel
        </div>
      ) : (
        <>
          {/* À faire */}
          {active.length > 0 && (
            <div>
              <h3 className="text-sm font-bold mb-2" style={{ color: '#d4a843' }}>
                À faire ({active.length})
              </h3>
              <div className="space-y-2">
                {active.map((reminder) => {
                  const date = new Date(reminder.reminder_datetime)
                  const isExpired = date < new Date()
                  return (
                    <div
                      key={reminder.id}
                      className="p-3 rounded-lg flex items-start gap-3 cursor-pointer hover:opacity-80"
                      style={{
                        backgroundColor: '#2c1a0e',
                        border: `1px solid ${isExpired ? '#f87171' : '#4a3020'}`,
                      }}
                    >
                      <button
                        onClick={() => handleToggle(reminder.id, reminder.is_done)}
                        className="flex-shrink-0 mt-0.5"
                      >
                        <Circle
                          size={20}
                          style={{ color: isExpired ? '#f87171' : '#d4a843' }}
                        />
                      </button>

                      <div className="flex-1 min-w-0">
                        <div
                          className="font-semibold text-sm"
                          style={{
                            color: '#fdf6ec',
                            textDecoration: reminder.is_done ? 'line-through' : 'none',
                          }}
                        >
                          {reminder.title}
                        </div>
                        {reminder.note && (
                          <div
                            className="text-xs mt-1"
                            style={{ color: '#9a7c4e' }}
                          >
                            {reminder.note}
                          </div>
                        )}
                        <div className="flex items-center gap-1 mt-1 text-xs" style={{ color: '#9a7c4e' }}>
                          <Clock size={12} />
                          {date.toLocaleDateString('fr-FR')} à {date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          {reminder.recurrence !== 'none' && (
                            <span className="ml-1">🔄 ({reminder.recurrence})</span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDelete(reminder.id)}
                        className="flex-shrink-0 p-1 hover:bg-red-900/20 rounded"
                      >
                        <Trash2 size={14} style={{ color: '#f87171' }} />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Fait */}
          {done.length > 0 && (
            <div>
              <h3 className="text-sm font-bold mb-2" style={{ color: '#6b5040' }}>
                Fait ({done.length})
              </h3>
              <div className="space-y-2">
                {done.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="p-3 rounded-lg flex items-start gap-3 opacity-60"
                    style={{ backgroundColor: '#2c1a0e', border: '1px solid #4a3020' }}
                  >
                    <button
                      onClick={() => handleToggle(reminder.id, reminder.is_done)}
                      className="flex-shrink-0 mt-0.5"
                    >
                      <CheckCircle2 size={20} style={{ color: '#16a34a' }} />
                    </button>

                    <div className="flex-1 min-w-0">
                      <div
                        className="font-semibold text-sm line-through"
                        style={{ color: '#9a7c4e' }}
                      >
                        {reminder.title}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(reminder.id)}
                      className="flex-shrink-0 p-1"
                    >
                      <Trash2 size={14} style={{ color: '#f87171' }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
