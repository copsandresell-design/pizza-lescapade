'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createClient } from '@/lib/supabase/client'

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
        const supabase = createClient()
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) {
          return { error: error.message }
        }

        set({ isManagerLoggedIn: true, managerEmail: data.user?.email ?? email })
        return { error: null }
      },

      logout: async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
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
