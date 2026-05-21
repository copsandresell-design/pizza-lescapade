'use client'
import { useState, useCallback } from 'react'
import Image from 'next/image'
import { GALLERY_PHOTOS, GALLERY_FILTERS } from '@/store/gallery'
import { Lightbox } from '@/components/gallery/Lightbox'
import type { GalleryCategory } from '@/store/gallery'

export default function GaleriePage() {
  const [active, setActive] = useState<GalleryCategory | 'all'>('all')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const filtered = active === 'all'
    ? GALLERY_PHOTOS
    : GALLERY_PHOTOS.filter((p) => p.category === active)

  const openLightbox = useCallback((globalIndex: number) => {
    setLightboxIndex(globalIndex)
  }, [])

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])

  const navigate = useCallback((index: number) => setLightboxIndex(index), [])

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdf6ec' }}>

      {/* Header */}
      <div className="py-10 px-4 text-center" style={{ borderBottom: '1px solid #e8d5b0' }}>
        <h1
          className="mb-2"
          style={{
            fontFamily: 'var(--font-dancing), cursive',
            fontSize: 'clamp(2.2rem, 6vw, 3.5rem)',
            color: '#7a5c2e',
          }}
        >
          La galerie
        </h1>
        <p className="text-sm tracking-widest uppercase" style={{ color: '#9a7c4e' }}>
          Le lieu · L&apos;ambiance · Les pizzas · Le savoir-faire
        </p>
      </div>

      {/* Filtres */}
      <div
        className="sticky top-14 z-10 px-4 py-3"
        style={{ backgroundColor: '#fdf6ec', borderBottom: '1px solid #e8d5b0' }}
      >
        <div className="max-w-5xl mx-auto flex gap-2 overflow-x-auto pb-0.5">
          {GALLERY_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActive(f.key)}
              className="whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition-colors"
              style={
                active === f.key
                  ? { backgroundColor: '#7a5c2e', color: '#fdf6ec' }
                  : { backgroundColor: '#e8d5b0', color: '#6b5040' }
              }
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grille mosaïque */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div
          className="gap-3"
          style={{
            columns: 'var(--gallery-cols, 2)',
          }}
        >
          <style>{`
            @media (min-width: 640px) { :root { --gallery-cols: 3; } }
            @media (min-width: 1024px) { :root { --gallery-cols: 4; } }
          `}</style>

          {filtered.map((photo) => {
            const globalIndex = GALLERY_PHOTOS.indexOf(photo)
            const filteredIndex = filtered.indexOf(photo)
            return (
              <button
                key={photo.src}
                onClick={() => openLightbox(filteredIndex)}
                className="group relative w-full mb-3 block overflow-hidden rounded-xl focus:outline-none focus-visible:ring-2"
                style={{ breakInside: 'avoid' }}
                aria-label={photo.alt}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width * 150}
                  height={photo.height * 150}
                  className="w-full h-auto object-cover transition-transform duration-400 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  loading={globalIndex < 8 ? 'eager' : 'lazy'}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-xl" />
              </button>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <p className="text-center py-16 text-sm" style={{ color: '#9a7c4e' }}>
            Aucune photo dans cette catégorie
          </p>
        )}
      </main>

      <Lightbox
        photos={filtered}
        index={lightboxIndex}
        onClose={closeLightbox}
        onNavigate={navigate}
      />
    </div>
  )
}
