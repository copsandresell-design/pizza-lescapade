'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ManagerAuthStore {
  isManagerLoggedIn: boolean
  managerEmail: string | null
  _hydrated: boolean
  setHydrated: (v: boolean) => void
  login: (email: string, password: string) => Promise<{ error: string | null }>
  logout: () => Promise<void>
}

export const useManagerAuth = create<ManagerAuthStore>()(
  persist(
    (set) => ({
      isManagerLoggedIn: false,
      managerEmail: null,
      _hydrated: false,
      setHydrated: (v) => set({ _hydrated: v }),

      login: async (email, password) => {
        if (email === 'gerant@lescapade.fr' && password === 'gerant2024') {
          set({ isManagerLoggedIn: true, managerEmail: email })
          return { error: null }
        }
        return { error: 'Identifiants incorrects' }
      },

      logout: async () => {
        set({ isManagerLoggedIn: false, managerEmail: null })
      },
    }),
    {
      name: 'manager-auth',
      partialize: (s) => ({ isManagerLoggedIn: s.isManagerLoggedIn, managerEmail: s.managerEmail }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      },
    }
  )
)
