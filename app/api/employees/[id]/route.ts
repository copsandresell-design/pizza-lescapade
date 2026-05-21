import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/auth/roles'

const BUSINESS_ID = 'default-business'

// PATCH /api/employees/[id] — Modifier un employé (MANAGER ONLY)
// Body: { role?: string, active?: boolean }
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole('manager', BUSINESS_ID)

    const { id } = await params
    const body = await req.json()
    const { role, active } = body

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('user_roles')
      .update({
        ...(role && { role }),
        ...(active !== undefined && { active }),
      })
      .eq('id', id)
      .eq('business_id', BUSINESS_ID)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur serveur' },
      { status: 403 }
    )
  }
}

// DELETE /api/employees/[id] — Désactiver un employé (MANAGER ONLY)
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole('manager', BUSINESS_ID)

    const { id } = await params
    const supabase = await createClient()
    const { error } = await supabase
      .from('user_roles')
      .update({ active: false })
      .eq('id', id)
      .eq('business_id', BUSINESS_ID)

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur serveur' },
      { status: 403 }
    )
  }
}
