'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Pencil, Check, X, ToggleLeft, ToggleRight } from 'lucide-react'
import { formatPrix } from '@/lib/utils'
import { PIZZAS } from '@/store/pizzas'
import { toast } from 'sonner'
import type { Pizza } from '@/types'

const CAT_LABELS: Record<string, string> = {
  tomate: 'Base tomate',
  creme: 'Base crème',
  speciale: 'Spéciale',
}

export default function PizzasPage() {
  const [pizzas, setPizzas] = useState<Pizza[]>(PIZZAS)
  const [editId, setEditId] = useState<string | null>(null)
  const [editPrix, setEditPrix] = useState('')

  const startEdit = (p: Pizza) => {
    setEditId(p.id)
    setEditPrix(String(p.prix))
  }

  const saveEdit = (id: string) => {
    const prix = parseFloat(editPrix)
    if (isNaN(prix) || prix <= 0) return toast.error('Prix invalide')
    setPizzas((prev) => prev.map((p) => p.id === id ? { ...p, prix } : p))
    setEditId(null)
    toast.success('Prix mis à jour')
  }

  const toggleDisponible = (id: string) => {
    setPizzas((prev) => prev.map((p) => {
      if (p.id !== id) return p
      const next = { ...p, disponible: !p.disponible }
      toast(next.disponible ? `${p.nom} activée` : `${p.nom} désactivée`)
      return next
    }))
  }

  const active = pizzas.filter((p) => p.disponible).length

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#fdf6ec' }}>Pizzas</h1>
        <p className="text-sm mt-0.5" style={{ color: '#6b5040' }}>
          {active} / {pizzas.length} disponibles
        </p>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #3a2010' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#2c1a0e', borderBottom: '1px solid #3a2010' }}>
                {['', 'Pizza', 'Catégorie', 'Prix', 'Disponible', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: '#6b5040' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pizzas.map((pizza) => (
                <tr
                  key={pizza.id}
                  style={{
                    backgroundColor: '#1a0e06',
                    borderBottom: '1px solid #2c1a0e',
                    opacity: pizza.disponible ? 1 : 0.5,
                  }}
                >
                  <td className="px-3 py-2 w-12">
                    {pizza.image ? (
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden">
                        <Image src={pizza.image} alt={pizza.nom} fill className="object-cover" sizes="40px" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ backgroundColor: '#2c1a0e' }}>🍕</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-semibold" style={{ color: '#fdf6ec' }}>{pizza.nom}</p>
                      <p className="text-xs mt-0.5 line-clamp-1" style={{ color: '#6b5040' }}>{pizza.desc}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-semibold"
                      style={{ backgroundColor: '#2c1a0e', color: '#9a7c4e', border: '1px solid #3a2010' }}
                    >
                      {CAT_LABELS[pizza.categorie] ?? pizza.categorie}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {editId === pizza.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={editPrix}
                          onChange={(e) => setEditPrix(e.target.value)}
                          className="w-16 rounded-lg px-2 py-1 text-sm"
                          style={{ backgroundColor: '#2c1a0e', border: '1px solid #d4a843', color: '#fdf6ec', outline: 'none' }}
                          autoFocus
                          step="0.5"
                        />
                        <span style={{ color: '#9a7c4e' }}>€</span>
                      </div>
                    ) : (
                      <span className="font-semibold" style={{ color: '#d4a843' }}>
                        {formatPrix(pizza.prix)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleDisponible(pizza.id)}>
                      {pizza.disponible
                        ? <ToggleRight size={22} style={{ color: '#4ade80' }} />
                        : <ToggleLeft size={22} style={{ color: '#6b5040' }} />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {editId === pizza.id ? (
                        <>
                          <button onClick={() => saveEdit(pizza.id)} className="p-1.5 rounded-lg hover:bg-[#2c1a0e]">
                            <Check size={14} style={{ color: '#4ade80' }} />
                          </button>
                          <button onClick={() => setEditId(null)} className="p-1.5 rounded-lg hover:bg-[#2c1a0e]">
                            <X size={14} style={{ color: '#9a7c4e' }} />
                          </button>
                        </>
                      ) : (
                        <button onClick={() => startEdit(pizza)} className="p-1.5 rounded-lg hover:bg-[#2c1a0e]">
                          <Pencil size={13} style={{ color: '#9a7c4e' }} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
