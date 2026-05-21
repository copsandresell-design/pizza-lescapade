import { NextResponse } from 'next/server'
import type { Order, OrderStatus } from '@/types'
import { generateId, generateNumero } from '@/lib/utils'

// In-memory store (remplacez par Supabase en production)
declare global {
  // eslint-disable-next-line no-var
  var __orders: Map<string, Order> | undefined
}
if (!global.__orders) global.__orders = new Map()
const orders = global.__orders

export async function GET() {
  const all = Array.from(orders.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  return NextResponse.json(all)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { items, client, heureRetrait, modePaiement, note, stripePmId } = body

  if (!items?.length || !client?.nom || !client?.telephone) {
    return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })
  }

  const total = items.reduce(
    (sum: number, i: { prix: number; quantite: number }) => sum + i.prix * i.quantite,
    0
  )

  const order: Order = {
    id: generateId(),
    numero: generateNumero(),
    items,
    total,
    client,
    statut: 'pending' as OrderStatus,
    modePaiement,
    note,
    heureRetrait,
    stripePaymentIntentId: stripePmId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  orders.set(order.id, order)

  // When Supabase is connected, also persist to the orders table:
  // const db = createServiceClient()
  // await db.from('orders').insert({ ...order, customer_id: customerId, stripe_pm_id: stripePmId })

  return NextResponse.json(order, { status: 201 })
}
