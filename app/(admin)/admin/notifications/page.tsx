'use client'
import { useEffect, useState, useCallback } from 'react'
import { Plus, Trash2, Send, ToggleLeft, ToggleRight, X, ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import type { AppNotification, NotificationType, NotificationChannel, NotificationAudience } from '@/types'
import {
  NOTIFICATION_TYPE_LABELS,
  NOTIFICATION_TYPE_COLORS,
  NOTIFICATION_CHANNEL_LABELS,
  NOTIFICATION_AUDIENCE_LABELS,
} from '@/types'

const TYPE_OPTIONS: NotificationType[] = ['promo', 'pizza', 'event', 'reminder']
const CHANNEL_OPTIONS: NotificationChannel[] = ['inapp', 'push', 'email', 'sms']
const AUDIENCE_OPTIONS: NotificationAudience[] = ['all', 'vip', 'regulars', 'inactive']

const EMPTY_FORM = {
  title: '',
  description: '',
  image: '',
  type: 'promo' as NotificationType,
  startDate: new Date().toISOString().slice(0, 10),
  endDate: '',
  channels: ['inapp'] as NotificationChannel[],
  targetAudience: 'all' as NotificationAudience,
}

function statusLabel(n: AppNotification) {
  const today = new Date().toISOString().slice(0, 10)
  if (!n.active) return { label: 'Désactivée', bg: '#1c1c1c', color: '#6b5040' }
  if (n.endDate < today) return { label: 'Expirée', bg: '#2c1a0e', color: '#6b5040' }
  if (n.startDate > today) return { label: 'Planifiée', bg: '#1e3a5f', color: '#60a5fa' }
  return { label: 'Active', bg: '#14532d', color: '#4ade80' }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [sending, setSending] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications', { cache: 'no-store' })
      if (res.ok) setNotifications(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const toggleChannel = (ch: NotificationChannel) => {
    setForm((prev) => ({
      ...prev,
      channels: prev.channels.includes(ch)
        ? prev.channels.filter((c) => c !== ch)
        : [...prev.channels, ch],
    }))
  }

  const create = async () => {
    if (!form.title || !form.description || !form.endDate) return toast.error('Remplissez tous les champs obligatoires')
    if (form.channels.length === 0) return toast.error('Sélectionnez au moins un canal')
    setSaving(true)
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      const created = await res.json()
      setNotifications((prev) => [created, ...prev])
      setShowForm(false)
      setForm(EMPTY_FORM)
      toast.success('Notification créée')
    } catch {
      toast.error('Erreur lors de la création')
    } finally {
      setSaving(false)
    }
  }

  const toggle = async (n: AppNotification) => {
    const res = await fetch(`/api/notifications/${n.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !n.active }),
    })
    if (res.ok) {
      const updated = await res.json()
      setNotifications((prev) => prev.map((x) => x.id === updated.id ? updated : x))
      toast(updated.active ? `${n.title} activée` : `${n.title} désactivée`)
    }
  }

  const remove = async (n: AppNotification) => {
    if (!confirm(`Supprimer "${n.title}" ?`)) return
    const res = await fetch(`/api/notifications/${n.id}`, { method: 'DELETE' })
    if (res.ok) {
      setNotifications((prev) => prev.filter((x) => x.id !== n.id))
      toast.success('Notification supprimée')
    }
  }

  const send = async (n: AppNotification) => {
    setSending(n.id)
    await new Promise((r) => setTimeout(r, 1200))
    const res = await fetch(`/api/notifications/${n.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sentCount: n.sentCount + Math.floor(Math.random() * 80 + 20) }),
    })
    if (res.ok) {
      const updated = await res.json()
      setNotifications((prev) => prev.map((x) => x.id === updated.id ? updated : x))
      toast.success(`Notification envoyée à ${updated.sentCount} clients`)
    }
    setSending(null)
  }

  const activeCount = notifications.filter((n) => {
    const today = new Date().toISOString().slice(0, 10)
    return n.active && n.startDate <= today && n.endDate >= today
  }).length

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#fdf6ec' }}>Notifications</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6b5040' }}>
            {activeCount} active{activeCount > 1 ? 's' : ''} · {notifications.length} total
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
          style={{ backgroundColor: '#d4a843', color: '#1a0e06' }}
        >
          <Plus size={15} /> Créer
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="rounded-2xl p-6 flex flex-col gap-4" style={{ backgroundColor: '#1a0e06', border: '1px solid #d4a843' }}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold" style={{ color: '#d4a843' }}>Nouvelle notification</p>
            <button onClick={() => setShowForm(false)}><X size={16} style={{ color: '#6b5040' }} /></button>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            {/* Titre */}
            <input
              className="notif-input md:col-span-2"
              placeholder="Titre *"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            />
            {/* Description */}
            <textarea
              className="notif-input md:col-span-2 resize-none"
              placeholder="Description *"
              rows={2}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
            {/* Image URL */}
            <input
              className="notif-input md:col-span-2"
              placeholder="URL image (optionnel)"
              value={form.image}
              onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
            />
            {/* Type */}
            <div>
              <label className="block text-xs mb-1" style={{ color: '#6b5040' }}>Type *</label>
              <select
                className="notif-input w-full"
                value={form.type}
                onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as NotificationType }))}
              >
                {TYPE_OPTIONS.map((t) => <option key={t} value={t}>{NOTIFICATION_TYPE_LABELS[t]}</option>)}
              </select>
            </div>
            {/* Audience */}
            <div>
              <label className="block text-xs mb-1" style={{ color: '#6b5040' }}>Audience *</label>
              <select
                className="notif-input w-full"
                value={form.targetAudience}
                onChange={(e) => setForm((p) => ({ ...p, targetAudience: e.target.value as NotificationAudience }))}
              >
                {AUDIENCE_OPTIONS.map((a) => <option key={a} value={a}>{NOTIFICATION_AUDIENCE_LABELS[a]}</option>)}
              </select>
            </div>
            {/* Dates */}
            <div>
              <label className="block text-xs mb-1" style={{ color: '#6b5040' }}>Date début *</label>
              <input
                className="notif-input w-full"
                type="date"
                value={form.startDate}
                onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: '#6b5040' }}>Date fin *</label>
              <input
                className="notif-input w-full"
                type="date"
                value={form.endDate}
                onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
              />
            </div>
          </div>

          {/* Channels */}
          <div>
            <label className="block text-xs mb-2" style={{ color: '#6b5040' }}>Canaux</label>
            <div className="flex flex-wrap gap-2">
              {CHANNEL_OPTIONS.map((ch) => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => toggleChannel(ch)}
                  className="px-3 py-1 rounded-full text-xs font-semibold border transition-all"
                  style={
                    form.channels.includes(ch)
                      ? { backgroundColor: '#d4a843', color: '#1a0e06', borderColor: '#d4a843' }
                      : { backgroundColor: 'transparent', color: '#9a7c4e', borderColor: '#3a2010' }
                  }
                >
                  {NOTIFICATION_CHANNEL_LABELS[ch]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-sm" style={{ color: '#9a7c4e' }}>Annuler</button>
            <button
              onClick={create}
              disabled={saving}
              className="px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-60"
              style={{ backgroundColor: '#d4a843', color: '#1a0e06' }}
            >
              {saving ? 'Création…' : 'Créer'}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="text-center py-16" style={{ color: '#6b5040' }}>Chargement…</div>
      ) : notifications.length === 0 ? (
        <div className="rounded-2xl py-16 text-center" style={{ backgroundColor: '#1a0e06', border: '1px solid #3a2010' }}>
          <p style={{ color: '#6b5040' }}>Aucune notification — créez-en une</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {notifications.map((n) => {
            const st = statusLabel(n)
            const typeColor = NOTIFICATION_TYPE_COLORS[n.type]
            return (
              <div
                key={n.id}
                className="rounded-2xl overflow-hidden"
                style={{ backgroundColor: '#1a0e06', border: '1px solid #3a2010' }}
              >
                <div className="flex gap-4 p-4">
                  {/* Image */}
                  {n.image ? (
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={n.image} alt={n.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div
                      className="w-16 h-16 rounded-xl shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: '#2c1a0e' }}
                    >
                      <ImageIcon size={24} style={{ color: '#3a2010' }} />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-semibold text-sm" style={{ color: '#fdf6ec' }}>{n.title}</span>
                      <span
                        className="rounded-full px-2 py-0.5 text-xs font-bold"
                        style={{ backgroundColor: `${typeColor}22`, color: typeColor }}
                      >
                        {NOTIFICATION_TYPE_LABELS[n.type]}
                      </span>
                      <span
                        className="rounded-full px-2 py-0.5 text-xs font-bold"
                        style={{ backgroundColor: st.bg, color: st.color }}
                      >
                        {st.label}
                      </span>
                    </div>
                    <p className="text-xs mb-2 line-clamp-2" style={{ color: '#9a7c4e' }}>{n.description}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs" style={{ color: '#6b5040' }}>
                      <span>{n.startDate} → {n.endDate}</span>
                      <span>|</span>
                      <span>{n.channels.map((c) => NOTIFICATION_CHANNEL_LABELS[c]).join(', ')}</span>
                      <span>|</span>
                      <span>{NOTIFICATION_AUDIENCE_LABELS[n.targetAudience]}</span>
                      {n.sentCount > 0 && (
                        <>
                          <span>|</span>
                          <span style={{ color: '#d4a843' }}>{n.sentCount} envois</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => send(n)}
                      disabled={sending === n.id}
                      title="Envoyer maintenant"
                      className="p-2 rounded-lg hover:bg-[#2c1a0e] disabled:opacity-40 transition-colors"
                    >
                      <Send size={14} style={{ color: sending === n.id ? '#d4a843' : '#9a7c4e' }} />
                    </button>
                    <button
                      onClick={() => toggle(n)}
                      title={n.active ? 'Désactiver' : 'Activer'}
                      className="p-2 rounded-lg hover:bg-[#2c1a0e] transition-colors"
                    >
                      {n.active
                        ? <ToggleRight size={20} style={{ color: '#4ade80' }} />
                        : <ToggleLeft size={20} style={{ color: '#6b5040' }} />}
                    </button>
                    <button
                      onClick={() => remove(n)}
                      title="Supprimer"
                      className="p-2 rounded-lg hover:bg-red-900/30 transition-colors"
                    >
                      <Trash2 size={14} style={{ color: '#f87171' }} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <style>{`
        .notif-input {
          background: #2c1a0e;
          border: 1px solid #4a3020;
          border-radius: 0.5rem;
          padding: 0.4rem 0.625rem;
          color: #fdf6ec;
          font-size: 0.875rem;
          outline: none;
          width: 100%;
        }
        .notif-input:focus { border-color: #d4a843; }
        .notif-input option { background: #2c1a0e; }
      `}</style>
    </div>
  )
}
