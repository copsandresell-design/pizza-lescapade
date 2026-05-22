'use client'
import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { ToggleLeft, ToggleRight, Pencil, Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { formatPrix } from '@/lib/utils'
import type { Pizza, MenuCategory } from '@/types'

const CAT_LABELS: Record<MenuCategory, string> = {
  pizza:          'Pizza',
  incontournable: 'Incontournable',
  salade:         'Salade',
  panuzzi:        'Panuzzi',
}

const CAT_COLORS: Record<MenuCategory, { bg: string; color: string }> = {
  pizza:          { bg: '#2c1a0e', color: '#d4a843' },
  incontournable: { bg: '#3d2a00', color: '#f97316' },
  salade:         { bg: '#14532d', color: '#4ade80' },
  panuzzi:        { bg: '#1e3a5f', color: '#60a5fa' },
}

type FilterCat = MenuCategory | 'all'
const FILTER_TABS: { key: FilterCat; label: string }[] = [
  { key: 'all',          label: 'Tous' },
  { key: 'pizza',        label: 'Pizzas' },
  { key: 'incontournable', label: 'Incontournables' },
  { key: 'salade',       label: 'Salades' },
  { key: 'panuzzi',      label: 'Panuozzi' },
]

export default function PizzasPage() {
  const [items, setItems] = useState<Pizza[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterCat>('all')
  const [editId, setEditId] = useState<string | null>(null)
  const [editPrix, setEditPrix] = useState('')

  const load = useCallback(async () => {
    const res = await fetch('/api/menu', { cache: 'no-store' })
    if (res.ok) setItems(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const toggleDisponible = async (item: Pizza) => {
    const res = await fetch(`/api/menu/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ disponible: !item.disponible }),
    })
    if (res.ok) {
      const updated = await res.json()
      setItems((prev) => prev.map((p) => p.id === updated.id ? updated : p))
      toast(updated.disponible
        ? `✅ ${item.nom} visible côté client`
        : `🚫 ${item.nom} masquée des clients`)
    }
  }

  const startEdit = (item: Pizza) => { setEditId(item.id); setEditPrix(String(item.prix)) }

  const saveEdit = async (item: Pizza) => {
    const prix = parseFloat(editPrix)
    if (isNaN(prix) || prix <= 0) return toast.error('Prix invalide')
    const res = await fetch(`/api/menu/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prix }),
    })
    if (res.ok) {
      const updated = await res.json()
      setItems((prev) => prev.map((p) => p.id === updated.id ? updated : p))
      toast.success('Prix mis à jour')
    }
    setEditId(null)
  }

  const visible = filter === 'all' ? items : items.filter((i) => i.categorie === filter)
  const activeCount = items.filter((i) => i.disponible).length

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#fdf6ec' }}>Carte</h1>
        <p className="text-sm mt-0.5" style={{ color: '#6b5040' }}>
          {activeCount} / {items.length} disponibles
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTER_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className="rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"
            style={
              filter === t.key
                ? { backgroundColor: '#d4a843', color: '#1a0e06' }
                : { backgroundColor: '#1a0e06', color: '#9a7c4e', border: '1px solid #3a2010' }
            }
          >
            {t.label}
            <span className="ml-1 opacity-60">
              ({t.key === 'all' ? items.length : items.filter((i) => i.categorie === t.key).length})
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-16" style={{ color: '#6b5040' }}>Chargement…</div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #3a2010' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: '#2c1a0e', borderBottom: '1px solid #3a2010' }}>
                  {['', 'Article', 'Catégorie', 'Prix', 'Dispo', ''].map((h, i) => (
                    <th key={i} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#6b5040' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((item) => {
                  const catStyle = CAT_COLORS[item.categorie]
                  return (
                    <tr
                      key={item.id}
                      style={{
                        backgroundColor: '#1a0e06',
                        borderBottom: '1px solid #2c1a0e',
                        opacity: item.disponible ? 1 : 0.5,
                      }}
                    >
                      {/* Image */}
                      <td className="px-3 py-2 w-14">
                        {item.image ? (
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden">
                            <Image src={item.image} alt={item.nom} fill className="object-cover" sizes="40px" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ backgroundColor: '#2c1a0e' }}>
                            {item.categorie === 'salade' ? '🥗' : item.categorie === 'panuzzi' ? '🥖' : '🍕'}
                          </div>
                        )}
                      </td>

                      {/* Name + desc */}
                      <td className="px-4 py-3" style={{ minWidth: '160px' }}>
                        <p className="font-semibold leading-tight" style={{ color: '#fdf6ec' }}>{item.nom}</p>
                        <p className="text-xs mt-0.5 line-clamp-1" style={{ color: '#6b5040' }}>{item.desc}</p>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3">
                        <span className="rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap"
                          style={{ backgroundColor: catStyle.bg, color: catStyle.color, border: `1px solid ${catStyle.color}33` }}>
                          {CAT_LABELS[item.categorie]}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3">
                        {editId === item.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={editPrix}
                              onChange={(e) => setEditPrix(e.target.value)}
                              className="w-16 rounded-lg px-2 py-1 text-sm"
                              style={{ backgroundColor: '#2c1a0e', border: '1px solid #d4a843', color: '#fdf6ec', outline: 'none' }}
                              autoFocus step="0.5"
                            />
                            <span style={{ color: '#9a7c4e' }}>€</span>
                          </div>
                        ) : (
                          <span className="font-semibold" style={{ color: '#d4a843' }}>
                            {formatPrix(item.prix)}
                          </span>
                        )}
                      </td>

                      {/* Toggle disponible */}
                      <td className="px-4 py-3">
                        <button onClick={() => toggleDisponible(item)} title={item.disponible ? 'Masquer des clients' : 'Rendre visible'}>
                          {item.disponible
                            ? <ToggleRight size={24} style={{ color: '#4ade80' }} />
                            : <ToggleLeft size={24} style={{ color: '#6b5040' }} />}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {editId === item.id ? (
                            <>
                              <button onClick={() => saveEdit(item)} className="p-1.5 rounded-lg hover:bg-[#2c1a0e]">
                                <Check size={14} style={{ color: '#4ade80' }} />
                              </button>
                              <button onClick={() => setEditId(null)} className="p-1.5 rounded-lg hover:bg-[#2c1a0e]">
                                <X size={14} style={{ color: '#9a7c4e' }} />
                              </button>
                            </>
                          ) : (
                            <button onClick={() => startEdit(item)} className="p-1.5 rounded-lg hover:bg-[#2c1a0e]" title="Modifier le prix">
                              <Pencil size={13} style={{ color: '#9a7c4e' }} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Legend */}
      <p className="text-xs text-center" style={{ color: '#6b5040' }}>
        Le toggle vert/rouge contrôle la visibilité en temps réel côté client
      </p>
    </div>
  )
}
