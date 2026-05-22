'use client'
import { useEffect, useState } from 'react'
import { X, Megaphone, Star, Calendar, Bell } from 'lucide-react'
import type { AppNotification, NotificationType } from '@/types'

const TYPE_STYLES: Record<NotificationType, { bg: string; border: string; icon: React.ReactNode; color: string }> = {
  promo: {
    bg: 'linear-gradient(135deg, #3d2a00 0%, #2c1a0e 100%)',
    border: '#d4a843',
    icon: <Star size={16} />,
    color: '#d4a843',
  },
  pizza: {
    bg: 'linear-gradient(135deg, #3d1a00 0%, #2c1000 100%)',
    border: '#f97316',
    icon: <span style={{ fontSize: '1rem' }}>🍕</span>,
    color: '#f97316',
  },
  event: {
    bg: 'linear-gradient(135deg, #0a1f3d 0%, #060f20 100%)',
    border: '#3b82f6',
    icon: <Calendar size={16} />,
    color: '#3b82f6',
  },
  reminder: {
    bg: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)',
    border: '#6b7280',
    icon: <Bell size={16} />,
    color: '#6b7280',
  },
}

export function NotificationBanner() {
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = sessionStorage.getItem('dismissed-notifs')
    if (stored) setDismissed(new Set(JSON.parse(stored)))

    fetch('/api/notifications?active=true')
      .then((r) => r.ok ? r.json() : [])
      .then((all: AppNotification[]) => {
        const inapp = all.filter((n) => n.channels.includes('inapp'))
        setNotifications(inapp)
      })
      .catch(() => {})
  }, [])

  const dismiss = (id: string) => {
    const next = new Set([...dismissed, id])
    setDismissed(next)
    sessionStorage.setItem('dismissed-notifs', JSON.stringify([...next]))
  }

  if (!mounted) return null

  const visible = notifications.filter((n) => !dismissed.has(n.id)).slice(0, 2)
  if (visible.length === 0) return null

  return (
    <div className="flex flex-col gap-2 px-4 py-3" style={{ backgroundColor: '#1a0e06' }}>
      {visible.map((n) => {
        const style = TYPE_STYLES[n.type]
        return (
          <div
            key={n.id}
            className="flex items-center gap-3 rounded-xl px-4 py-3 relative"
            style={{ background: style.bg, border: `1px solid ${style.border}33` }}
          >
            {/* Icon */}
            <div
              className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${style.color}22`, color: style.color }}
            >
              {style.icon}
            </div>

            {/* Image */}
            {n.image && (
              <div className="shrink-0 w-10 h-10 rounded-lg overflow-hidden hidden sm:block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={n.image} alt={n.title} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold leading-tight" style={{ color: style.color }}>
                {n.title}
              </p>
              <p className="text-xs mt-0.5 line-clamp-1" style={{ color: '#9a7c4e' }}>
                {n.description}
              </p>
            </div>

            {/* Megaphone badge */}
            <Megaphone size={14} className="shrink-0 hidden sm:block opacity-40" style={{ color: style.color }} />

            {/* Dismiss */}
            <button
              onClick={() => dismiss(n.id)}
              className="shrink-0 p-1 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Fermer"
            >
              <X size={14} style={{ color: '#6b5040' }} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
