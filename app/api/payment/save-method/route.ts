import { NextResponse } from 'next/server'
import { stripe, STRIPE_ENABLED } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/service'
import { getOrCreateCustomer } from '@/lib/stripe/customers'

export async function POST(req: Request) {
  if (!STRIPE_ENABLED || !stripe) {
    return NextResponse.json({ error: 'Stripe non configuré' }, { status: 503 })
  }

  const { telephone, nom, setupIntentId } = await req.json()

  if (!telephone || !nom || !setupIntentId) {
    return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })
  }

  const setupIntent = await stripe.setupIntents.retrieve(setupIntentId)

  if (setupIntent.status !== 'succeeded') {
    return NextResponse.json({ error: 'SetupIntent non confirmé' }, { status: 400 })
  }

  const pmId = setupIntent.payment_method as string
  const pm = await stripe.paymentMethods.retrieve(pmId)

  const { customerId } = await getOrCreateCustomer(telephone, nom)
  const db = createServiceClient()

  // Désactiver les cartes précédentes
  await db
    .from('customer_payment_methods')
    .update({ is_default: false })
    .eq('customer_id', customerId)

  const { error } = await db.from('customer_payment_methods').upsert({
    customer_id: customerId,
    stripe_pm_id: pmId,
    card_brand: pm.card?.brand ?? null,
    card_last4: pm.card?.last4 ?? null,
    is_default: true,
  }, { onConflict: 'stripe_pm_id' })

  if (error) {
    return NextResponse.json({ error: 'Erreur sauvegarde carte' }, { status: 500 })
  }

  return NextResponse.json({
    saved: true,
    card_brand: pm.card?.brand,
    card_last4: pm.card?.last4,
  })
}
