import { createClient } from '@/lib/supabase/server'
import type { UserRole } from '@/types'

export async function getUserRole(businessId: string = 'default-business'): Promise<UserRole | null> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .eq('business_id', businessId)
    .single()

  if (error || !data) return null
  return data.role as UserRole
}

export async function requireRole(requiredRole: UserRole | UserRole[], businessId: string = 'default-business'): Promise<void> {
  const userRole = await getUserRole(businessId)
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
  
  if (!userRole || !roles.includes(userRole)) {
    throw new Error('Accès refusé: rôle insuffisant')
  }
}

export async function isManager(businessId: string = 'default-business'): Promise<boolean> {
  const role = await getUserRole(businessId)
  return role === 'manager'
}

export async function isEmployee(businessId: string = 'default-business'): Promise<boolean> {
  const role = await getUserRole(businessId)
  return role === 'employee'
}
