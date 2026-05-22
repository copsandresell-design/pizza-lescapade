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
        // Fallback test-mode : si Supabase n'est pas configuré, on vérifie un mot de passe local
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const managerTestPwd = process.env.NEXT_PUBLIC_MANAGER_PASSWORD ?? 'gerant2024'

        if (!supabaseUrl || supabaseUrl.includes('xxxx')) {
          if (password === managerTestPwd) {
            set({ isManagerLoggedIn: true, managerEmail: email || 'gerant@lescapade.fr' })
            return { error: null }
          }
          return { error: 'Mot de passe incorrect' }
        }

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
