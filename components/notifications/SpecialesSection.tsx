'use client'
import { useEffect, useState } from 'react'
import { Star, Calendar, Tag } from 'lucide-react'
import type { AppNotification, NotificationType } from '@/types'

const TYPE_ICONS: Record<NotificationType, React.ReactNode> = {
  promo:    <Tag size={18} />,
  pizza:    <span style={{ fontSize: '1.1rem' }}>🍕</span>,
  event:    <Calendar size={18} />,
  reminder: <Star size={18} />,
}

const TYPE_COLORS: Record<NotificationType, string> = {
  promo:    '#d4a843',
  pizza:    '#f97316',
  event:    '#3b82f6',
  reminder: '#6b7280',
}

export function SpecialesSection() {
  const [items, setItems] = useState<AppNotification[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetch('/api/notifications?active=true')
      .then((r) => r.ok ? r.json() : [])
      .then((all: AppNotification[]) => {
        const inapp = all.filter((n) => n.channels.includes('inapp'))
        setItems(inapp.slice(0, 3))
      })
      .catch(() => {})
  }, [])

  if (!mounted || items.length === 0) return null

  return (
    <section className="py-12 px-6" style={{ backgroundColor: '#1a0e06' }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#d4a843', color: '#1a0e06' }}
          >
            <Star size={15} fill="currentColor" />
          </div>
          <h2
            className="text-xl font-bold tracking-wide"
            style={{ fontFamily: 'var(--font-dancing), cursive', fontSize: '1.6rem', color: '#d4a843' }}
          >
            À la Une
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((n) => {
            const color = TYPE_COLORS[n.type]
            return (
              <div
                key={n.id}
                className="rounded-2xl overflow-hidden flex flex-col"
                style={{ backgroundColor: '#0f0803', border: `1px solid ${color}33` }}
              >
                {/* Image */}
                {n.image ? (
                  <div className="h-36 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={n.image} alt={n.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="h-36 flex items-center justify-center" style={{ backgroundColor: '#2c1a0e' }}>
                    <span style={{ fontSize: '3rem' }}>🍕</span>
                  </div>
                )}

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <span style={{ color }}>{TYPE_ICONS[n.type]}</span>
                    <span
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color }}
                    >
                      {n.type === 'promo' ? 'Promo' : n.type === 'pizza' ? 'Pizza du moment' : n.type === 'event' ? 'Soirée' : 'Info'}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm mb-1" style={{ color: '#fdf6ec' }}>{n.title}</h3>
                  <p className="text-xs flex-1" style={{ color: '#9a7c4e' }}>{n.description}</p>
                  {n.type === 'event' && (
                    <p className="text-xs mt-2 font-semibold" style={{ color }}>
                      Jusqu'au {new Date(n.endDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
