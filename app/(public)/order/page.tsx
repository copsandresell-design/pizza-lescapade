'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Minus, Plus, Trash2, Banknote, CreditCard, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useCart, selectTotal } from '@/store/cart'
import { formatPrix, getCreneauxDisponibles } from '@/lib/utils'
import { customizationSummary } from '@/store/supplements'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { CardStep } from '@/components/order/CardStep'
import type { CustomerLookupResult } from '@/types'

const schema = z.object({
  nom: z.string().min(2, 'Entrez votre prénom'),
  telephone: z
    .string()
    .min(10, 'Numéro invalide')
    .regex(/^[0-9+\s-]{10,}$/, 'Numéro invalide'),
  heureRetrait: z.string().min(1, 'Choisissez une heure'),
  modePaiement: z.enum(['cash', 'card']),
  note: z.string().optional(),
})

type FormData = z.infer<typeof schema>
type Step = 'form' | 'card' | 'submitting'

export default function OrderPage() {
  const router = useRouter()
  const { items, updateQuantite, removeItem, clear } = useCart()
  const total = useCart(selectTotal)
  const [creneaux, setCreneaux] = useState<string[]>([])
  const [step, setStep] = useState<Step>('form')
  const [formData, setFormData] = useState<FormData | null>(null)
  const [customerInfo, setCustomerInfo] = useState<CustomerLookupResult | null>(null)

  useEffect(() => {
    setCreneaux(getCreneauxDisponibles())
  }, [])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { modePaiement: 'cash' },
  })

  const modePaiement = watch('modePaiement')

  const onFormSubmit = async (data: FormData) => {
    if (items.length === 0) {
      toast.error('Votre panier est vide')
      return
    }

    setFormData(data)

    // Lookup customer to determine if card is required
    try {
      const res = await globalThis.fetch(
        `/api/payment/customer?telephone=${encodeURIComponent(data.telephone)}`
      )
      const info: CustomerLookupResult = await res.json()
      setCustomerInfo(info)

      if (info.cardRequired) {
        setStep('card')
      } else {
        await submitOrder(data, null)
      }
    } catch {
      // If lookup fails, proceed without card
      setCustomerInfo({ found: false, successfulOrders: 0, cardRequired: false })
      await submitOrder(data, null)
    }
  }

  const submitOrder = async (data: FormData, pmId: string | null) => {
    setStep('submitting')
    try {
      const res = await globalThis.fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            pizzaId: i.pizzaId,
            nom: i.nom,
            prix: i.prix,
            quantite: i.quantite,
          })),
          client: { nom: data.nom, telephone: data.telephone },
          heureRetrait: data.heureRetrait,
          modePaiement: data.modePaiement,
          note: data.note,
          stripePmId: pmId,
        }),
      })

      if (!res.ok) throw new Error()

      const order = await res.json()
      clear()
      router.push(`/order/confirmation/${order.id}`)
    } catch {
      toast.error('Une erreur est survenue, veuillez réessayer')
      setStep('form')
    }
  }

  const handleCardSaved = async (pmId: string) => {
    if (formData) await submitOrder(formData, pmId)
  }

  const handleCardSkip = async () => {
    if (formData) await submitOrder(formData, null)
  }

  if (items.length === 0) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6 px-4"
        style={{ backgroundColor: '#fdf6ec' }}
      >
        <p className="text-lg" style={{ color: '#6b5040' }}>
          Votre panier est vide
        </p>
        <Link href="/menu">
          <Button>Voir la carte</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-10 px-4" style={{ backgroundColor: '#fdf6ec' }}>
      <div className="max-w-4xl mx-auto">
        <h1
          className="text-center mb-8"
          style={{
            fontFamily: 'var(--font-dancing), cursive',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            color: '#7a5c2e',
          }}
        >
          Votre commande
        </h1>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {(['form', 'card'] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              {i > 0 && <div className="w-8 h-px" style={{ backgroundColor: '#e8d5b0' }} />}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                style={{
                  backgroundColor: step === s || (step === 'submitting' && s === 'card')
                    ? '#7a5c2e'
                    : step === 'card' && s === 'form'
                    ? '#4a5c3a'
                    : '#e8d5b0',
                  color: step === s || (step === 'submitting' && s === 'card') || (step === 'card' && s === 'form')
                    ? '#fdf6ec'
                    : '#9a7c4e',
                }}
              >
                {i + 1}
              </div>
              <span className="text-xs hidden sm:inline" style={{ color: '#9a7c4e' }}>
                {s === 'form' ? 'Informations' : 'Carte bancaire'}
              </span>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Récapitulatif panier — always visible */}
          <div>
            <h2 className="font-semibold mb-4" style={{ color: '#2c1a0e' }}>
              Récapitulatif
            </h2>
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: '1px solid #e8d5b0', backgroundColor: '#fff8f0' }}
            >
              <ul className="divide-y" style={{ '--tw-divide-opacity': 1 } as React.CSSProperties}>
                {items.map((item) => {
                  const summary = item.customization
                    ? customizationSummary(
                        item.customization.size,
                        item.customization.removedIngredients,
                        item.customization.supplements
                      )
                    : null
                  return (
                    <li key={item.lineId} className="flex items-center gap-3 px-4 py-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm" style={{ color: '#2c1a0e' }}>
                          {item.nom}
                        </p>
                        {summary && (
                          <p className="text-xs mt-0.5 leading-snug" style={{ color: '#9a7c4e' }}>
                            {summary}
                          </p>
                        )}
                        <p className="text-xs mt-0.5" style={{ color: '#9a7c4e' }}>
                          {formatPrix(item.prix)} / unité
                        </p>
                      </div>
                      {step === 'form' && (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => updateQuantite(item.lineId, item.quantite - 1)}
                            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#e8d5b0]"
                            style={{ border: '1px solid #e8d5b0' }}
                          >
                            <Minus size={11} style={{ color: '#7a5c2e' }} />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold" style={{ color: '#2c1a0e' }}>
                            {item.quantite}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantite(item.lineId, item.quantite + 1)}
                            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#e8d5b0]"
                            style={{ border: '1px solid #e8d5b0' }}
                          >
                            <Plus size={11} style={{ color: '#7a5c2e' }} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem(item.lineId)}
                            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-50 ml-1"
                          >
                            <Trash2 size={11} className="text-red-400" />
                          </button>
                        </div>
                      )}
                      <span className="text-sm font-bold w-16 text-right" style={{ color: '#7a5c2e' }}>
                        {formatPrix(item.prix * item.quantite)}
                      </span>
                    </li>
                  )
                })}
              </ul>
              <div
                className="flex justify-between items-center px-4 py-3 font-bold"
                style={{ borderTop: '1px solid #e8d5b0', backgroundColor: '#f5e9d2' }}
              >
                <span style={{ color: '#2c1a0e' }}>Total</span>
                <span style={{ color: '#7a5c2e' }}>{formatPrix(total)}</span>
              </div>
            </div>
          </div>

          {/* Right panel — form or card step */}
          <div className="flex flex-col gap-5">
            {step === 'form' && (
              <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-5">
                <h2 className="font-semibold" style={{ color: '#2c1a0e' }}>
                  Vos informations
                </h2>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#6b5040' }}>
                    Prénom *
                  </label>
                  <Input placeholder="Ex : Marie" {...register('nom')} />
                  {errors.nom && (
                    <p className="text-red-500 text-xs mt-1">{errors.nom.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#6b5040' }}>
                    Téléphone *
                  </label>
                  <Input placeholder="06 00 00 00 00" {...register('telephone')} />
                  {errors.telephone && (
                    <p className="text-red-500 text-xs mt-1">{errors.telephone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#6b5040' }}>
                    Heure de retrait *
                  </label>
                  <div className="relative">
                    <select
                      {...register('heureRetrait')}
                      className="w-full rounded-xl border border-[#e8d5b0] bg-white px-4 py-2.5 text-sm text-[#2c1a0e] outline-none focus:border-[#7a5c2e] appearance-none pr-10"
                    >
                      <option value="">Choisir un horaire…</option>
                      {creneaux.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                      {creneaux.length === 0 && (
                        <option value="dès que possible">Dès que possible</option>
                      )}
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: '#9a7c4e' }}
                    />
                  </div>
                  {errors.heureRetrait && (
                    <p className="text-red-500 text-xs mt-1">{errors.heureRetrait.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#6b5040' }}>
                    Mode de paiement *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'cash', label: 'Espèces', icon: Banknote },
                      { value: 'card', label: 'Carte', icon: CreditCard },
                    ].map(({ value, label, icon: Icon }) => (
                      <label
                        key={value}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer transition-colors"
                        style={{
                          border: `2px solid ${modePaiement === value ? '#7a5c2e' : '#e8d5b0'}`,
                          backgroundColor: modePaiement === value ? '#f5e9d2' : '#fff8f0',
                        }}
                      >
                        <input
                          type="radio"
                          value={value}
                          {...register('modePaiement')}
                          className="sr-only"
                        />
                        <Icon size={18} style={{ color: '#7a5c2e' }} />
                        <span className="text-sm font-semibold" style={{ color: '#2c1a0e' }}>
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                  {modePaiement === 'card' && (
                    <p className="text-xs mt-2" style={{ color: '#9a7c4e' }}>
                      Paiement CB au retrait
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#6b5040' }}>
                    Note (optionnel)
                  </label>
                  <textarea
                    {...register('note')}
                    rows={2}
                    placeholder="Ingrédients à retirer, demande spéciale…"
                    className="w-full rounded-xl border border-[#e8d5b0] bg-white px-4 py-2.5 text-sm text-[#2c1a0e] placeholder:text-[#b8a080] outline-none focus:border-[#7a5c2e] resize-none"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full mt-2">
                  Suivant →
                </Button>
              </form>
            )}

            {step === 'card' && formData && customerInfo && (
              <>
                <h2 className="font-semibold" style={{ color: '#2c1a0e' }}>
                  Garantie de présence
                </h2>
                <CardStep
                  telephone={formData.telephone}
                  nom={formData.nom}
                  customer={customerInfo}
                  onCardSaved={handleCardSaved}
                  onSkip={handleCardSkip}
                  onBack={() => setStep('form')}
                />
              </>
            )}

            {step === 'submitting' && (
              <div className="flex flex-col items-center justify-center gap-4 py-12">
                <div
                  className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
                  style={{ borderColor: '#7a5c2e', borderTopColor: 'transparent' }}
                />
                <p className="text-sm font-medium" style={{ color: '#7a5c2e' }}>
                  Envoi en cours…
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
