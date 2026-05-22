import { NextResponse } from 'next/server'
import { isSupabaseConfigured, getDb } from '@/lib/supabase/db'
import { generateId, generateNumero } from '@/lib/utils'
import type { Order, OrderStatus } from '@/types'

declare global {
  // eslint-disable-next-line no-var
  var __orders: Map<string, Order> | undefined
}
if (!global.__orders) global.__orders = new Map()

function mapRow(row: Record<string, unknown>): Order {
  return {
    id:                    row.id as string,
    numero:                Number(row.numero),
    items:                 row.items as Order['items'],
    total:                 Number(row.total),
    client:                (row.client as Order['client']) ?? { nom: '', telephone: '' },
    statut:                row.statut as OrderStatus,
    modePaiement:          (row.mode_paiement ?? row.modePaiement ?? 'cash') as Order['modePaiement'],
    note:                  (row.note ?? undefined) as string | undefined,
    heureRetrait:          (row.heure_retrait ?? row.heureRetrait ?? undefined) as string | undefined,
    modeRetrait:           (row.mode_retrait ?? row.modeRetrait ?? undefined) as Order['modeRetrait'],
    stripePaymentIntentId: (row.stripe_pm_id ?? undefined) as string | undefined,
    createdAt:             (row.created_at ?? row.createdAt ?? '') as string,
    updatedAt:             (row.updated_at ?? row.updatedAt ?? '') as string,
  }
}

export async function GET() {
  if (isSupabaseConfigured()) {
    const db = getDb()
    const { data, error } = await db
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json((data ?? []).map((r) => mapRow(r as Record<string, unknown>)))
  }

  const all = Array.from(global.__orders!.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  return NextResponse.json(all)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { items, client, heureRetrait, modeRetrait, modePaiement, note, stripePmId } = body

  if (!items?.length || !client?.nom || !client?.telephone) {
    return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })
  }

  const total: number = items.reduce(
    (sum: number, i: { prix: number; quantite: number }) => sum + i.prix * i.quantite,
    0
  )

  if (isSupabaseConfigured()) {
    const db = getDb()

    // Upsert customer profile
    let customerId: string | null = null
    const { data: cp } = await db
      .from('customer_profiles')
      .upsert({ telephone: client.telephone, nom: client.nom }, { onConflict: 'telephone' })
      .select('id')
      .single()
    if (cp) customerId = (cp as { id: string }).id

    const { data, error } = await db
      .from('orders')
      .insert({
        customer_id:   customerId,
        client,
        items,
        total,
        statut:        'pending',
        mode_paiement: modePaiement ?? 'cash',
        heure_retrait: heureRetrait ?? null,
        mode_retrait:  modeRetrait ?? null,
        note:          note ?? null,
        stripe_pm_id:  stripePmId ?? null,
        card_required: false,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(mapRow(data as Record<string, unknown>), { status: 201 })
  }

  const order: Order = {
    id: generateId(),
    numero: generateNumero(),
    items,
    total,
    client,
    statut: 'pending' as OrderStatus,
    modePaiement: modePaiement ?? 'cash',
    note,
    heureRetrait,
    modeRetrait,
    stripePaymentIntentId: stripePmId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  global.__orders!.set(order.id, order)
  return NextResponse.json(order, { status: 201 })
}
