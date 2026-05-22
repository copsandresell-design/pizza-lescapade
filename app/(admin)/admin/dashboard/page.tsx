'use client'
import { useEffect, useState, useCallback } from 'react'
import { RefreshCw, ShoppingBag, Clock, Euro, AlertTriangle } from 'lucide-react'
import { formatPrix } from '@/lib/utils'
import type { Order } from '@/types'

const MOCK_ALERTS = [
  { name: 'Mozzarella', qty: 0.4, unit: 'kg', seuil: 1 },
  { name: 'Farine T65', qty: 2, unit: 'kg', seuil: 5 },
]

function KpiCard({ label, value, sub, icon: Icon, accent = false }: {
  label: string; value: string; sub?: string; icon: React.ElementType; accent?: boolean
}) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3"
      style={{ backgroundColor: '#1a0e06', border: `1px solid ${accent ? '#d4a843' : '#3a2010'}` }}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#6b5040' }}>{label}</p>
        <Icon size={18} style={{ color: accent ? '#d4a843' : '#4a3020' }} />
      </div>
      <p className="text-2xl font-bold" style={{ color: accent ? '#d4a843' : '#fdf6ec' }}>{value}</p>
      {sub && <p className="text-xs" style={{ color: '#6b5040' }}>{sub}</p>}
    </div>
  )
}

function BarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className="flex items-end gap-2 h-24 w-full">
      {data.map((d) => (
        <div key={d.label} className="flex flex-col items-center gap-1 flex-1">
          <div
            className="w-full rounded-t-md transition-all"
            style={{
              height: `${Math.round((d.value / max) * 80)}px`,
              minHeight: d.value > 0 ? '4px' : '0',
              backgroundColor: d.value > 0 ? '#d4a843' : '#3a2010',
            }}
          />
          <span className="text-[10px]" style={{ color: '#6b5040' }}>{d.label}</span>
        </div>
      ))}
    </div>
  )
}

function ordersByHour(orders: Order[]) {
  const now = new Date()
  const hours = Array.from({ length: 8 }, (_, i) => {
    const h = (now.getHours() - 7 + i + 24) % 24
    return { label: `${h}h`, value: 0, h }
  })
  orders.forEach((o) => {
    const h = new Date(o.createdAt).getHours()
    const slot = hours.find((s) => s.h === h)
    if (slot) slot.value++
  })
  return hours
}

function isToday(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  return d.toDateString() === now.toDateString()
}

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/orders', { cache: 'no-store' })
      if (res.ok) setOrders(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    const id = setInterval(load, 30000)
    return () => clearInterval(id)
  }, [load])

  const today = orders.filter((o) => isToday(o.createdAt))
  const pending = orders.filter((o) => o.statut === 'pending' || o.statut === 'confirmed' || o.statut === 'preparing')
  const revenue = today.filter((o) => o.statut !== 'cancelled').reduce((s, o) => s + o.total, 0)
  const chartData = ordersByHour(today)

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#fdf6ec' }}>Dashboard</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6b5040' }}>
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <button
          onClick={load}
          className="p-2 rounded-full hover:bg-[#2c1a0e] transition-colors"
          aria-label="Actualiser"
        >
          <RefreshCw size={16} style={{ color: '#9a7c4e' }} />
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16" style={{ color: '#6b5040' }}>Chargement…</div>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard label="Commandes aujourd'hui" value={String(today.length)} icon={ShoppingBag} />
            <KpiCard label="En attente" value={String(pending.length)} icon={Clock} accent={pending.length > 0} />
            <KpiCard label="Revenu du jour" value={formatPrix(revenue)} icon={Euro} />
            <KpiCard
              label="Alertes stock"
              value={String(MOCK_ALERTS.length)}
              sub="ingrédients insuffisants"
              icon={AlertTriangle}
              accent={MOCK_ALERTS.length > 0}
            />
          </div>

          {/* Chart */}
          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: '#1a0e06', border: '1px solid #3a2010' }}
          >
            <p className="text-sm font-semibold mb-4" style={{ color: '#9a7c4e' }}>
              Commandes par heure (aujourd'hui)
            </p>
            <BarChart data={chartData} />
          </div>

          {/* Alertes stock */}
          {MOCK_ALERTS.length > 0 && (
            <div className="rounded-2xl p-5" style={{ backgroundColor: '#1a0e06', border: '1px solid #3a2010' }}>
              <p className="text-sm font-semibold mb-3" style={{ color: '#9a7c4e' }}>Alertes stock</p>
              <div className="flex flex-col gap-2">
                {MOCK_ALERTS.map((a) => (
                  <div key={a.name} className="flex items-center justify-between rounded-xl px-4 py-3"
                    style={{ backgroundColor: '#2c1a0e', border: '1px solid #4a2010' }}>
                    <span className="text-sm font-medium" style={{ color: '#fdf6ec' }}>{a.name}</span>
                    <span className="text-xs font-bold" style={{ color: '#f87171' }}>
                      {a.qty} {a.unit} / seuil {a.seuil} {a.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dernières commandes */}
          {today.length > 0 && (
            <div className="rounded-2xl p-5" style={{ backgroundColor: '#1a0e06', border: '1px solid #3a2010' }}>
              <p className="text-sm font-semibold mb-3" style={{ color: '#9a7c4e' }}>Dernières commandes</p>
              <div className="flex flex-col gap-2">
                {today.slice(0, 5).map((o) => (
                  <div key={o.id} className="flex items-center justify-between rounded-xl px-4 py-2.5"
                    style={{ backgroundColor: '#2c1a0e' }}>
                    <span className="text-sm font-bold" style={{ color: '#d4a843' }}>#{o.numero}</span>
                    <span className="text-sm" style={{ color: '#fdf6ec' }}>{o.client.nom}</span>
                    <span className="text-xs" style={{ color: '#9a7c4e' }}>{o.heureRetrait ?? '—'}</span>
                    <span className="text-sm font-semibold" style={{ color: '#d4a843' }}>{formatPrix(o.total)}</span>
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
