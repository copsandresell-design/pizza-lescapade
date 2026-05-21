'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthStore {
  isAuthenticated: boolean
  _hasHydrated: boolean
  setHasHydrated: (v: boolean) => void
  login: (password: string) => boolean
  logout: () => void
}

export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      _hasHydrated: false,
      setHasHydrated: (v) => set({ _hasHydrated: v }),

      login: (password) => {
        const correct = process.env.NEXT_PUBLIC_TEST_PASSWORD ?? 'pizza2024'
        if (password === correct) {
          set({ isAuthenticated: true })
          return true
        }
        return false
      },

      logout: () => set({ isAuthenticated: false }),
    }),
    {
      name: 'pizza-auth',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
