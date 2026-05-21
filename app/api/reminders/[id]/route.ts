import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/auth/roles'

const BUSINESS_ID = 'default-business'

// PATCH /api/reminders/[id] — Modifier un rappel (marquer fait, etc.)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(['manager', 'employee'], BUSINESS_ID)

    const { id } = await params
    const body = await req.json()
    const { is_done, title, note, reminder_datetime, recurrence } = body

    const supabase = await createClient()
    const updateData: Record<string, unknown> = {}

    if (is_done !== undefined) updateData.is_done = is_done
    if (title) updateData.title = title
    if (note !== undefined) updateData.note = note
    if (reminder_datetime) updateData.reminder_datetime = reminder_datetime
    if (recurrence) updateData.recurrence = recurrence

    const { data, error } = await supabase
      .from('reminders')
      .update(updateData)
      .eq('id', id)
      .eq('business_id', BUSINESS_ID)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur serveur' },
      { status: 400 }
    )
  }
}

// DELETE /api/reminders/[id] — Supprimer un rappel
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(['manager', 'employee'], BUSINESS_ID)

    const { id } = await params
    const supabase = await createClient()
    const { error } = await supabase
      .from('reminders')
      .delete()
      .eq('id', id)
      .eq('business_id', BUSINESS_ID)

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur serveur' },
      { status: 400 }
    )
  }
}
