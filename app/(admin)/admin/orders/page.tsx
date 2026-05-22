'use client'
import { useEffect, useState, useCallback } from 'react'
import { RefreshCw, Phone, Clock, ChefHat, CheckCircle, AlertCircle, Ban } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrix, formatDate } from '@/lib/utils'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/types'
import type { Order, OrderStatus } from '@/types'
import { toast } from 'sonner'

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: 'confirmed',
  confirmed: 'preparing',
  preparing: 'ready',
}

const STATUS_ICONS: Partial<Record<OrderStatus, React.ReactNode>> = {
  pending: <AlertCircle size={14} />,
  confirmed: <CheckCircle size={14} />,
  preparing: <ChefHat size={14} />,
  ready: <CheckCircle size={14} />,
  cancelled: <Ban size={14} />,
}

const NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  pending: 'Confirmer',
  confirmed: 'En préparation',
  preparing: 'Prête !',
}

const FILTERS: { key: OrderStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'Toutes' },
  { key: 'pending', label: 'En attente' },
  { key: 'confirmed', label: 'Confirmées' },
  { key: 'preparing', label: 'En prépa.' },
  { key: 'ready', label: 'Prêtes' },
  { key: 'cancelled', label: 'Annulées' },
]

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')

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
    const interval = setInterval(load, 15000)
    return () => clearInterval(interval)
  }, [load])

  const advance = async (order: Order) => {
    const next = NEXT_STATUS[order.statut]
    if (!next) return
    const res = await fetch(`/api/orders/${order.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statut: next }),
    })
    if (res.ok) {
      const updated = await res.json()
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)))
      toast.success(`Commande #${order.numero} → ${ORDER_STATUS_LABELS[next]}`)
    }
  }

  const cancel = async (order: Order) => {
    if (!confirm(`Annuler la commande #${order.numero} ?`)) return
    const res = await fetch(`/api/orders/${order.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statut: 'cancelled' }),
    })
    if (res.ok) {
      const updated = await res.json()
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)))
      toast.error(`Commande #${order.numero} annulée`)
    }
  }

  const visible = filter === 'all' ? orders : orders.filter((o) => o.statut === filter)
  const activeCount = orders.filter((o) => o.statut !== 'cancelled' && o.statut !== 'ready').length

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#fdf6ec' }}>Commandes</h1>
          {activeCount > 0 && (
            <p className="text-sm mt-0.5" style={{ color: '#d4a843' }}>
              {activeCount} commande{activeCount > 1 ? 's' : ''} active{activeCount > 1 ? 's' : ''}
            </p>
          )}
        </div>
        <button
          onClick={load}
          className="p-2 rounded-full hover:bg-[#2c1a0e] transition-colors"
          aria-label="Actualiser"
        >
          <RefreshCw size={16} style={{ color: '#9a7c4e' }} />
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition-colors shrink-0"
            style={
              filter === f.key
                ? { backgroundColor: '#d4a843', color: '#2c1a0e' }
                : { backgroundColor: '#1a0e06', color: '#9a7c4e', border: '1px solid #3a2010' }
            }
          >
            {f.label}
            {f.key !== 'all' && (
              <span className="ml-1 opacity-60">
                ({orders.filter((o) => o.statut === f.key).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders */}
      {loading ? (
        <div className="text-center py-16" style={{ color: '#6b5040' }}>Chargement…</div>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl py-16 text-center" style={{ backgroundColor: '#1a0e06', border: '1px solid #3a2010' }}>
          <p style={{ color: '#6b5040' }}>Aucune commande</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl overflow-hidden flex flex-col"
              style={{ backgroundColor: '#1a0e06', border: '1px solid #3a2010' }}
            >
              {/* Card header */}
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{ backgroundColor: '#2c1a0e', borderBottom: '1px solid #3a2010' }}
              >
                <div>
                  <span className="font-bold text-lg" style={{ color: '#d4a843' }}>
                    #{order.numero}
                  </span>
                  <span className="ml-2 text-xs" style={{ color: '#6b5040' }}>
                    {formatDate(order.createdAt)}
                  </span>
                </div>
                <Badge bg={ORDER_STATUS_COLORS[order.statut]} color="#fff">
                  <span className="flex items-center gap-1">
                    {STATUS_ICONS[order.statut]}
                    {ORDER_STATUS_LABELS[order.statut]}
                  </span>
                </Badge>
              </div>

              {/* Client */}
              <div className="flex items-center gap-3 px-4 py-2.5" style={{ borderBottom: '1px solid #3a2010' }}>
                <div className="flex-1">
                  <p className="font-semibold text-sm" style={{ color: '#fdf6ec' }}>{order.client.nom}</p>
                  <a
                    href={`tel:${order.client.telephone}`}
                    className="flex items-center gap-1 text-xs hover:underline"
                    style={{ color: '#9a7c4e' }}
                  >
                    <Phone size={11} /> {order.client.telephone}
                  </a>
                </div>
                {order.heureRetrait && (
                  <div
                    className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold shrink-0"
                    style={{ backgroundColor: '#3a2010', color: '#d4a843' }}
                  >
                    <Clock size={12} /> {order.heureRetrait}
                  </div>
                )}
                {order.modeRetrait && (
                  <div
                    className="rounded-lg px-2 py-1 text-xs font-bold shrink-0"
                    style={
                      order.modeRetrait === 'takeaway'
                        ? { backgroundColor: '#14532d', color: '#4ade80' }
                        : { backgroundColor: '#1e3a5f', color: '#60a5fa' }
                    }
                  >
                    {order.modeRetrait === 'takeaway' ? '🛍️ À emporter' : '🪑 Sur place'}
                  </div>
                )}
              </div>

              {/* Items */}
              <ul className="px-4 py-3 space-y-1 flex-1">
                {order.items.map((item, i) => (
                  <li key={i} className="flex justify-between text-sm" style={{ color: '#c8a87a' }}>
                    <span>{item.quantite}× {item.nom}</span>
                    <span>{formatPrix(item.prix * item.quantite)}</span>
                  </li>
                ))}
              </ul>

              {order.note && (
                <div
                  className="mx-4 mb-3 rounded-lg px-3 py-2 text-xs italic"
                  style={{ backgroundColor: '#2c1a0e', color: '#9a7c4e' }}
                >
                  Note : {order.note}
                </div>
              )}

              {/* Footer */}
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{ borderTop: '1px solid #3a2010' }}
              >
                <span className="font-bold" style={{ color: '#d4a843' }}>{formatPrix(order.total)}</span>
                <div className="flex gap-2">
                  {order.statut !== 'cancelled' && order.statut !== 'ready' && (
                    <>
                      <button
                        onClick={() => cancel(order)}
                        className="px-2 py-1 rounded-lg text-xs hover:bg-red-900/30 transition-colors"
                        style={{ color: '#f87171' }}
                      >
                        Annuler
                      </button>
                      <Button
                        size="sm"
                        onClick={() => advance(order)}
                        style={{ backgroundColor: '#d4a843', color: '#2c1a0e' }}
                      >
                        {NEXT_LABEL[order.statut] ?? 'Avancer'}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
