import { NextResponse } from 'next/server'
import { SUPPLEMENTS, type Supplement } from '@/store/supplements'
import { isSupabaseConfigured, getDb } from '@/lib/supabase/db'

declare global {
  var __supplementOverrides: Map<string, Supplement> | undefined
  var __supplementDeleted: Set<string> | undefined
  var __supplementExtra: Supplement[] | undefined
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()
  const { name, price } = body

  if (isSupabaseConfigured()) {
    const db = getDb()
    const update: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (name !== undefined) update.name = name
    if (price !== undefined) update.price = price

    const { data, error } = await db
      .from('supplements')
      .update(update)
      .eq('id', id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  if (!global.__supplementOverrides) global.__supplementOverrides = new Map()
  if (!global.__supplementExtra) global.__supplementExtra = []

  const base = SUPPLEMENTS.find((s) => s.id === id)
  const extra = global.__supplementExtra.find((s) => s.id === id)
  const current = global.__supplementOverrides.get(id) ?? base ?? extra

  if (!current) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const updated: Supplement = {
    id: current.id,
    name: name !== undefined ? name : current.name,
    price: price !== undefined ? price : current.price,
  }

  if (extra) {
    global.__supplementExtra = global.__supplementExtra.map((s) => s.id === id ? updated : s)
  } else {
    global.__supplementOverrides.set(id, updated)
  }

  return NextResponse.json(updated)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (isSupabaseConfigured()) {
    const db = getDb()
    const { error } = await db.from('supplements').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  if (!global.__supplementDeleted) global.__supplementDeleted = new Set()
  if (!global.__supplementExtra) global.__supplementExtra = []
  global.__supplementDeleted.add(id)
  global.__supplementExtra = global.__supplementExtra.filter((s) => s.id !== id)
  return NextResponse.json({ success: true })
}
