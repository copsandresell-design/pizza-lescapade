'use client'
import { useEffect, useState, useCallback } from 'react'
import { Download } from 'lucide-react'
import { formatPrix } from '@/lib/utils'
import type { Order } from '@/types'

function BarChart({ data, maxValue }: { data: { label: string; value: number }[]; maxValue?: number }) {
  const max = maxValue ?? Math.max(...data.map((d) => d.value), 1)
  return (
    <div className="flex items-end gap-2 h-40 w-full">
      {data.map((d) => (
        <div key={d.label} className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
          <span className="text-xs font-semibold" style={{ color: '#d4a843' }}>
            {d.value > 0 ? d.value : ''}
          </span>
          <div
            className="w-full rounded-t-md transition-all"
            style={{
              height: `${Math.round((d.value / max) * 110)}px`,
              minHeight: d.value > 0 ? '4px' : '2px',
              backgroundColor: d.value > 0 ? '#d4a843' : '#2c1a0e',
            }}
          />
          <span className="text-[10px] truncate w-full text-center" style={{ color: '#6b5040' }}>
            {d.label}
          </span>
        </div>
      ))}
    </div>
  )
}

function exportCSV(orders: Order[]) {
  const rows = [
    ['ID', 'Numéro', 'Client', 'Téléphone', 'Total', 'Statut', 'Heure retrait', 'Date'],
    ...orders.map((o) => [
      o.id, o.numero, o.client.nom, o.client.telephone,
      o.total, o.statut, o.heureRetrait ?? '', o.createdAt,
    ]),
  ]
  const csv = rows.map((r) => r.join(';')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `commandes-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function StatsPage() {
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

  useEffect(() => { load() }, [load])

  const done = orders.filter((o) => o.statut !== 'cancelled')
  const revenue = done.reduce((s, o) => s + o.total, 0)
  const avg = done.length > 0 ? revenue / done.length : 0
  const cancelled = orders.filter((o) => o.statut === 'cancelled').length
  const convRate = orders.length > 0 ? Math.round((done.length / orders.length) * 100) : 0

  // Pizza popularity
  const pizzaCount: Record<string, number> = {}
  done.forEach((o) => o.items.forEach((i) => {
    pizzaCount[i.nom] = (pizzaCount[i.nom] ?? 0) + i.quantite
  }))
  const pizzaData = Object.entries(pizzaCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([label, value]) => ({ label, value }))

  // Orders by day of week
  const dayLabels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
  const byDay = Array.from({ length: 7 }, (_, i) => ({ label: dayLabels[i], value: 0 }))
  done.forEach((o) => {
    const day = (new Date(o.createdAt).getDay() + 6) % 7
    byDay[day].value++
  })

  // Orders by hour
  const byHour = Array.from({ length: 12 }, (_, i) => ({
    label: `${i + 10}h`,
    value: 0,
  }))
  done.forEach((o) => {
    const h = new Date(o.createdAt).getHours()
    const slot = h - 10
    if (slot >= 0 && slot < 12) byHour[slot].value++
  })

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: '#fdf6ec' }}>Statistiques</h1>
        <button
          onClick={() => exportCSV(orders)}
          disabled={orders.length === 0}
          className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-40"
          style={{ backgroundColor: '#2c1a0e', color: '#d4a843', border: '1px solid #3a2010' }}
        >
          <Download size={15} /> Export CSV
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16" style={{ color: '#6b5040' }}>Chargement…</div>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total commandes', value: String(orders.length) },
              { label: 'Revenu total', value: formatPrix(revenue) },
              { label: 'Panier moyen', value: formatPrix(avg) },
              { label: 'Taux de completion', value: `${convRate}%` },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-2xl p-4" style={{ backgroundColor: '#1a0e06', border: '1px solid #3a2010' }}>
                <p className="text-xs uppercase tracking-wider mb-2" style={{ color: '#6b5040' }}>{label}</p>
                <p className="text-xl font-bold" style={{ color: '#d4a843' }}>{value}</p>
              </div>
            ))}
          </div>

          {orders.length === 0 ? (
            <div className="rounded-2xl py-16 text-center" style={{ backgroundColor: '#1a0e06', border: '1px solid #3a2010' }}>
              <p style={{ color: '#6b5040' }}>Aucune donnée — passez des commandes test pour voir les stats</p>
            </div>
          ) : (
            <>
              {/* Pizza popularity */}
              {pizzaData.length > 0 && (
                <div className="rounded-2xl p-6" style={{ backgroundColor: '#1a0e06', border: '1px solid #3a2010' }}>
                  <p className="text-sm font-semibold mb-6" style={{ color: '#9a7c4e' }}>
                    Pizzas les plus commandées
                  </p>
                  <BarChart data={pizzaData} />
                </div>
              )}

              {/* By day */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-2xl p-6" style={{ backgroundColor: '#1a0e06', border: '1px solid #3a2010' }}>
                  <p className="text-sm font-semibold mb-6" style={{ color: '#9a7c4e' }}>Commandes par jour</p>
                  <BarChart data={byDay} />
                </div>
                <div className="rounded-2xl p-6" style={{ backgroundColor: '#1a0e06', border: '1px solid #3a2010' }}>
                  <p className="text-sm font-semibold mb-6" style={{ color: '#9a7c4e' }}>Commandes par heure</p>
                  <BarChart data={byHour} />
                </div>
              </div>

              {/* Summary table */}
              <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #3a2010' }}>
                <div className="px-5 py-3" style={{ backgroundColor: '#2c1a0e', borderBottom: '1px solid #3a2010' }}>
                  <p className="text-sm font-semibold" style={{ color: '#9a7c4e' }}>Résumé</p>
                </div>
                <div className="divide-y" style={{ '--tw-divide-color': '#2c1a0e' } as React.CSSProperties}>
                  {[
                    { label: 'Commandes complétées', value: String(done.length) },
                    { label: 'Commandes annulées', value: String(cancelled) },
                    { label: 'Revenu total (hors annulées)', value: formatPrix(revenue) },
                    { label: 'Panier moyen', value: formatPrix(avg) },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between px-5 py-3"
                      style={{ backgroundColor: '#1a0e06' }}>
                      <span className="text-sm" style={{ color: '#9a7c4e' }}>{label}</span>
                      <span className="text-sm font-semibold" style={{ color: '#fdf6ec' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
