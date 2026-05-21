import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/auth/roles'

const BUSINESS_ID = 'default-business'

export interface AlertItem {
  ingredient_id: string
  ingredient_name: string
  type: 'low_stock' | 'expiring_soon'
  current_quantity: number
  alert_threshold: number
  expiry_date?: string
  days_until_expiry?: number
}

// GET /api/ingredients/alerts?days_before=3 — Alertes (péremption + stock bas)
export async function GET(req: Request) {
  try {
    await requireRole(['manager', 'employee'], BUSINESS_ID)

    const { searchParams } = new URL(req.url)
    const daysBeforeExpiry = parseInt(searchParams.get('days_before') || '3', 10)

    const supabase = await createClient()

    // 1. Récupérer tous les ingrédients
    const { data: ingredients, error: ingError } = await supabase
      .from('ingredients')
      .select('*')
      .eq('business_id', BUSINESS_ID)

    if (ingError) return NextResponse.json({ error: ingError.message }, { status: 400 })

    const alerts: AlertItem[] = []

    // 2. Vérifier stock bas
    for (const ing of ingredients || []) {
      if (ing.current_quantity < ing.alert_threshold) {
        alerts.push({
          ingredient_id: ing.id,
          ingredient_name: ing.name,
          type: 'low_stock',
          current_quantity: ing.current_quantity,
          alert_threshold: ing.alert_threshold,
        })
      }
    }

    // 3. Vérifier péremption proche
    const today = new Date()
    const expiryThresholdDate = new Date(today.getTime() + daysBeforeExpiry * 24 * 60 * 60 * 1000)

    const { data: batches, error: batchError } = await supabase
      .from('ingredient_batches')
      .select('*')
      .lte('expiry_date', expiryThresholdDate.toISOString().split('T')[0])
      .gte('expiry_date', today.toISOString().split('T')[0])

    if (!batchError && batches) {
      for (const batch of batches) {
        const ing = ingredients?.find((i) => i.id === batch.ingredient_id)
        if (ing) {
          const expiryDate = new Date(batch.expiry_date)
          const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000))

          alerts.push({
            ingredient_id: ing.id,
            ingredient_name: ing.name,
            type: 'expiring_soon',
            current_quantity: batch.quantity,
            alert_threshold: 0,
            expiry_date: batch.expiry_date,
            days_until_expiry: daysUntilExpiry,
          })
        }
      }
    }

    return NextResponse.json(alerts)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur serveur' },
      { status: 400 }
    )
  }
}
