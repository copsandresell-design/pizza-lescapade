'use client'
import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { CreditCard, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { CustomerLookupResult } from '@/types'

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null

interface CardStepProps {
  telephone: string
  nom: string
  customer: CustomerLookupResult
  onCardSaved: (stripePmId: string) => void
  onSkip: () => void
  onBack: () => void
}

export function CardStep(props: CardStepProps) {
  if (!stripePromise) {
    return <CardStepStripeDisabled {...props} />
  }

  return (
    <Elements stripe={stripePromise} options={{ locale: 'fr' }}>
      <CardStepInner {...props} />
    </Elements>
  )
}

function CardStepStripeDisabled({ onSkip, onBack }: Pick<CardStepProps, 'onSkip' | 'onBack'>) {
  return (
    <div className="flex flex-col gap-6 py-4">
      <div
        className="rounded-2xl p-4 flex items-start gap-3"
        style={{ backgroundColor: '#fff8f0', border: '1px solid #e8d5b0' }}
      >
        <AlertCircle size={18} style={{ color: '#9a7c4e' }} className="mt-0.5 shrink-0" />
        <p className="text-sm" style={{ color: '#6b5040' }}>
          Le paiement par carte n'est pas encore configuré. Vous pouvez continuer sans enregistrer de carte.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
          style={{ border: '1px solid #e8d5b0', color: '#6b5040' }}
        >
          Retour
        </button>
        <Button onClick={onSkip} size="lg" className="flex-1">
          Continuer sans carte
        </Button>
      </div>
    </div>
  )
}

function CardStepInner({ telephone, nom, customer, onCardSaved, onSkip, onBack }: CardStepProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [useExisting, setUseExisting] = useState(!!customer.savedCard)

  useEffect(() => {
    if (useExisting) return
    globalThis.fetch('/api/payment/setup-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telephone, nom }),
    })
      .then((r) => r.json())
      .then((d) => setClientSecret(d.clientSecret ?? null))
      .catch(() => setError('Impossible de préparer le formulaire de carte'))
  }, [telephone, nom, useExisting])

  const handleConfirm = async () => {
    if (!stripe || !elements || !clientSecret) return
    setLoading(true)
    setError(null)

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) return

    const { setupIntent, error: stripeError } = await stripe.confirmCardSetup(clientSecret, {
      payment_method: { card: cardElement },
    })

    if (stripeError) {
      setError(stripeError.message ?? 'Erreur carte')
      setLoading(false)
      return
    }

    const pmId = setupIntent?.payment_method as string
    const res = await globalThis.fetch('/api/payment/save-method', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telephone, nom, setupIntentId: setupIntent?.id }),
    })

    if (!res.ok) {
      setError('Erreur lors de la sauvegarde de la carte')
      setLoading(false)
      return
    }

    setLoading(false)
    onCardSaved(pmId)
  }

  const handleUseExisting = () => {
    if (customer.savedCard) {
      onCardSaved(customer.savedCard.stripe_pm_id)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-semibold mb-1" style={{ color: '#2c1a0e' }}>
          Empreinte bancaire
        </h2>
        <p className="text-xs leading-relaxed" style={{ color: '#9a7c4e' }}>
          Une empreinte de carte est requise pour les {customer.successfulOrders === 0 ? 'premières' : ''} commandes.
          Aucun débit ne sera effectué — le paiement reste en caisse au retrait.
        </p>
      </div>

      {/* Carte existante */}
      {customer.savedCard && (
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer transition-colors"
            style={{
              border: `2px solid ${useExisting ? '#7a5c2e' : '#e8d5b0'}`,
              backgroundColor: useExisting ? '#f5e9d2' : '#fff8f0',
            }}
            onClick={() => setUseExisting(true)}
          >
            <input type="radio" checked={useExisting} onChange={() => setUseExisting(true)} className="sr-only" />
            <CheckCircle2 size={16} style={{ color: useExisting ? '#7a5c2e' : '#b8a080' }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: '#2c1a0e' }}>
                {customer.savedCard.card_brand?.toUpperCase()} •••• {customer.savedCard.card_last4}
              </p>
              <p className="text-xs" style={{ color: '#9a7c4e' }}>Carte enregistrée</p>
            </div>
          </label>

          <label className="flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer transition-colors"
            style={{
              border: `2px solid ${!useExisting ? '#7a5c2e' : '#e8d5b0'}`,
              backgroundColor: !useExisting ? '#f5e9d2' : '#fff8f0',
            }}
            onClick={() => setUseExisting(false)}
          >
            <input type="radio" checked={!useExisting} onChange={() => setUseExisting(false)} className="sr-only" />
            <CreditCard size={16} style={{ color: !useExisting ? '#7a5c2e' : '#b8a080' }} />
            <span className="text-sm font-semibold" style={{ color: '#2c1a0e' }}>Utiliser une nouvelle carte</span>
          </label>
        </div>
      )}

      {/* Champ carte Stripe */}
      {!useExisting && (
        <div
          className="rounded-xl px-4 py-3"
          style={{ border: '1px solid #e8d5b0', backgroundColor: '#fff8f0' }}
        >
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '14px',
                  color: '#2c1a0e',
                  fontFamily: 'system-ui, sans-serif',
                  '::placeholder': { color: '#b8a080' },
                },
                invalid: { color: '#dc2626' },
              },
            }}
          />
        </div>
      )}

      {error && (
        <p className="text-red-500 text-xs flex items-center gap-1">
          <AlertCircle size={12} /> {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-3 mt-1">
        <button
          onClick={onBack}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors hover:bg-[#e8d5b0]"
          style={{ border: '1px solid #e8d5b0', color: '#6b5040' }}
        >
          Retour
        </button>

        {useExisting ? (
          <Button onClick={handleUseExisting} size="lg" className="flex-1">
            Confirmer
          </Button>
        ) : (
          <Button
            onClick={handleConfirm}
            size="lg"
            className="flex-1"
            disabled={loading || !clientSecret}
          >
            {loading ? 'Vérification…' : 'Enregistrer la carte'}
          </Button>
        )}
      </div>

      {/* Skip — only when card is optional */}
      {!customer.cardRequired && (
        <button
          onClick={onSkip}
          className="text-xs text-center underline"
          style={{ color: '#9a7c4e' }}
        >
          Passer cette étape
        </button>
      )}
    </div>
  )
}
