'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, LogOut } from 'lucide-react'
import { useManagerAuth } from '@/store/manager-auth'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { managerEmail, logout } = useManagerAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#1a0e06' }}>
      {/* Back-to-app top bar */}
      <div
        className="flex items-center justify-between px-4 py-2 shrink-0"
        style={{ backgroundColor: '#0f0803', borderBottom: '1px solid #2c1a0e' }}
      >
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:opacity-80"
          style={{ color: '#9a7c4e' }}
        >
          <ArrowLeft size={13} />
          Retour à l'app client
        </Link>

        <div className="flex items-center gap-3">
          {managerEmail && (
            <span className="text-xs hidden sm:inline" style={{ color: '#6b5040' }}>
              {managerEmail}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:opacity-80"
            style={{ color: '#9a7c4e' }}
          >
            <LogOut size={13} />
            Déconnexion
          </button>
        </div>
      </div>

      {children}
    </div>
  )
}
