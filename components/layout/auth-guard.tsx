'use client'
import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'

// /admin has its own Supabase auth — exclude it from the test-password gate
const PUBLIC_PATHS = ['/login', '/admin']

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, _hasHydrated } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const isPublic = PUBLIC_PATHS.some((p) => pathname?.startsWith(p))

  useEffect(() => {
    if (!_hasHydrated) return
    if (!isAuthenticated && !isPublic) {
      router.replace('/login')
    }
  }, [isAuthenticated, isPublic, router, _hasHydrated])

  // Wait for localStorage hydration before making any auth decision
  if (!_hasHydrated) return null

  if (isAuthenticated || isPublic) return <>{children}</>

  return null
}
