import { NextResponse } from 'next/server'
import { MENU_ITEMS } from '@/store/pizzas'
import { isSupabaseConfigured, getDb } from '@/lib/supabase/db'
import type { Pizza } from '@/types'

declare global {
  var __menuOverrides: Map<string, boolean> | undefined
  var __prixOverrides: Map<string, number> | undefined
}

function mapRow(row: Record<string, unknown>): Pizza {
  return {
    id:         row.id as string,
    slug:       row.slug as string,
    nom:        row.nom as string,
    desc:       (row.description ?? row.desc ?? '') as string,
    prix:       Number(row.prix),
    categorie:  row.categorie as Pizza['categorie'],
    disponible: Boolean(row.disponible),
    image:      (row.image ?? undefined) as string | undefined,
    populaire:  Boolean(row.populaire),
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()

  if (isSupabaseConfigured()) {
    const db = getDb()

    const update: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (typeof body.disponible === 'boolean') update.disponible = body.disponible
    if (typeof body.prix === 'number' && body.prix > 0) update.prix = body.prix
    if (typeof body.nom === 'string') update.nom = body.nom
    if (typeof body.description === 'string') update.description = body.description
    if (typeof body.desc === 'string') update.description = body.desc
    if (typeof body.categorie === 'string') update.categorie = body.categorie
    if (body.image !== undefined) update.image = body.image
    if (typeof body.populaire === 'boolean') update.populaire = body.populaire

    const { data, error } = await db
      .from('pizzas')
      .update(update)
      .eq('id', id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: error.code === 'PGRST116' ? 404 : 500 })
    return NextResponse.json(mapRow(data as Record<string, unknown>))
  }

  // In-memory fallback
  if (!global.__menuOverrides) global.__menuOverrides = new Map()
  if (!global.__prixOverrides) global.__prixOverrides = new Map()

  const item = MENU_ITEMS.find((p) => p.id === id)
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (typeof body.disponible === 'boolean') global.__menuOverrides.set(id, body.disponible)
  if (typeof body.prix === 'number' && body.prix > 0) global.__prixOverrides.set(id, body.prix)

  return NextResponse.json({
    ...item,
    disponible: global.__menuOverrides.get(id) ?? item.disponible,
    prix: global.__prixOverrides.get(id) ?? item.prix,
    ...(body.nom ? { nom: body.nom } : {}),
    ...(body.desc || body.description ? { desc: body.desc ?? body.description } : {}),
  })
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (isSupabaseConfigured()) {
    const db = getDb()
    const { error } = await db.from('pizzas').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ success: true })
}
