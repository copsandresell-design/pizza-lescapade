'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateId } from '@/lib/utils'
import type { CartItem, PizzaCustomization } from '@/types'

export type ModeRetrait = 'takeaway' | 'dine_in'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  modeRetrait: ModeRetrait | null

  addItem: (item: Omit<CartItem, 'lineId' | 'quantite'>, quantite?: number) => void
  updateItem: (lineId: string, prix: number, customization: PizzaCustomization) => void
  removeItem: (lineId: string) => void
  updateQuantite: (lineId: string, quantite: number) => void
  setModeRetrait: (mode: ModeRetrait | null) => void
  clear: () => void
  setOpen: (open: boolean) => void
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      modeRetrait: null,

      addItem: (item, quantite = 1) => {
        set((s) => ({
          items: [...s.items, { ...item, lineId: generateId(), quantite }],
          isOpen: true,
        }))
      },

      updateItem: (lineId, prix, customization) => {
        set((s) => ({
          items: s.items.map((i) =>
            i.lineId === lineId ? { ...i, prix, customization } : i
          ),
        }))
      },

      removeItem: (lineId) =>
        set((s) => ({ items: s.items.filter((i) => i.lineId !== lineId) })),

      updateQuantite: (lineId, quantite) => {
        if (quantite <= 0) {
          get().removeItem(lineId)
          return
        }
        set((s) => ({
          items: s.items.map((i) =>
            i.lineId === lineId ? { ...i, quantite } : i
          ),
        }))
      },

      setModeRetrait: (mode) => set({ modeRetrait: mode }),
      clear: () => set({ items: [], modeRetrait: null }),
      setOpen: (open) => set({ isOpen: open }),
    }),
    { name: 'pizza-cart' }
  )
)

// Selectors — computed outside the store to avoid Object.assign getter loss
export const selectTotal = (s: CartStore) =>
  s.items.reduce((sum, i) => sum + i.prix * i.quantite, 0)

export const selectCount = (s: CartStore) =>
  s.items.reduce((sum, i) => sum + i.quantite, 0)
