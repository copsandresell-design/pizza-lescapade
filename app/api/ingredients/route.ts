import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/auth/roles'
import type { Ingredient } from '@/types'

const BUSINESS_ID = 'default-business'

// GET /api/ingredients — Lister les ingrédients
export async function GET() {
  try {
    await requireRole(['manager', 'employee'], BUSINESS_ID)

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .eq('business_id', BUSINESS_ID)
      .order('name', { ascending: true })

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json(data || [])
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur serveur' },
      { status: 403 }
    )
  }
}

// POST /api/ingredients — Créer un ingrédient
export async function POST(req: Request) {
  try {
    await requireRole(['manager', 'employee'], BUSINESS_ID)

    const body = await req.json()
    const { name, category, unit, purchase_price, alert_threshold, supplier_id } = body

    if (!name || !category || !unit || purchase_price === undefined) {
      return NextResponse.json(
        { error: 'name, category, unit, purchase_price requis' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('ingredients')
      .insert({
        business_id: BUSINESS_ID,
        name,
        category,
        unit,
        purchase_price: parseFloat(purchase_price),
        alert_threshold: parseFloat(alert_threshold || 0),
        current_quantity: 0,
        supplier_id: supplier_id || null,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur serveur' },
      { status: 400 }
    )
  }
}
