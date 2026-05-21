import { NextResponse } from 'next/server'
import { stripe, STRIPE_ENABLED } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/service'
import type Stripe from 'stripe'

export async function POST(req: Request) {
  if (!STRIPE_ENABLED || !stripe) {
    return NextResponse.json({ error: 'Stripe non configuré' }, { status: 503 })
  }

  const body = await req.text()
  const signature = req.headers.get('stripe-signature') ?? ''
  const secret = process.env.STRIPE_WEBHOOK_SECRET

  if (!secret) {
    return NextResponse.json({ error: 'Webhook secret manquant' }, { status: 500 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, secret)
  } catch {
    return NextResponse.json({ error: 'Signature invalide' }, { status: 400 })
  }

  if (event.type === 'setup_intent.succeeded') {
    // SetupIntent succeeded — card tokenisation confirmed, nothing extra to do here.
    // save-method route already persists the PM after client-side confirmation.
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as Stripe.PaymentIntent
    const stripeCustomerId = pi.customer as string | null

    if (stripeCustomerId) {
      await incrementSuccessfulOrders(stripeCustomerId)
    }
  }

  if (event.type === 'charge.succeeded') {
    const charge = event.data.object as Stripe.Charge
    const stripeCustomerId = charge.customer as string | null

    if (stripeCustomerId) {
      await incrementSuccessfulOrders(stripeCustomerId)
    }
  }

  return NextResponse.json({ received: true })
}

async function incrementSuccessfulOrders(stripeCustomerId: string) {
  const db = createServiceClient()

  const { data: profile } = await db
    .from('customer_profiles')
    .select('id')
    .eq('stripe_customer_id', stripeCustomerId)
    .single()

  if (!profile) return

  await db.rpc('increment_successful_orders', { p_customer_id: profile.id })
}

// Add this to Supabase as a SQL function:
// CREATE OR REPLACE FUNCTION increment_successful_orders(p_customer_id UUID)
// RETURNS void LANGUAGE plpgsql AS $$
// BEGIN
//   INSERT INTO customer_order_stats (customer_id, successful_orders, last_order_at)
//   VALUES (p_customer_id, 1, now())
//   ON CONFLICT (customer_id) DO UPDATE
//     SET successful_orders = customer_order_stats.successful_orders + 1,
//         last_order_at = now();
// END;
// $$;
