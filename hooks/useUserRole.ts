import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { UserRole } from '@/types'

interface UseUserRoleResult {
  role: UserRole | null
  loading: boolean
  error: string | null
  isManager: boolean
  isEmployee: boolean
}

export function useUserRole(businessId?: string): UseUserRoleResult {
  const [role, setRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUserRole = useCallback(async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setRole(null)
        setError('Non authentifié')
        return
      }

      // Déterminer le business_id (pour l'instant, on utilise un ID fixe ou depuis les props)
      const bid = businessId || 'default-business'

      const { data, error: fetchError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('business_id', bid)
        .single()

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          // Pas de rôle trouvé
          setRole(null)
          setError('Aucun rôle assigné')
        } else {
          setError(fetchError.message)
        }
        return
      }

      setRole(data.role as UserRole)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }, [businessId])

  useEffect(() => {
    fetchUserRole()
  }, [fetchUserRole])

  return {
    role,
    loading,
    error,
    isManager: role === 'manager',
    isEmployee: role === 'employee',
  }
}
