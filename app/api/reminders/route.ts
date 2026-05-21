import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/auth/roles'
import type { Reminder } from '@/types'

const BUSINESS_ID = 'default-business'

// GET /api/reminders?date=YYYY-MM-DD — Lister les rappels (optionnellement filtrés par date)
export async function GET(req: Request) {
  try {
    await requireRole(['manager', 'employee'], BUSINESS_ID)

    const { searchParams } = new URL(req.url)
    const date = searchParams.get('date')

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    let query = supabase
      .from('reminders')
      .select('*')
      .eq('business_id', BUSINESS_ID)

    // Filtrer par date si fournie (rappels du jour)
    if (date) {
      const startOfDay = `${date}T00:00:00`
      const endOfDay = `${date}T23:59:59`
      query = query
        .gte('reminder_datetime', startOfDay)
        .lte('reminder_datetime', endOfDay)
    }

    const { data, error } = await query.order('reminder_datetime', { ascending: true })

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json(data || [])
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur serveur' },
      { status: 403 }
    )
  }
}

// POST /api/reminders — Créer un rappel manuel
export async function POST(req: Request) {
  try {
    await requireRole(['manager', 'employee'], BUSINESS_ID)

    const body = await req.json()
    const { title, note, reminder_datetime, recurrence } = body

    if (!title || !reminder_datetime) {
      return NextResponse.json(
        { error: 'title et reminder_datetime requis' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    const { data, error } = await supabase
      .from('reminders')
      .insert({
        business_id: BUSINESS_ID,
        user_id: user.id,
        title,
        note: note || null,
        reminder_datetime,
        recurrence: recurrence || 'none',
        type: 'manual',
        is_done: false,
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
