'use client'
import { Bell } from 'lucide-react'
import { ReminderList } from '@/components/admin/reminders/ReminderList'

export default function RemindersPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1a0e06', color: '#fdf6ec' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-10 px-5 py-3 flex items-center gap-3"
        style={{ backgroundColor: '#2c1a0e', borderBottom: '1px solid #4a3020' }}
      >
        <Bell size={20} style={{ color: '#d4a843' }} />
        <span style={{ fontFamily: 'var(--font-dancing), cursive', fontSize: '1.4rem', color: '#d4a843' }}>
          L&apos;Escapade · Rappels
        </span>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <ReminderList />
      </main>
    </div>
  )
}
