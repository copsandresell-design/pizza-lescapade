'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { ShoppingCart, UtensilsCrossed, Menu, X, LogOut, Settings } from 'lucide-react'
import { useState } from 'react'
import { useCart, selectCount } from '@/store/cart'
import { useAuth } from '@/store/auth'
import { useManagerAuth } from '@/store/manager-auth'
import { ManagerLoginModal } from '@/components/layout/manager-login-modal'
import { cn } from '@/lib/utils'
import { InstallButton } from '@/components/pwa/install-button'

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { setOpen } = useCart()
  const count = useCart(selectCount)
  const { logout } = useAuth()
  const { isManagerLoggedIn, logout: managerLogout } = useManagerAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [managerModalOpen, setManagerModalOpen] = useState(false)

  const isAdmin = pathname?.startsWith('/admin')
  if (isAdmin) return null

  const links = [
    { href: '/', label: 'Accueil' },
    { href: '/menu', label: 'La carte' },
    { href: '/galerie', label: 'Galerie' },
    { href: '/track', label: 'Suivre ma commande' },
  ]

  const handleManagerLogout = async () => {
    await managerLogout()
    router.push('/')
  }

  return (
    <>
      <header
        className="sticky top-0 z-50 shadow-sm"
        style={{ backgroundColor: '#fdf6ec', borderBottom: '1px solid #e8d5b0' }}
      >
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/pizza-lescapade-medias/identite/logo-rond-lescapade.jpg"
              alt="Pizza L'Escapade"
              width={40}
              height={40}
              className="rounded-full object-cover"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-[#7a5c2e]',
                  pathname === l.href ? 'text-[#7a5c2e]' : 'text-[#6b5040]'
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Commander CTA */}
            <Link
              href="/menu"
              className="hidden md:flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors mr-1"
              style={{ backgroundColor: '#7a5c2e', color: '#fdf6ec' }}
            >
              <UtensilsCrossed size={14} /> Commander
            </Link>

            <InstallButton variant="nav" />

            {/* Espace Gérant / Déconnexion gérant */}
            {isManagerLoggedIn ? (
              <button
                onClick={handleManagerLogout}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-[#e8d5b0]"
                style={{ border: '1px solid #e8d5b0', color: '#7a5c2e' }}
                title="Quitter l'espace gérant"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Gérant</span>
              </button>
            ) : (
              <button
                onClick={() => setManagerModalOpen(true)}
                className="p-2 rounded-full transition-colors hover:bg-[#e8d5b0]"
                aria-label="Espace Gérant"
                title="Espace Gérant"
              >
                <Settings size={17} style={{ color: '#9a7c4e' }} />
              </button>
            )}

            {/* Test-mode logout */}
            <button
              onClick={logout}
              className="p-2 rounded-full transition-colors hover:bg-[#e8d5b0]"
              aria-label="Déconnexion"
              title="Déconnexion (mode test)"
            >
              <LogOut size={17} style={{ color: '#b8a080' }} />
            </button>

            {/* Cart */}
            <button
              onClick={() => setOpen(true)}
              className="relative p-2 rounded-full transition-colors hover:bg-[#e8d5b0]"
              aria-label="Ouvrir le panier"
            >
              <ShoppingCart size={20} style={{ color: '#7a5c2e' }} />
              {count > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center"
                  style={{ backgroundColor: '#7a5c2e', color: '#fdf6ec' }}
                >
                  {count}
                </span>
              )}
            </button>

            {/* Mobile burger */}
            <button
              className="md:hidden p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? (
                <X size={20} style={{ color: '#7a5c2e' }} />
              ) : (
                <Menu size={20} style={{ color: '#7a5c2e' }} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="md:hidden border-t px-4 py-4 flex flex-col gap-4"
            style={{ borderColor: '#e8d5b0', backgroundColor: '#fdf6ec' }}
          >
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium"
                style={{ color: '#6b5040' }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/menu"
              onClick={() => setMenuOpen(false)}
              className="self-start rounded-full px-4 py-1.5 text-sm font-semibold"
              style={{ backgroundColor: '#7a5c2e', color: '#fdf6ec' }}
            >
              Commander
            </Link>
            <button
              onClick={() => { setMenuOpen(false); setManagerModalOpen(true) }}
              className="self-start text-sm font-medium"
              style={{ color: '#9a7c4e' }}
            >
              ⚙️ Espace Gérant
            </button>
          </div>
        )}
      </header>

      <ManagerLoginModal
        open={managerModalOpen}
        onClose={() => setManagerModalOpen(false)}
      />
    </>
  )
}
