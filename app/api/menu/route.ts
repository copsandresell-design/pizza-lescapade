import { NextResponse } from 'next/server'
import { MENU_ITEMS } from '@/store/pizzas'
import type { Pizza } from '@/types'

declare global {
  // eslint-disable-next-line no-var
  var __menuOverrides: Map<string, boolean> | undefined
  // eslint-disable-next-line no-var
  var __prixOverrides: Map<string, number> | undefined
}
if (!global.__menuOverrides) global.__menuOverrides = new Map()
if (!global.__prixOverrides) global.__prixOverrides = new Map()

function applyOverrides(items: Pizza[]): Pizza[] {
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

  let items = applyOverrides(MENU_ITEMS)
  if (availableOnly) items = items.filter((i) => i.disponible)

  return NextResponse.json(items)
}
