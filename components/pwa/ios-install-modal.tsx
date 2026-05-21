'use client'
import Image from 'next/image'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Share, PlusSquare, Smartphone } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
}

const STEPS = [
  {
    icon: <Share size={22} style={{ color: '#7a5c2e' }} />,
    title: 'Appuyer sur Partager',
    desc: 'Touchez l\'icône  en bas de Safari',
  },
  {
    icon: <PlusSquare size={22} style={{ color: '#7a5c2e' }} />,
    title: '"Sur l\'écran d\'accueil"',
    desc: 'Faites défiler le menu Partager et touchez cette option',
  },
  {
    icon: <Smartphone size={22} style={{ color: '#7a5c2e' }} />,
    title: 'Confirmer',
    desc: 'Appuyez sur "Ajouter" en haut à droite — c\'est installé !',
  },
]

export function IosInstallModal({ open, onClose }: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl px-6 pb-10 pt-6 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom duration-300"
          style={{ backgroundColor: '#fdf6ec', maxWidth: '480px', margin: '0 auto' }}
        >
          {/* Handle */}
          <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ backgroundColor: '#e8d5b0' }} />

          <div className="flex items-start justify-between mb-5">
            <div>
              <Dialog.Title
                className="text-2xl"
                style={{ fontFamily: 'var(--font-dancing), cursive', color: '#7a5c2e' }}
              >
                Installer l&apos;application
              </Dialog.Title>
              <p className="text-sm mt-1" style={{ color: '#9a7c4e' }}>
                Commandez encore plus vite depuis l&apos;écran d&apos;accueil
              </p>
            </div>
            <Dialog.Close asChild>
              <button className="p-1.5 rounded-full hover:bg-[#e8d5b0]" onClick={onClose}>
                <X size={18} style={{ color: '#9a7c4e' }} />
              </button>
            </Dialog.Close>
          </div>

          {/* App preview */}
          <div
            className="flex items-center gap-3 rounded-2xl px-4 py-3 mb-6"
            style={{ backgroundColor: '#f5e9d2', border: '1px solid #e8d5b0' }}
          >
            <Image
              src="/pizza-lescapade-medias/identite/logo-rond-lescapade.jpg"
              alt="Icône L'Escapade"
              width={56}
              height={56}
              className="rounded-2xl object-cover shadow"
            />
            <div>
              <p className="font-bold text-sm" style={{ color: '#2c1a0e' }}>Pizza L&apos;Escapade</p>
              <p className="text-xs" style={{ color: '#9a7c4e' }}>pizza-escapade.fr</p>
            </div>
          </div>

          {/* Steps */}
          <ol className="flex flex-col gap-4">
            {STEPS.map((step, i) => (
              <li key={i} className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: '#f5e9d2', border: '1px solid #e8d5b0' }}
                >
                  {step.icon}
                </div>
                <div className="flex-1 pt-1.5">
                  <p className="font-semibold text-sm" style={{ color: '#2c1a0e' }}>
                    <span
                      className="mr-2 text-xs font-bold rounded-full px-1.5 py-0.5"
                      style={{ backgroundColor: '#7a5c2e', color: '#fdf6ec' }}
                    >
                      {i + 1}
                    </span>
                    {step.title}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#8a6a4e' }}>{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* iOS share icon hint */}
          <div
            className="mt-5 rounded-xl px-4 py-3 flex items-center gap-2"
            style={{ backgroundColor: '#fff8f0', border: '1px solid #e8d5b0' }}
          >
            <Share size={16} style={{ color: '#7a5c2e' }} />
            <p className="text-xs" style={{ color: '#8a6a4e' }}>
              L&apos;icône Partager  se trouve dans la barre d&apos;outils en bas de Safari
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
