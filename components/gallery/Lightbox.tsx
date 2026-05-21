'use client'
import { useEffect, useCallback } from 'react'
import Image from 'next/image'
import * as Dialog from '@radix-ui/react-dialog'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { GalleryPhoto } from '@/store/gallery'

interface LightboxProps {
  photos: GalleryPhoto[]
  index: number | null
  onClose: () => void
  onNavigate: (index: number) => void
}

export function Lightbox({ photos, index, onClose, onNavigate }: LightboxProps) {
  const isOpen = index !== null
  const photo = index !== null ? photos[index] : null

  const prev = useCallback(() => {
    if (index === null) return
    onNavigate((index - 1 + photos.length) % photos.length)
  }, [index, photos.length, onNavigate])

  const next = useCallback(() => {
    if (index === null) return
    onNavigate((index + 1) % photos.length)
  }, [index, photos.length, onNavigate])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, prev, next])

  return (
    <Dialog.Root open={isOpen} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/90 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="fixed inset-0 z-50 flex items-center justify-center p-4 focus:outline-none"
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">
            {photo?.alt ?? 'Photo'}
          </Dialog.Title>

          {/* Close */}
          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 z-10 p-2 rounded-full transition-colors"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff' }}
              aria-label="Fermer"
            >
              <X size={20} />
            </button>
          </Dialog.Close>

          {/* Prev */}
          <button
            onClick={prev}
            className="absolute left-4 z-10 p-3 rounded-full transition-colors"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff' }}
            aria-label="Précédente"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Image */}
          {photo && (
            <div className="relative max-w-5xl w-full max-h-[85vh] flex items-center justify-center">
              <Image
                key={photo.src}
                src={photo.src}
                alt={photo.alt}
                width={1200}
                height={900}
                className="object-contain max-h-[85vh] w-auto rounded-lg"
                sizes="95vw"
                priority
              />
              <p
                className="absolute bottom-0 left-0 right-0 text-center text-sm py-2 rounded-b-lg"
                style={{ backgroundColor: 'rgba(0,0,0,0.55)', color: '#e8d5b0' }}
              >
                {photo.alt} — {(index ?? 0) + 1} / {photos.length}
              </p>
            </div>
          )}

          {/* Next */}
          <button
            onClick={next}
            className="absolute right-4 z-10 p-3 rounded-full transition-colors"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff' }}
            aria-label="Suivante"
          >
            <ChevronRight size={22} />
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
