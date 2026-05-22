import { NextResponse } from 'next/server'
import { SUPPLEMENTS, type Supplement } from '@/store/supplements'
import { isSupabaseConfigured, getDb } from '@/lib/supabase/db'

declare global {
  var __supplementOverrides: Map<string, Supplement> | undefined
  var __supplementDeleted: Set<string> | undefined
  var __supplementExtra: Supplement[] | undefined
}

function getInMemory(): Supplement[] {
  if (!global.__supplementOverrides) global.__supplementOverrides = new Map()
  if (!global.__supplementDeleted) global.__supplementDeleted = new Set()
  if (!global.__supplementExtra) global.__supplementExtra = []

  const base = SUPPLEMENTS
    .filter((s) => !global.__supplementDeleted!.has(s.id))
    .map((s) => global.__supplementOverrides!.get(s.id) ?? s)
  return [...base, ...global.__supplementExtra].sort((a, b) => a.name.localeCompare(b.name, 'fr'))
}

export async function GET() {
  if (isSupabaseConfigured()) {
    const db = getDb()
    const { data, error } = await db.from('supplements').select('*').order('name')
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data ?? [])
  }
  return NextResponse.json(getInMemory())
}

export async function POST(req: Request) {
  const body = await req.json()
  const { id, name, price } = body

  if (!name?.trim() || typeof price !== 'number' || price < 0) {
    return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
  }

  const genId = id ?? name.toLowerCase().replace(/\s+/g, '-').replace(/[éèê]/g, 'e').replace(/[àâ]/g, 'a').replace(/[ùû]/g, 'u').replace(/[^a-z0-9-]/g, '')

  if (isSupabaseConfigured()) {
    const db = getDb()
    const { data, error } = await db
      .from('supplements')
      .insert({ id: genId, name: name.trim(), price })
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data, { status: 201 })
  }

  if (!global.__supplementExtra) global.__supplementExtra = []
  const s: Supplement = { id: genId, name: name.trim(), price }
  global.__supplementExtra.push(s)
  return NextResponse.json(s, { status: 201 })
}
