'use client'
import { Clock, CheckCircle2, Circle } from 'lucide-react'
import { useReminders } from '@/hooks/useReminders'

export function RemindersDayWidget() {
  const today = new Date().toISOString().split('T')[0]
  const { reminders, loading, toggle } = useReminders(today)

  if (loading) return null

  const active = reminders.filter((r) => !r.is_done)
  const done = reminders.filter((r) => r.is_done)

  if (reminders.length === 0) return null

  return (
    <div
      className="p-4 rounded-lg"
      style={{ backgroundColor: '#2c1a0e', border: '1px solid #4a3020' }}
    >
      <div className="flex items-center gap-2 mb-3" style={{ color: '#d4a843' }}>
        <Clock size={18} />
        <h3 className="font-bold">Rappels du jour ({active.length})</h3>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {active.map((reminder) => {
          const date = new Date(reminder.reminder_datetime)
          return (
            <div
              key={reminder.id}
              className="p-2 rounded flex items-center gap-2"
              style={{ backgroundColor: '#3a2010' }}
            >
              <button
                onClick={() => toggle(reminder.id, reminder.is_done)}
                className="flex-shrink-0"
              >
                <Circle size={16} style={{ color: '#d4a843' }} />
              </button>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold" style={{ color: '#fdf6ec' }}>
                  {reminder.title}
                </div>
                <div className="text-xs" style={{ color: '#9a7c4e' }}>
                  {date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          )
        })}

        {done.length > 0 && (
          <div
            className="text-xs p-2 rounded text-center opacity-60"
            style={{ color: '#6b5040' }}
          >
            +{done.length} fait
          </div>
        )}
      </div>
    </div>
  )
}
