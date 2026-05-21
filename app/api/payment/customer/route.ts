import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { CARD_REQUIRED_THRESHOLD } from '@/types'
import type { CustomerLookupResult } from '@/types'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const telephone = searchParams.get('telephone')

  if (!telephone) {
    return NextResponse.json({ error: 'telephone requis' }, { status: 400 })
  }

  const db = createServiceClient()

  const { data: profile } = await db
    .from('customer_profiles')
    .select('id, stripe_customer_id')
    .eq('telephone', telephone)
    .single()

  if (!profile) {
    const result: CustomerLookupResult = {
      found: false,
      successfulOrders: 0,
      cardRequired: true,
    }
    return NextResponse.json(result)
  }

  const { data: stats } = await db
    .from('customer_order_stats')
    .select('successful_orders')
    .eq('customer_id', profile.id)
    .single()

  const successfulOrders = stats?.successful_orders ?? 0
  const cardRequired = successfulOrders < CARD_REQUIRED_THRESHOLD

  const { data: pm } = await db
    .from('customer_payment_methods')
    .select('stripe_pm_id, card_brand, card_last4')
    .eq('customer_id', profile.id)
    .eq('is_default', true)
    .single()

  const result: CustomerLookupResult = {
    found: true,
    customerId: profile.id,
    stripeCustomerId: profile.stripe_customer_id ?? undefined,
    successfulOrders,
    cardRequired,
    savedCard: pm ?? undefined,
  }

  return NextResponse.json(result)
}
