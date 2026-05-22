'use client'
import { useState } from 'react'
import { PIZZAS, CATEGORIES } from '@/store/pizzas'
import { PizzaCard } from '@/components/menu/pizza-card'

type Categorie = keyof typeof CATEGORIES | 'all'

const TABS: { key: Categorie; label: string }[] = [
  { key: 'all', label: 'Toutes' },
  { key: 'tomate', label: 'Base tomate' },
  { key: 'creme', label: 'Base crème' },
  { key: 'speciale', label: 'Spécialités' },
]

export default function MenuPage() {
  const [active, setActive] = useState<Categorie>('all')

  const filtered =
    active === 'all' ? PIZZAS : PIZZAS.filter((p) => p.categorie === active)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdf6ec' }}>
      {/* Header */}
      <div
        className="py-10 px-4 text-center"
        style={{ borderBottom: '1px solid #e8d5b0' }}
      >
        <h1
          className="mb-2"
          style={{
            fontFamily: 'var(--font-dancing), cursive',
            fontSize: 'clamp(2.2rem, 6vw, 3.5rem)',
            color: '#7a5c2e',
          }}
        >
          La carte
        </h1>
        <p className="text-sm tracking-widest uppercase" style={{ color: '#9a7c4e' }}>
          Pâte artisanale · Saveurs authentiques
        </p>
      </div>

      {/* Category tabs */}
      <div
        className="sticky top-14 z-10 px-4 py-3 flex gap-2 overflow-x-auto"
        style={{ backgroundColor: '#fdf6ec', borderBottom: '1px solid #e8d5b0' }}
      >
        <div className="max-w-5xl mx-auto w-full flex gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className="whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition-colors"
              style={
                active === tab.key
                  ? { backgroundColor: '#7a5c2e', color: '#fdf6ec' }
                  : { backgroundColor: '#e8d5b0', color: '#6b5040' }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((pizza) => (
            <PizzaCard key={pizza.id} pizza={pizza} />
          ))}
        </div>

        <p className="mt-10 text-center text-xs" style={{ color: '#9a7c4e' }}>
          Possibilité de modifier les ingrédients · Allergènes disponibles sur demande
        </p>
      </main>
    </div>
  )
}
