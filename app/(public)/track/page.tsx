'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, Clock, ChefHat, CheckCircle, XCircle, Package } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { formatPrix, formatDate } from '@/lib/utils'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/types'
import type { Order, OrderStatus } from '@/types'

const STATUS_ICONS: Record<OrderStatus, React.ReactNode> = {
  pending: <Clock size={28} />,
  confirmed: <Package size={28} />,
  preparing: <ChefHat size={28} />,
  ready: <CheckCircle size={28} />,
  cancelled: <XCircle size={28} />,
}

const STATUS_STEPS: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready']

export default function TrackPage() {
  return (
    <Suspense>
      <TrackContent />
    </Suspense>
  )
}

function TrackContent() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('id') ?? '')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const search = async (val?: string) => {
    const q = (val ?? query).trim()
    if (!q) return
    setLoading(true)
    setError('')
    setOrder(null)
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(q)}`)
      if (!res.ok) {
        setError('Commande introuvable. Vérifiez l\'identifiant.')
        return
      }
      setOrder(await res.json())
    } catch {
      setError('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const id = searchParams.get('id')
    if (id) search(id)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const stepIndex = order
    ? STATUS_STEPS.indexOf(order.statut as OrderStatus)
    : -1

  return (
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: '#fdf6ec' }}>
      <div className="max-w-lg mx-auto">
        <h1
          className="text-center mb-2"
          style={{
            fontFamily: 'var(--font-dancing), cursive',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            color: '#7a5c2e',
          }}
        >
          Suivre ma commande
        </h1>
        <p className="text-center text-sm mb-8" style={{ color: '#9a7c4e' }}>
          Entrez votre identifiant de commande (reçu à la confirmation)
        </p>

        {/* Search */}
        <div className="flex gap-2 mb-8">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Identifiant de commande…"
            onKeyDown={(e) => e.key === 'Enter' && search()}
          />
          <Button onClick={() => search()} disabled={loading} className="shrink-0 gap-1.5">
            <Search size={15} />
            {loading ? '…' : 'Chercher'}
          </Button>
        </div>

        {error && (
          <div
            className="rounded-xl px-4 py-3 mb-6 text-sm"
            style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}
          >
            {error}
          </div>
        )}

        {order && (
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: '1px solid #e8d5b0', backgroundColor: '#fff8f0' }}
          >
            {/* Status hero */}
            <div
              className="flex flex-col items-center py-8 px-4 text-center"
              style={{ backgroundColor: '#f5e9d2' }}
            >
              <div
                className="mb-3"
                style={{ color: ORDER_STATUS_COLORS[order.statut] }}
              >
                {STATUS_ICONS[order.statut]}
              </div>
              <p className="text-xl font-bold" style={{ color: ORDER_STATUS_COLORS[order.statut] }}>
                {ORDER_STATUS_LABELS[order.statut]}
              </p>
              <p className="text-xs mt-1" style={{ color: '#9a7c4e' }}>
                Commande #{order.numero} · {formatDate(order.createdAt)}
              </p>
            </div>

            {/* Progress bar */}
            {order.statut !== 'cancelled' && (
              <div className="px-6 py-5" style={{ borderBottom: '1px solid #e8d5b0' }}>
                <div className="flex items-center gap-0">
                  {STATUS_STEPS.map((step, i) => (
                    <div key={step} className="flex items-center flex-1 last:flex-none">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{
                          backgroundColor: i <= stepIndex ? '#7a5c2e' : '#e8d5b0',
                          color: i <= stepIndex ? '#fdf6ec' : '#9a7c4e',
                        }}
                      >
                        {i + 1}
                      </div>
                      {i < STATUS_STEPS.length - 1 && (
                        <div
                          className="flex-1 h-1"
                          style={{ backgroundColor: i < stepIndex ? '#7a5c2e' : '#e8d5b0' }}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs" style={{ color: '#9a7c4e' }}>
                  <span>Reçue</span>
                  <span>Confirmée</span>
                  <span>En prépa.</span>
                  <span>Prête</span>
                </div>
              </div>
            )}

            {/* Details */}
            <div className="px-5 py-4">
              <p className="text-sm font-semibold mb-3" style={{ color: '#2c1a0e' }}>
                Détail de la commande
              </p>
              <ul className="space-y-2 mb-4">
                {order.items.map((item) => (
                  <li
                    key={item.pizzaId}
                    className="flex justify-between text-sm"
                    style={{ color: '#6b5040' }}
                  >
                    <span>
                      {item.quantite}× {item.nom}
                    </span>
                    <span className="font-semibold">{formatPrix(item.prix * item.quantite)}</span>
                  </li>
                ))}
              </ul>
              <div
                className="flex justify-between pt-3 font-bold text-sm"
                style={{ borderTop: '1px solid #e8d5b0' }}
              >
                <span style={{ color: '#2c1a0e' }}>Total</span>
                <span style={{ color: '#7a5c2e' }}>{formatPrix(order.total)}</span>
              </div>

              {order.heureRetrait && (
                <div
                  className="mt-4 flex items-center gap-2 rounded-xl px-3 py-2"
                  style={{ backgroundColor: '#f5e9d2' }}
                >
                  <Clock size={15} style={{ color: '#7a5c2e' }} />
                  <span className="text-sm" style={{ color: '#6b5040' }}>
                    Retrait prévu à <strong>{order.heureRetrait}</strong>
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm mb-2" style={{ color: '#9a7c4e' }}>
            Besoin d&apos;aide ?
          </p>
          <a
            href="tel:+33780988177"
            className="font-semibold text-sm hover:underline"
            style={{ color: '#7a5c2e' }}
          >
            07 80 98 81 77
          </a>
        </div>

        <div className="mt-6 text-center">
          <Link href="/menu">
            <Button variant="ghost" size="sm">← Retour à la carte</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
