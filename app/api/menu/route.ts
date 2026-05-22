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

function applyInMemoryOverrides(items: Pizza[]): Pizza[] {
  if (!global.__menuOverrides) global.__menuOverrides = new Map()
  if (!global.__prixOverrides) global.__prixOverrides = new Map()
  return items.map((item) => ({
    ...item,
    disponible: global.__menuOverrides!.has(item.id)
      ? global.__menuOverrides!.get(item.id)!
      : item.disponible,
    prix: global.__prixOverrides!.has(item.id)
      ? global.__prixOverrides!.get(item.id)!
      : item.prix,
  }))
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const availableOnly = searchParams.get('available') === 'true'

  if (isSupabaseConfigured()) {
    const db = getDb()
    let query = db.from('pizzas').select('*').order('categorie').order('nom')
    if (availableOnly) query = query.eq('disponible', true)
    const { data, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json((data ?? []).map(mapRow))
  }

  let items = applyInMemoryOverrides(MENU_ITEMS)
  if (availableOnly) items = items.filter((i) => i.disponible)
  return NextResponse.json(items)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { id, slug, nom, desc, description, prix, categorie, disponible, image, populaire } = body

  if (!id || !nom || !prix || !categorie) {
    return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 })
  }

  const desc_ = description ?? desc ?? ''

  if (isSupabaseConfigured()) {
    const db = getDb()
    const { data, error } = await db
      .from('pizzas')
      .insert({
        id, slug: slug ?? id, nom, description: desc_, prix: Number(prix),
        categorie, disponible: disponible ?? true,
        image: image ?? null, populaire: populaire ?? false,
      })
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(mapRow(data as Record<string, unknown>), { status: 201 })
  }

  const pizza: Pizza = {
    id, slug: slug ?? id, nom, desc: desc_, prix: Number(prix),
    categorie, disponible: disponible ?? true,
    image: image ?? undefined, populaire: populaire ?? false,
  }
  return NextResponse.json(pizza, { status: 201 })
}
