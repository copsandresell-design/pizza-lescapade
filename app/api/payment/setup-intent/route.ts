import { NextResponse } from 'next/server'
import { stripe, STRIPE_ENABLED } from '@/lib/stripe'
import { getOrCreateCustomer } from '@/lib/stripe/customers'

export async function POST(req: Request) {
  if (!STRIPE_ENABLED || !stripe) {
    return NextResponse.json({ error: 'Stripe non configuré' }, { status: 503 })
  }

  const { telephone, nom } = await req.json()

  if (!telephone || !nom) {
    return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })
  }

  const { stripeCustomerId } = await getOrCreateCustomer(telephone, nom)

  if (!stripeCustomerId) {
    return NextResponse.json({ error: 'Customer Stripe introuvable' }, { status: 500 })
  }

  const setupIntent = await stripe.setupIntents.create({
    customer: stripeCustomerId,
    payment_method_types: ['card'],
    usage: 'off_session',
    metadata: { telephone },
  })

  return NextResponse.json({ clientSecret: setupIntent.client_secret })
}
