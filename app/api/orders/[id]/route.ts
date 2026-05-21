import { NextResponse } from 'next/server'
import type { OrderStatus } from '@/types'

declare global {
  // eslint-disable-next-line no-var
  var __orders: Map<string, import('@/types').Order> | undefined
}
if (!global.__orders) global.__orders = new Map()
const orders = global.__orders

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const order = orders.get(id)
  if (!order) {
    return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
  }
  return NextResponse.json(order)
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const order = orders.get(id)
  if (!order) {
    return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
  }

  const { statut } = await req.json() as { statut: OrderStatus }
  const valid: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'cancelled']
  if (!valid.includes(statut)) {
    return NextResponse.json({ error: 'Statut invalide' }, { status: 400 })
  }

  const updated = { ...order, statut, updatedAt: new Date().toISOString() }
  orders.set(id, updated)
  return NextResponse.json(updated)
}
