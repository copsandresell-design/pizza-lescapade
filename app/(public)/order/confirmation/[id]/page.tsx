import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { InstallBanner } from '@/components/pwa/install-banner'
import { formatPrix, formatDate } from '@/lib/utils'
import type { Order } from '@/types'

async function getOrder(id: string): Promise<Order | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/orders/${id}`,
      { cache: 'no-store' }
    )
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const order = await getOrder(id)

  if (!order) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4 px-4"
        style={{ backgroundColor: '#fdf6ec' }}
      >
        <p style={{ color: '#6b5040' }}>Commande introuvable</p>
        <Link href="/">
          <Button>Retour à l&apos;accueil</Button>
        </Link>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center py-12 px-4"
      style={{ backgroundColor: '#fdf6ec' }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8 text-center"
        style={{ backgroundColor: '#fff8f0', border: '1px solid #e8d5b0' }}
      >
        <CheckCircle size={56} className="mx-auto mb-4" style={{ color: '#16a34a' }} />

        <h1
          className="mb-1"
          style={{
            fontFamily: 'var(--font-dancing), cursive',
            fontSize: '2.5rem',
            color: '#7a5c2e',
          }}
        >
          Commande confirmée !
        </h1>

        <p className="text-sm mb-6" style={{ color: '#9a7c4e' }}>
          {formatDate(order.createdAt)}
        </p>

        <div
          className="rounded-xl p-4 mb-6 text-left"
          style={{ backgroundColor: '#f5e9d2' }}
        >
          <div className="flex justify-between mb-3">
            <span className="text-sm font-semibold" style={{ color: '#6b5040' }}>
              Numéro de commande
            </span>
            <span className="text-xl font-bold" style={{ color: '#7a5c2e' }}>
              #{order.numero}
            </span>
          </div>
          <div className="flex justify-between mb-3">
            <span className="text-sm font-semibold" style={{ color: '#6b5040' }}>
              Heure de retrait
            </span>
            <span className="font-semibold" style={{ color: '#2c1a0e' }}>
              {order.heureRetrait ?? '—'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-semibold" style={{ color: '#6b5040' }}>
              Total
            </span>
            <span className="font-bold" style={{ color: '#7a5c2e' }}>
              {formatPrix(order.total)}
            </span>
          </div>
        </div>

        <ul className="text-left mb-6 space-y-2">
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

        <p className="text-xs mb-6" style={{ color: '#9a7c4e' }}>
          Paiement : {order.modePaiement === 'cash' ? 'Espèces au retrait' : 'Carte au retrait'}
        </p>

        <div className="flex flex-col gap-3">
          <Link href={`/track?id=${order.id}`} className="w-full">
            <Button variant="outline" className="w-full">
              Suivre ma commande
            </Button>
          </Link>
          <Link href="/menu" className="w-full">
            <Button variant="ghost" className="w-full">
              Nouvelle commande
            </Button>
          </Link>
        </div>
        <InstallBanner />
      </div>

      <p className="mt-6 text-sm" style={{ color: '#9a7c4e' }}>
        Une question ? Appelez-nous au{' '}
        <a href="tel:+33780988177" className="font-semibold hover:underline" style={{ color: '#7a5c2e' }}>
          07 80 98 81 77
        </a>
      </p>
    </div>
  )
}
