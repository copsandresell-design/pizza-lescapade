'use client'
import { useState } from 'react'
import { Download, Smartphone } from 'lucide-react'
import { usePwaInstall } from './use-pwa-install'
import { IosInstallModal } from './ios-install-modal'

interface InstallButtonProps {
  variant?: 'hero' | 'nav' | 'inline'
  className?: string
}

export function InstallButton({ variant = 'inline', className = '' }: InstallButtonProps) {
  const { state, triggerInstall } = usePwaInstall()
  const [iosOpen, setIosOpen] = useState(false)

  // Bouton invisible si déjà installé ou si ça charge
  if (state === 'installed' || state === 'loading') return null

  const handleClick = async () => {
    if (state === 'ios') {
      setIosOpen(true)
      return
    }
    if (state === 'installable') {
      await triggerInstall()
      return
    }
    // unsupported → instructions iOS par défaut
    setIosOpen(true)
  }

  if (variant === 'hero') {
    return (
      <>
        <button
          onClick={handleClick}
          className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all border-2 hover:opacity-90 ${className}`}
          style={{ borderColor: '#e8d5b0', color: '#e8d5b0' }}
        >
          <Download size={15} />
          Installer l&apos;appli
        </button>
        <IosInstallModal open={iosOpen} onClose={() => setIosOpen(false)} />
      </>
    )
  }

  if (variant === 'nav') {
    return (
      <>
        <button
          onClick={handleClick}
          title="Installer l'application"
          className={`hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-[#e8d5b0] ${className}`}
          style={{ color: '#7a5c2e', border: '1px solid #e8d5b0' }}
        >
          <Smartphone size={13} />
          Installer
        </button>
        <IosInstallModal open={iosOpen} onClose={() => setIosOpen(false)} />
      </>
    )
  }

  // inline (default)
  return (
    <>
      <button
        onClick={handleClick}
        className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors ${className}`}
        style={{ backgroundColor: '#f5e9d2', color: '#7a5c2e', border: '1px solid #e8d5b0' }}
      >
        <Download size={15} />
        Installer l&apos;application
      </button>
      <IosInstallModal open={iosOpen} onClose={() => setIosOpen(false)} />
    </>
  )
}
