import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/auth/roles'

const BUSINESS_ID = 'default-business'

// GET /api/ingredient-batches?ingredient_id=... — Lister les lots
export async function GET(req: Request) {
  try {
    await requireRole(['manager', 'employee'], BUSINESS_ID)

    const { searchParams } = new URL(req.url)
    const ingredientId = searchParams.get('ingredient_id')

    if (!ingredientId) {
      return NextResponse.json({ error: 'ingredient_id requis' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('ingredient_batches')
      .select('*')
      .eq('ingredient_id', ingredientId)
      .order('received_date', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json(data || [])
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur serveur' },
      { status: 403 }
    )
  }
}

// POST /api/ingredient-batches — Créer un lot
// Body: { ingredient_id, quantity, purchase_price, received_date, expiry_date }
export async function POST(req: Request) {
  try {
    await requireRole(['manager', 'employee'], BUSINESS_ID)

    const body = await req.json()
    const { ingredient_id, quantity, purchase_price, received_date, expiry_date } = body

    if (!ingredient_id || !quantity || !received_date || !expiry_date || purchase_price === undefined) {
      return NextResponse.json(
        { error: 'ingredient_id, quantity, purchase_price, received_date, expiry_date requis' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Créer le lot
    const { data, error } = await supabase
      .from('ingredient_batches')
      .insert({
        ingredient_id,
        quantity: parseFloat(quantity),
        purchase_price: parseFloat(purchase_price),
        received_date,
        expiry_date,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    // Mettre à jour la quantité actuelle de l'ingrédient
    const { data: ingredient, error: ingError } = await supabase
      .from('ingredients')
      .select('current_quantity')
      .eq('id', ingredient_id)
      .eq('business_id', BUSINESS_ID)
      .single()

    if (!ingError && ingredient) {
      const newQuantity = (ingredient.current_quantity || 0) + parseFloat(quantity)
      await supabase
        .from('ingredients')
        .update({ current_quantity: newQuantity })
        .eq('id', ingredient_id)
    }

    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur serveur' },
      { status: 400 }
    )
  }
}
