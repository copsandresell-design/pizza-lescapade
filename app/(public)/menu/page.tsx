'use client'
import { useEffect, useState, useCallback } from 'react'
import { PizzaCard } from '@/components/menu/pizza-card'
import type { Pizza, MenuCategory } from '@/types'

type Tab = MenuCategory | 'all'

const TABS: { key: Tab; label: string; emoji: string }[] = [
  { key: 'all',          label: 'Tout',            emoji: '🍽️' },
  { key: 'pizza',        label: 'Pizzas',          emoji: '🍕' },
  { key: 'incontournable', label: 'Incontournables', emoji: '⭐' },
  { key: 'salade',       label: 'Salades',         emoji: '🥗' },
  { key: 'panuzzi',      label: 'Panuozzi',        emoji: '🥖' },
]

const SECTION_DESCS: Partial<Record<Tab, string>> = {
  incontournable: 'Nos créations signature — à déguster sans modération',
  salade:         'Fraîcheur et générosité, composées à la minute',
  panuzzi:        'Le panino napolitain : pain maison, garnitures généreuses',
}

export default function MenuPage() {
  const [items, setItems] = useState<Pizza[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('all')

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/menu?available=true', { cache: 'no-store' })
      if (res.ok) setItems(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = tab === 'all' ? items : items.filter((i) => i.categorie === tab)

  // Group by category for "all" view
  const sections: { cat: MenuCategory; label: string; emoji: string; items: Pizza[] }[] = tab === 'all'
    ? TABS.filter((t) => t.key !== 'all').map((t) => ({
        cat: t.key as MenuCategory,
        label: t.label,
        emoji: t.emoji,
        items: items.filter((i) => i.categorie === t.key),
      })).filter((s) => s.items.length > 0)
    : []

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdf6ec' }}>
      {/* Header */}
      <div className="py-10 px-4 text-center" style={{ borderBottom: '1px solid #e8d5b0' }}>
        <h1
          className="mb-2"
          style={{ fontFamily: 'var(--font-dancing), cursive', fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', color: '#7a5c2e' }}
        >
          La carte
        </h1>
        <p className="text-sm tracking-widest uppercase" style={{ color: '#9a7c4e' }}>
          Pâte artisanale · Saveurs authentiques
        </p>
      </div>

      {/* Tabs */}
      <div
        className="sticky top-14 z-10 px-4 py-3"
        style={{ backgroundColor: '#fdf6ec', borderBottom: '1px solid #e8d5b0' }}
      >
        <div className="max-w-5xl mx-auto flex gap-2 overflow-x-auto pb-0.5">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition-colors shrink-0 flex items-center gap-1.5"
              style={
                tab === t.key
                  ? { backgroundColor: '#7a5c2e', color: '#fdf6ec' }
                  : { backgroundColor: '#e8d5b0', color: '#6b5040' }
              }
            >
              <span>{t.emoji}</span> {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20" style={{ color: '#9a7c4e' }}>Chargement…</div>
        ) : tab === 'all' ? (
          /* All sections view */
          <div className="flex flex-col gap-14">
            {sections.map((s) => (
              <section key={s.cat}>
                <div className="flex items-center gap-3 mb-2">
                  <span style={{ fontSize: '1.5rem' }}>{s.emoji}</span>
                  <h2
                    style={{ fontFamily: 'var(--font-dancing), cursive', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: '#7a5c2e' }}
                  >
                    {s.label}
                  </h2>
                </div>
                {SECTION_DESCS[s.cat] && (
                  <p className="text-xs tracking-wide mb-5 ml-10" style={{ color: '#9a7c4e' }}>
                    {SECTION_DESCS[s.cat]}
                  </p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {s.items.map((item) => <PizzaCard key={item.id} pizza={item} />)}
                </div>
              </section>
            ))}
          </div>
        ) : (
          /* Filtered single category view */
          <>
            {SECTION_DESCS[tab] && (
              <p className="text-sm text-center mb-8" style={{ color: '#9a7c4e' }}>
                {SECTION_DESCS[tab]}
              </p>
            )}
            {filtered.length === 0 ? (
              <p className="text-center py-20" style={{ color: '#9a7c4e' }}>Aucun article disponible</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((item) => <PizzaCard key={item.id} pizza={item} />)}
              </div>
            )}
          </>
        )}

        <p className="mt-12 text-center text-xs" style={{ color: '#9a7c4e' }}>
          Possibilité de modifier les ingrédients · Allergènes disponibles sur demande
        </p>
      </main>
    </div>
  )
}
