'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Plus, Settings2 } from 'lucide-react'
import { useCart } from '@/store/cart'
import { formatPrix } from '@/lib/utils'
import { PizzaCustomizationModal } from './PizzaCustomizationModal'
import { AllergenBadge } from './AllergenBadge'
import { getAllergensForItem } from '@/store/allergens'
import { PIZZA_DEFAULT_INGREDIENTS } from '@/store/supplements'
import type { Pizza, PizzaCustomization } from '@/types'

const CATEGORY_EMOJI: Record<string, string> = {
  incontournable: '⭐',
  salade:         '🥗',
  panuzzi:        '🥖',
  pizza:          '',
}

const CATEGORY_BADGE: Record<string, { bg: string; color: string }> = {
  incontournable: { bg: '#3d2a00', color: '#d4a843' },
  salade:         { bg: '#14532d', color: '#4ade80' },
  panuzzi:        { bg: '#1e3a5f', color: '#60a5fa' },
}

interface PizzaCardProps {
  pizza: Pizza
}

export function PizzaCard({ pizza }: PizzaCardProps) {
  const { addItem } = useCart()
  const [modalOpen, setModalOpen] = useState(false)

  const hasCustomization = pizza.categorie === 'pizza' || pizza.categorie === 'incontournable'

  const defaultIngredients = PIZZA_DEFAULT_INGREDIENTS[pizza.id] ?? []
  const allergenIds = getAllergensForItem(pizza, [], defaultIngredients)

  const handleAdd = (customization: PizzaCustomization, prix: number, quantite: number) => {
    addItem({ pizzaId: pizza.id, nom: pizza.nom, prix, customization }, quantite)
    setModalOpen(false)
  }

  const handleDirectAdd = () => {
    addItem({ pizzaId: pizza.id, nom: pizza.nom, prix: pizza.prix }, 1)
  }

  const badge = CATEGORY_BADGE[pizza.categorie]

  return (
    <>
      <div
        className="group relative flex flex-col rounded-2xl overflow-hidden transition-shadow hover:shadow-lg"
        style={{ backgroundColor: '#fff8f0', border: '1px solid #e8d5b0' }}
      >
        {/* Image */}
        <div className="relative h-44 overflow-hidden" style={{ backgroundColor: '#f5e9d2' }}>
          {pizza.image ? (
            <Image
              src={pizza.image}
              alt={pizza.nom}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-5xl">
              {CATEGORY_EMOJI[pizza.categorie] || '🍕'}
            </div>
          )}

          {/* Category badge */}
          {badge && (
            <span
              className="absolute top-2 left-2 rounded-full px-2 py-0.5 text-xs font-bold"
              style={{ backgroundColor: badge.bg, color: badge.color }}
            >
              {CATEGORY_EMOJI[pizza.categorie]}{' '}
              {pizza.categorie === 'incontournable' ? 'Incontournable' : pizza.categorie === 'salade' ? 'Salade' : 'Panuzzi'}
            </span>
          )}

          {pizza.populaire && (
            <span
              className="absolute top-2 right-2 rounded-full px-2 py-0.5 text-xs font-bold"
              style={{ backgroundColor: '#7a5c2e', color: '#fdf6ec' }}
            >
              ⭐ Populaire
            </span>
          )}

          {!pizza.disponible && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <span className="text-white font-semibold text-sm">Indisponible</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold leading-tight" style={{ color: '#2c1a0e' }}>
              {pizza.nom}
            </h3>
            <span className="font-bold text-sm shrink-0" style={{ color: '#7a5c2e' }}>
              {formatPrix(pizza.prix)}
            </span>
          </div>
          <p className="text-xs leading-relaxed flex-1 mb-2" style={{ color: '#8a6a4e' }}>
            {pizza.desc}
          </p>

          {/* Allergènes */}
          {allergenIds.length > 0 && (
            <div className="mb-3">
              <AllergenBadge allergenIds={allergenIds} size="sm" />
            </div>
          )}

          {hasCustomization ? (
            <button
              onClick={() => setModalOpen(true)}
              disabled={!pizza.disponible}
              className="flex items-center justify-center gap-2 rounded-full py-2 text-sm font-semibold transition-colors disabled:opacity-40"
              style={{ backgroundColor: '#7a5c2e', color: '#fdf6ec' }}
            >
              <Settings2 size={14} /> Personnaliser
            </button>
          ) : (
            <button
              onClick={handleDirectAdd}
              disabled={!pizza.disponible}
              className="flex items-center justify-center gap-2 rounded-full py-2 text-sm font-semibold transition-colors disabled:opacity-40"
              style={{ backgroundColor: '#7a5c2e', color: '#fdf6ec' }}
            >
              <Plus size={14} /> Ajouter
            </button>
          )}
        </div>
      </div>

      {modalOpen && hasCustomization && (
        <PizzaCustomizationModal
          pizza={pizza}
          onAdd={handleAdd}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  )
}
