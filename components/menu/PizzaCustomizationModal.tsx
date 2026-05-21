'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Minus, Plus, Check } from 'lucide-react'
import {
  PIZZA_SIZES,
  DEFAULT_SIZE,
  SUPPLEMENTS,
  PIZZA_DEFAULT_INGREDIENTS,
  computePrice,
} from '@/store/supplements'
import { formatPrix } from '@/lib/utils'
import type { Pizza } from '@/types'
import type { PizzaSize, PizzaCustomization } from '@/types'

interface Props {
  pizza: Pizza
  initial?: PizzaCustomization
  initialQuantite?: number
  onAdd: (customization: PizzaCustomization, prix: number, quantite: number) => void
  onClose: () => void
}

export function PizzaCustomizationModal({ pizza, initial, initialQuantite = 1, onAdd, onClose }: Props) {
  const defaultIngredients = PIZZA_DEFAULT_INGREDIENTS[pizza.id] ?? []

  const [size, setSize] = useState<PizzaSize>(initial?.size ?? DEFAULT_SIZE)
  const [removed, setRemoved] = useState<string[]>(initial?.removedIngredients ?? [])
  const [supplements, setSupplements] = useState<string[]>(initial?.supplements ?? [])
  const [quantite, setQuantite] = useState(initialQuantite)
  const [prix, setPrix] = useState(pizza.prix)

  useEffect(() => {
    setPrix(computePrice(pizza.prix, size, supplements))
  }, [pizza.prix, size, supplements])

  const toggleIngredient = useCallback((name: string) => {
    setRemoved((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    )
  }, [])

  const toggleSupplement = useCallback((id: string) => {
    setSupplements((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }, [])

  const handleAdd = () => {
    onAdd({ size, removedIngredients: removed, supplements }, prix, quantite)
  }

  const sizeSizes = Object.entries(PIZZA_SIZES) as [PizzaSize, { label: string; surcoût: number }][]

  return (
    <Dialog.Root open onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-3xl focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom duration-300 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl sm:w-full sm:max-w-lg"
          style={{ backgroundColor: '#fdf6ec', maxHeight: '92dvh' }}
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">Personnaliser {pizza.nom}</Dialog.Title>

          {/* Handle mobile */}
          <div className="sm:hidden w-10 h-1 rounded-full mx-auto mt-3 mb-0 shrink-0" style={{ backgroundColor: '#e8d5b0' }} />

          {/* Scrollable body */}
          <div className="overflow-y-auto flex-1">

            {/* Photo + close */}
            <div className="relative" style={{ height: '220px' }}>
              {pizza.image ? (
                <Image
                  src={pizza.image}
                  alt={pizza.nom}
                  fill
                  className="object-cover rounded-t-3xl"
                  sizes="(max-width: 640px) 100vw, 512px"
                  priority
                />
              ) : (
                <div
                  className="h-full flex items-center justify-center rounded-t-3xl text-6xl"
                  style={{ backgroundColor: '#f5e9d2' }}
                >
                  🍕
                </div>
              )}
              <div className="absolute inset-0 rounded-t-3xl" style={{ background: 'linear-gradient(to top, rgba(253,246,236,0.95) 0%, transparent 55%)' }} />
              <Dialog.Close asChild>
                <button
                  className="absolute top-3 right-3 p-1.5 rounded-full"
                  style={{ backgroundColor: 'rgba(0,0,0,0.45)', color: '#fff' }}
                  aria-label="Fermer"
                >
                  <X size={16} />
                </button>
              </Dialog.Close>
            </div>

            <div className="px-5 pb-2">
              {/* Nom + prix de base */}
              <div className="flex items-baseline justify-between mb-1">
                <h2
                  style={{ fontFamily: 'var(--font-dancing), cursive', fontSize: '1.8rem', color: '#2c1a0e' }}
                >
                  {pizza.nom}
                </h2>
                <span className="text-sm font-semibold" style={{ color: '#9a7c4e' }}>
                  à partir de {formatPrix(pizza.prix)}
                </span>
              </div>
              <p className="text-xs leading-relaxed mb-5" style={{ color: '#8a6a4e' }}>
                {pizza.desc}
              </p>

              {/* Taille */}
              <section className="mb-5">
                <h3 className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#7a5c2e' }}>
                  Taille
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {sizeSizes.map(([key, { label, surcoût }]) => (
                    <button
                      key={key}
                      onClick={() => setSize(key)}
                      className="rounded-xl py-2.5 px-3 text-center transition-colors"
                      style={{
                        border: `2px solid ${size === key ? '#7a5c2e' : '#e8d5b0'}`,
                        backgroundColor: size === key ? '#f5e9d2' : '#fff8f0',
                      }}
                    >
                      <span className="block font-semibold text-sm" style={{ color: '#2c1a0e' }}>
                        {label}
                      </span>
                      <span className="text-xs" style={{ color: '#9a7c4e' }}>
                        {surcoût === 0 ? 'inclus' : `+${formatPrix(surcoût)}`}
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Ingrédients par défaut */}
              {defaultIngredients.length > 0 && (
                <section className="mb-5">
                  <h3 className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: '#7a5c2e' }}>
                    Ingrédients
                  </h3>
                  <p className="text-xs mb-3" style={{ color: '#9a7c4e' }}>
                    Décochez les ingrédients à retirer
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {defaultIngredients.map((name) => {
                      const active = !removed.includes(name)
                      return (
                        <button
                          key={name}
                          onClick={() => toggleIngredient(name)}
                          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"
                          style={{
                            border: `1.5px solid ${active ? '#7a5c2e' : '#e8d5b0'}`,
                            backgroundColor: active ? '#f5e9d2' : '#fff8f0',
                            color: active ? '#2c1a0e' : '#b8a080',
                            textDecoration: active ? 'none' : 'line-through',
                          }}
                        >
                          {active && <Check size={11} style={{ color: '#7a5c2e' }} />}
                          {name}
                        </button>
                      )
                    })}
                  </div>
                </section>
              )}

              {/* Suppléments */}
              <section className="mb-6">
                <h3 className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#7a5c2e' }}>
                  Suppléments
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {SUPPLEMENTS.map((supp) => {
                    const active = supplements.includes(supp.id)
                    return (
                      <button
                        key={supp.id}
                        onClick={() => toggleSupplement(supp.id)}
                        className="flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left transition-colors"
                        style={{
                          border: `1.5px solid ${active ? '#7a5c2e' : '#e8d5b0'}`,
                          backgroundColor: active ? '#f5e9d2' : '#fff8f0',
                        }}
                      >
                        <span className="text-xs font-semibold leading-tight" style={{ color: '#2c1a0e' }}>
                          {supp.name}
                        </span>
                        <span
                          className="text-xs font-bold shrink-0"
                          style={{ color: active ? '#7a5c2e' : '#9a7c4e' }}
                        >
                          +{formatPrix(supp.price)}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </section>
            </div>
          </div>

          {/* Footer sticky */}
          <div
            className="px-5 py-4 shrink-0"
            style={{ borderTop: '1px solid #e8d5b0', backgroundColor: '#fdf6ec' }}
          >
            <div className="flex items-center gap-3">
              {/* Quantité */}
              <div
                className="flex items-center gap-2 rounded-full px-2 py-1"
                style={{ border: '1.5px solid #e8d5b0', backgroundColor: '#fff8f0' }}
              >
                <button
                  onClick={() => setQuantite((q) => Math.max(1, q - 1))}
                  className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#e8d5b0] transition-colors"
                  aria-label="Moins"
                >
                  <Minus size={13} style={{ color: '#7a5c2e' }} />
                </button>
                <span className="w-5 text-center text-sm font-bold" style={{ color: '#2c1a0e' }}>
                  {quantite}
                </span>
                <button
                  onClick={() => setQuantite((q) => q + 1)}
                  className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#e8d5b0] transition-colors"
                  aria-label="Plus"
                >
                  <Plus size={13} style={{ color: '#7a5c2e' }} />
                </button>
              </div>

              {/* Bouton ajouter */}
              <button
                onClick={handleAdd}
                className="flex-1 flex items-center justify-between rounded-full px-5 py-3 font-semibold text-sm transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#7a5c2e', color: '#fdf6ec' }}
              >
                <span>Ajouter au panier</span>
                <span className="font-bold">{formatPrix(prix * quantite)}</span>
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
