'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard, ClipboardList, Package, Pizza, BarChart2,
  LogOut, ArrowLeft, Menu, X,
} from 'lucide-react'
import { useManagerAuth } from '@/store/manager-auth'

const NAV = [
  { href: '/admin/dashboard',  label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/admin/orders',     label: 'Commandes',    icon: ClipboardList   },
  { href: '/admin/inventory',  label: 'Stock',        icon: Package         },
  { href: '/admin/pizzas',     label: 'Pizzas',       icon: Pizza           },
  { href: '/admin/stats',      label: 'Statistiques', icon: BarChart2       },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { managerEmail, logout } = useManagerAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 py-5 border-b" style={{ borderColor: '#3a2010' }}>
        <p
          style={{ fontFamily: 'var(--font-dancing), cursive', fontSize: '1.5rem', color: '#d4a843' }}
        >
          L'Escapade
        </p>
        <p className="text-xs mt-0.5" style={{ color: '#6b5040' }}>Espace Gérant</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/admin/dashboard' && pathname?.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
              style={
                active
                  ? { backgroundColor: '#3a2010', color: '#d4a843' }
                  : { color: '#9a7c4e' }
              }
            >
              <Icon size={17} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t flex flex-col gap-1" style={{ borderColor: '#3a2010' }}>
        {managerEmail && (
          <p className="px-3 py-1 text-xs truncate" style={{ color: '#6b5040' }}>
            {managerEmail}
          </p>
        )}
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
          style={{ color: '#6b5040' }}
        >
          <ArrowLeft size={17} />
          App client
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors text-left hover:bg-[#2c1a0e]"
          style={{ color: '#9a7c4e' }}
        >
          <LogOut size={17} />
          Déconnexion
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0f0803', color: '#fdf6ec' }}>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col w-56 shrink-0 sticky top-0 h-screen overflow-y-auto"
        style={{ backgroundColor: '#1a0e06', borderRight: '1px solid #3a2010' }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={`md:hidden fixed left-0 top-0 z-50 h-full w-56 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ backgroundColor: '#1a0e06', borderRight: '1px solid #3a2010' }}
      >
        <SidebarContent />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div
          className="md:hidden flex items-center gap-3 px-4 py-3 sticky top-0 z-30"
          style={{ backgroundColor: '#1a0e06', borderBottom: '1px solid #3a2010' }}
        >
          <button onClick={() => setSidebarOpen(true)} className="p-1">
            <Menu size={20} style={{ color: '#d4a843' }} />
          </button>
          <span
            style={{ fontFamily: 'var(--font-dancing), cursive', fontSize: '1.2rem', color: '#d4a843' }}
          >
            L'Escapade · Admin
          </span>
          {sidebarOpen && (
            <button onClick={() => setSidebarOpen(false)} className="ml-auto p-1">
              <X size={20} style={{ color: '#9a7c4e' }} />
            </button>
          )}
        </div>

        <main className="flex-1 p-5 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
