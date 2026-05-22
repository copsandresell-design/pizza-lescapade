'use client'
import { useState } from 'react'
import Image from 'next/image'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Minus, Plus, Trash2, ShoppingBag, Pencil } from 'lucide-react'
import Link from 'next/link'
import { useCart, selectTotal, selectCount } from '@/store/cart'
import { formatPrix } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { PizzaCustomizationModal } from '@/components/menu/PizzaCustomizationModal'
import { AllergenInline } from '@/components/menu/AllergenBadge'
import { customizationSummary, PIZZA_DEFAULT_INGREDIENTS } from '@/store/supplements'
import { getAllergensForItem } from '@/store/allergens'
import { PIZZAS } from '@/store/pizzas'
import type { CartItem, PizzaCustomization } from '@/types'

export function CartDrawer() {
  const { items, isOpen, setOpen, updateQuantite, removeItem, updateItem, modeRetrait, setModeRetrait } = useCart()
  const total = useCart(selectTotal)
  const count = useCart(selectCount)
  const [editing, setEditing] = useState<CartItem | null>(null)

  const handleSaveEdit = (customization: PizzaCustomization, prix: number) => {
    if (!editing) return
    updateItem(editing.lineId, prix, customization)
    setEditing(null)
  }

  const editingPizza = editing ? PIZZAS.find((p) => p.id === editing.pizzaId) : null

  return (
    <>
      <Dialog.Root open={isOpen} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content
            className="fixed right-0 top-0 z-50 h-full w-full max-w-sm flex flex-col shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-300"
            style={{ backgroundColor: '#fdf6ec' }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 border-b shrink-0"
              style={{ borderColor: '#e8d5b0' }}
            >
              <Dialog.Title
                className="text-xl"
                style={{ fontFamily: 'var(--font-dancing), cursive', color: '#7a5c2e' }}
              >
                Mon panier {count > 0 && `(${count})`}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="p-1.5 rounded-full hover:bg-[#e8d5b0] transition-colors">
                  <X size={18} style={{ color: '#7a5c2e' }} />
                </button>
              </Dialog.Close>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBag size={48} style={{ color: '#e8d5b0' }} />
                  <p style={{ color: '#9a7c4e' }}>Votre panier est vide</p>
                  <Dialog.Close asChild>
                    <Link href="/menu">
                      <Button size="md">Voir la carte</Button>
                    </Link>
                  </Dialog.Close>
                </div>
              ) : (
                <ul className="flex flex-col gap-3">
                  {items.map((item) => {
                    const summary = item.customization
                      ? customizationSummary(
                          item.customization.size,
                          item.customization.removedIngredients,
                          item.customization.supplements
                        )
                      : null
                    const pizza = PIZZAS.find((p) => p.id === item.pizzaId)
                    const allergenIds = pizza
                      ? getAllergensForItem(
                          pizza,
                          item.customization?.supplements ?? [],
                          PIZZA_DEFAULT_INGREDIENTS[pizza.id] ?? [],
                        )
                      : []
                    return (
                      <li
                        key={item.lineId}
                        className="rounded-xl p-3"
                        style={{ backgroundColor: '#fff8f0', border: '1px solid #e8d5b0' }}
                      >
                        <div className="flex items-start gap-3">
                          {pizza?.image && (
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 mt-0.5">
                              <Image src={pizza.image} alt={pizza.nom} fill className="object-cover" sizes="48px" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm" style={{ color: '#2c1a0e' }}>
                              {item.nom}
                            </p>
                            {summary && (
                              <p className="text-xs mt-0.5 leading-snug" style={{ color: '#9a7c4e' }}>
                                {summary}
                              </p>
                            )}
                            {allergenIds.length > 0 && (
                              <div className="mt-1">
                                <AllergenInline allergenIds={allergenIds} />
                              </div>
                            )}
                            <p className="text-sm font-bold mt-1" style={{ color: '#7a5c2e' }}>
                              {formatPrix(item.prix * item.quantite)}
                            </p>
                          </div>

                          {/* Edit button */}
                          <button
                            onClick={() => setEditing(item)}
                            className="p-1.5 rounded-full hover:bg-[#e8d5b0] transition-colors shrink-0"
                            aria-label="Modifier"
                          >
                            <Pencil size={13} style={{ color: '#9a7c4e' }} />
                          </button>
                        </div>

                        {/* Qty controls */}
                        <div className="flex items-center justify-end gap-1.5 mt-2">
                          <button
                            onClick={() => updateQuantite(item.lineId, item.quantite - 1)}
                            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#e8d5b0] transition-colors"
                            style={{ border: '1px solid #e8d5b0' }}
                          >
                            <Minus size={12} style={{ color: '#7a5c2e' }} />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold" style={{ color: '#2c1a0e' }}>
                            {item.quantite}
                          </span>
                          <button
                            onClick={() => updateQuantite(item.lineId, item.quantite + 1)}
                            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#e8d5b0] transition-colors"
                            style={{ border: '1px solid #e8d5b0' }}
                          >
                            <Plus size={12} style={{ color: '#7a5c2e' }} />
                          </button>
                          <button
                            onClick={() => removeItem(item.lineId)}
                            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-50 transition-colors ml-1"
                          >
                            <Trash2 size={12} className="text-red-400" />
                          </button>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div
                className="px-5 py-4 border-t flex flex-col gap-3 shrink-0"
                style={{ borderColor: '#e8d5b0' }}
              >
                {/* Mode retrait */}
                {modeRetrait ? (
                  <div className="flex items-center justify-between rounded-xl px-3 py-2" style={{ backgroundColor: '#f5e9d2', border: '1px solid #e8d5b0' }}>
                    <span className="text-sm font-semibold" style={{ color: '#7a5c2e' }}>
                      {modeRetrait === 'takeaway' ? '🛍️ À emporter' : '🪑 Sur place'}
                    </span>
                    <button
                      onClick={() => setModeRetrait(null)}
                      className="text-xs underline"
                      style={{ color: '#9a7c4e' }}
                    >
                      Changer
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-center" style={{ color: '#9a7c4e' }}>
                    Mode de retrait à choisir lors de la commande
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-semibold" style={{ color: '#2c1a0e' }}>Total</span>
                  <span className="text-lg font-bold" style={{ color: '#7a5c2e' }}>
                    {formatPrix(total)}
                  </span>
                </div>
                <Dialog.Close asChild>
                  <Link href="/order" className="w-full">
                    <Button size="lg" className="w-full">
                      Commander →
                    </Button>
                  </Link>
                </Dialog.Close>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Modal d'édition (hors du Dialog.Portal du panier) */}
      {editing && editingPizza && (
        <PizzaCustomizationModal
          pizza={editingPizza}
          initial={editing.customization}
          initialQuantite={editing.quantite}
          onAdd={(customization, prix) => handleSaveEdit(customization, prix)}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  )
}
