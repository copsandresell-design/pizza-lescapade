'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { X, Download, Smartphone } from 'lucide-react'
import { usePwaInstall } from './use-pwa-install'
import { IosInstallModal } from './ios-install-modal'

const STORAGE_KEY = 'pwa-banner-dismissed'

export function InstallBanner() {
  const { state, triggerInstall } = usePwaInstall()
  const [visible, setVisible] = useState(false)
  const [iosOpen, setIosOpen] = useState(false)

  useEffect(() => {
    if (state === 'installed' || state === 'loading') return
    const dismissed = localStorage.getItem(STORAGE_KEY)
    if (!dismissed) {
      // Délai court pour ne pas interrompre la lecture de la confirmation
      const t = setTimeout(() => setVisible(true), 1200)
      return () => clearTimeout(t)
    }
  }, [state])

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  const handleInstall = async () => {
    if (state === 'ios' || state === 'unsupported') {
      setIosOpen(true)
      return
    }
    const outcome = await triggerInstall()
    if (outcome === 'accepted') dismiss()
  }

  if (!visible || state === 'installed' || state === 'loading') return null

  return (
    <>
      <div
        className="mt-8 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500"
        style={{ border: '1px solid #e8d5b0', backgroundColor: '#fff8f0' }}
      >
        <div className="flex items-start gap-4 px-5 py-4">
          <Image
            src="/pizza-lescapade-medias/identite/logo-rond-lescapade.jpg"
            alt="L'Escapade"
            width={56}
            height={56}
            className="rounded-2xl object-cover shadow shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm" style={{ color: '#2c1a0e' }}>
              Installez Pizza L&apos;Escapade
            </p>
            <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#8a6a4e' }}>
              Accédez à la carte et commandez en 2 touches depuis votre écran d&apos;accueil.
            </p>
            <button
              onClick={handleInstall}
              className="mt-3 flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors"
              style={{ backgroundColor: '#7a5c2e', color: '#fdf6ec' }}
            >
              {state === 'ios' ? (
                <><Smartphone size={12} /> Instructions iOS</>
              ) : (
                <><Download size={12} /> Installer</>
              )}
            </button>
          </div>
          <button
            onClick={dismiss}
            className="p-1 rounded-full hover:bg-[#e8d5b0] shrink-0 mt-0.5"
          >
            <X size={14} style={{ color: '#9a7c4e' }} />
          </button>
        </div>
      </div>

      <IosInstallModal open={iosOpen} onClose={() => setIosOpen(false)} />
    </>
  )
}
