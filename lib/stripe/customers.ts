import { stripe, STRIPE_ENABLED } from './index'
import { createServiceClient } from '@/lib/supabase/service'

/**
 * Returns { customerId, stripeCustomerId } for a given telephone.
 * Creates both the Supabase customer_profile and the Stripe Customer if they don't exist.
 */
export async function getOrCreateCustomer(telephone: string, nom: string) {
  const db = createServiceClient()

  const { data: existing } = await db
    .from('customer_profiles')
    .select('id, stripe_customer_id')
    .eq('telephone', telephone)
    .single()

  if (existing) {
    return { customerId: existing.id, stripeCustomerId: existing.stripe_customer_id as string | null }
  }

  let stripeCustomerId: string | null = null

  if (STRIPE_ENABLED && stripe) {
    const stripeCustomer = await stripe.customers.create({
      phone: telephone,
      name: nom,
      metadata: { source: 'pizza-lescapade' },
    })
    stripeCustomerId = stripeCustomer.id
  }

  const { data: created, error } = await db
    .from('customer_profiles')
    .insert({ telephone, nom, stripe_customer_id: stripeCustomerId })
    .select('id, stripe_customer_id')
    .single()

  if (error || !created) throw new Error('Failed to create customer profile')

  // Initialise stats row
  await db
    .from('customer_order_stats')
    .insert({ customer_id: created.id, successful_orders: 0 })

  return { customerId: created.id as string, stripeCustomerId: created.stripe_customer_id as string | null }
}
