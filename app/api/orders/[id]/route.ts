import { NextResponse } from 'next/server'
import { isSupabaseConfigured, getDb } from '@/lib/supabase/db'
import type { Order, OrderStatus } from '@/types'

declare global {
  var __orders: Map<string, Order> | undefined
}
if (!global.__orders) global.__orders = new Map()

const VALID_STATUTS: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'cancelled']

function mapRow(row: Record<string, unknown>): Order {
  const items = row.items as Order['items']
  const client = (row.client as Order['client']) ?? { nom: '', telephone: '' }
  return {
    id:                    row.id as string,
    numero:                Number(row.numero),
    items,
    total:                 Number(row.total),
    client,
    statut:                row.statut as OrderStatus,
    modePaiement:          (row.mode_paiement ?? row.modePaiement ?? 'cash') as Order['modePaiement'],
    note:                  (row.note ?? undefined) as string | undefined,
    heureRetrait:          (row.heure_retrait ?? row.heureRetrait ?? undefined) as string | undefined,
    modeRetrait:           (row.mode_retrait ?? row.modeRetrait ?? undefined) as Order['modeRetrait'],
    stripePaymentIntentId: (row.stripe_pm_id ?? row.stripePaymentIntentId ?? undefined) as string | undefined,
    createdAt:             (row.created_at ?? row.createdAt ?? '') as string,
    updatedAt:             (row.updated_at ?? row.updatedAt ?? '') as string,
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (isSupabaseConfigured()) {
    const db = getDb()
    const { data, error } = await db.from('orders').select('*').eq('id', id).single()
    if (error) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
    return NextResponse.json(mapRow(data as Record<string, unknown>))
  }

  const order = global.__orders!.get(id)
  if (!order) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
  return NextResponse.json(order)
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json() as { statut: OrderStatus; note?: string }

  if (body.statut && !VALID_STATUTS.includes(body.statut)) {
    return NextResponse.json({ error: 'Statut invalide' }, { status: 400 })
  }

  if (isSupabaseConfigured()) {
    const db = getDb()
    const update: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (body.statut) update.statut = body.statut
    if (body.note !== undefined) update.note = body.note

    const { data, error } = await db
      .from('orders')
      .update(update)
      .eq('id', id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(mapRow(data as Record<string, unknown>))
  }

  const order = global.__orders!.get(id)
  if (!order) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
  const updated: Order = {
    ...order,
    ...(body.statut ? { statut: body.statut } : {}),
    ...(body.note !== undefined ? { note: body.note } : {}),
    updatedAt: new Date().toISOString(),
  }
  global.__orders!.set(id, updated)
  return NextResponse.json(updated)
}
