import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/auth/roles'

const BUSINESS_ID = 'default-business'

// GET /api/employees — Lister les employés (MANAGER ONLY)
export async function GET() {
  try {
    await requireRole('manager', BUSINESS_ID)

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('business_id', BUSINESS_ID)

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json(data || [])
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur serveur' },
      { status: 403 }
    )
  }
}

// POST /api/employees — Créer un employé (MANAGER ONLY)
// Body: { user_id: string, role: 'employee' | 'manager' }
export async function POST(req: Request) {
  try {
    await requireRole('manager', BUSINESS_ID)

    const body = await req.json()
    const { user_id, role } = body

    if (!user_id || !['employee', 'manager'].includes(role)) {
      return NextResponse.json(
        { error: 'user_id et role (employee|manager) requis' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('user_roles')
      .insert({
        user_id,
        role,
        business_id: BUSINESS_ID,
        active: true,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur serveur' },
      { status: 403 }
    )
  }
}

