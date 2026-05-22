import { NextResponse } from 'next/server'
import { MENU_ITEMS } from '@/store/pizzas'

declare global {
  var __menuOverrides: Map<string, boolean> | undefined
  var __prixOverrides: Map<string, number> | undefined
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const item = MENU_ITEMS.find((p) => p.id === id)
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()

  if (!global.__menuOverrides) global.__menuOverrides = new Map()
  if (!global.__prixOverrides) global.__prixOverrides = new Map()

  if (typeof body.disponible === 'boolean') {
    global.__menuOverrides.set(id, body.disponible)
  }

  if (typeof body.prix === 'number' && body.prix > 0) {
    global.__prixOverrides.set(id, body.prix)
  }

  const updated = {
    ...item,
    disponible: global.__menuOverrides.get(id) ?? item.disponible,
    prix: global.__prixOverrides.get(id) ?? item.prix,
  }

  return NextResponse.json(updated)
}
