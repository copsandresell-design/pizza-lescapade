'use client'
import { useState } from 'react'
import { AlertTriangle, Clock, Plus, Pencil, Check, X } from 'lucide-react'
import { toast } from 'sonner'

interface StockItem {
  id: string
  name: string
  quantity: number
  unit: string
  threshold: number
  expiry: string
}

const INITIAL_STOCK: StockItem[] = [
  { id: '1', name: 'Farine T65',         quantity: 8,   unit: 'kg',  threshold: 10, expiry: '2026-06-15' },
  { id: '2', name: 'Mozzarella',          quantity: 0.4, unit: 'kg',  threshold: 1,  expiry: '2026-05-24' },
  { id: '3', name: 'Sauce tomate',        quantity: 5,   unit: 'L',   threshold: 3,  expiry: '2026-07-01' },
  { id: '4', name: 'Jambon blanc',        quantity: 2,   unit: 'kg',  threshold: 1,  expiry: '2026-05-23' },
  { id: '5', name: 'Fromage de chèvre',  quantity: 1.2, unit: 'kg',  threshold: 0.5, expiry: '2026-05-27' },
  { id: '6', name: 'Œufs',               quantity: 24,  unit: 'u',   threshold: 12, expiry: '2026-06-03' },
  { id: '7', name: 'Huile d\'olive',     quantity: 3,   unit: 'L',   threshold: 1,  expiry: '2026-12-01' },
  { id: '8', name: 'Burrata',            quantity: 0.8, unit: 'kg',  threshold: 0.5, expiry: '2026-05-22' },
  { id: '9', name: 'Truffe (copeaux)',   quantity: 0.1, unit: 'kg',  threshold: 0.05, expiry: '2026-06-30' },
  { id: '10', name: 'Parma (tranches)',  quantity: 1.5, unit: 'kg',  threshold: 0.5, expiry: '2026-06-10' },
]

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - new Date().setHours(0, 0, 0, 0)
  return Math.ceil(diff / 86400000)
}

function ExpiryBadge({ dateStr }: { dateStr: string }) {
  const days = daysUntil(dateStr)
  if (days < 0) return <span className="text-xs font-bold" style={{ color: '#f87171' }}>Expiré</span>
  if (days <= 3) return <span className="text-xs font-bold" style={{ color: '#fb923c' }}>{days}j</span>
  return <span className="text-xs" style={{ color: '#9a7c4e' }}>{days}j</span>
}

export default function InventoryPage() {
  const [stock, setStock] = useState<StockItem[]>(INITIAL_STOCK)
  const [editId, setEditId] = useState<string | null>(null)
  const [editQty, setEditQty] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [newItem, setNewItem] = useState({ name: '', quantity: '', unit: 'kg', threshold: '', expiry: '' })

  const startEdit = (item: StockItem) => {
    setEditId(item.id)
    setEditQty(String(item.quantity))
  }

  const saveEdit = (id: string) => {
    const qty = parseFloat(editQty)
    if (isNaN(qty) || qty < 0) return toast.error('Quantité invalide')
    setStock((prev) => prev.map((s) => s.id === id ? { ...s, quantity: qty } : s))
    setEditId(null)
    toast.success('Stock mis à jour')
  }

  const addItem = () => {
    if (!newItem.name || !newItem.quantity || !newItem.expiry) return toast.error('Remplissez tous les champs')
    const item: StockItem = {
      id: Date.now().toString(),
      name: newItem.name,
      quantity: parseFloat(newItem.quantity),
      unit: newItem.unit,
      threshold: parseFloat(newItem.threshold) || 0,
      expiry: newItem.expiry,
    }
    setStock((prev) => [...prev, item])
    setNewItem({ name: '', quantity: '', unit: 'kg', threshold: '', expiry: '' })
    setShowAdd(false)
    toast.success(`${item.name} ajouté`)
  }

  const lowStock = stock.filter((s) => s.quantity < s.threshold)
  const expiringSoon = stock.filter((s) => daysUntil(s.expiry) <= 3 && daysUntil(s.expiry) >= 0)

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#fdf6ec' }}>Stock</h1>
          {(lowStock.length > 0 || expiringSoon.length > 0) && (
            <p className="text-sm mt-0.5" style={{ color: '#fb923c' }}>
              {lowStock.length > 0 && `${lowStock.length} en rupture`}
              {lowStock.length > 0 && expiringSoon.length > 0 && ' · '}
              {expiringSoon.length > 0 && `${expiringSoon.length} expirent bientôt`}
            </p>
          )}
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors"
          style={{ backgroundColor: '#d4a843', color: '#1a0e06' }}
        >
          <Plus size={15} /> Ajouter
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ backgroundColor: '#1a0e06', border: '1px solid #d4a843' }}>
          <p className="text-sm font-semibold" style={{ color: '#d4a843' }}>Nouvel ingrédient</p>
          <div className="grid grid-cols-2 gap-3">
            <input className="admin-input col-span-2" placeholder="Nom" value={newItem.name}
              onChange={(e) => setNewItem((p) => ({ ...p, name: e.target.value }))} />
            <input className="admin-input" placeholder="Quantité" type="number" value={newItem.quantity}
              onChange={(e) => setNewItem((p) => ({ ...p, quantity: e.target.value }))} />
            <select className="admin-input" value={newItem.unit}
              onChange={(e) => setNewItem((p) => ({ ...p, unit: e.target.value }))}>
              {['kg', 'L', 'g', 'ml', 'u'].map((u) => <option key={u}>{u}</option>)}
            </select>
            <input className="admin-input" placeholder="Seuil alerte" type="number" value={newItem.threshold}
              onChange={(e) => setNewItem((p) => ({ ...p, threshold: e.target.value }))} />
            <input className="admin-input" type="date" value={newItem.expiry}
              onChange={(e) => setNewItem((p) => ({ ...p, expiry: e.target.value }))} />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-xl text-sm" style={{ color: '#9a7c4e' }}>Annuler</button>
            <button onClick={addItem} className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ backgroundColor: '#d4a843', color: '#1a0e06' }}>Ajouter</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #3a2010' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#2c1a0e', borderBottom: '1px solid #3a2010' }}>
                {['Ingrédient', 'Quantité', 'Seuil', 'Péremption', 'Statut', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: '#6b5040' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ '--tw-divide-color': '#3a2010' } as React.CSSProperties}>
              {stock.map((item) => {
                const low = item.quantity < item.threshold
                const days = daysUntil(item.expiry)
                const expiring = days <= 3
                return (
                  <tr key={item.id} style={{ backgroundColor: '#1a0e06' }}>
                    <td className="px-4 py-3 font-medium" style={{ color: '#fdf6ec' }}>
                      <div className="flex items-center gap-2">
                        {low && <AlertTriangle size={13} className="shrink-0" style={{ color: '#f87171' }} />}
                        {!low && expiring && <Clock size={13} className="shrink-0" style={{ color: '#fb923c' }} />}
                        {item.name}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {editId === item.id ? (
                        <input
                          type="number"
                          value={editQty}
                          onChange={(e) => setEditQty(e.target.value)}
                          className="admin-input w-20"
                          autoFocus
                        />
                      ) : (
                        <span style={{ color: low ? '#f87171' : '#fdf6ec' }}>
                          {item.quantity} {item.unit}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3" style={{ color: '#9a7c4e' }}>
                      {item.threshold} {item.unit}
                    </td>
                    <td className="px-4 py-3">
                      <ExpiryBadge dateStr={item.expiry} />
                    </td>
                    <td className="px-4 py-3">
                      {low ? (
                        <span className="rounded-full px-2 py-0.5 text-xs font-bold" style={{ backgroundColor: '#7f1d1d', color: '#f87171' }}>Rupture</span>
                      ) : expiring ? (
                        <span className="rounded-full px-2 py-0.5 text-xs font-bold" style={{ backgroundColor: '#431407', color: '#fb923c' }}>Expire bientôt</span>
                      ) : (
                        <span className="rounded-full px-2 py-0.5 text-xs font-bold" style={{ backgroundColor: '#14532d', color: '#4ade80' }}>OK</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {editId === item.id ? (
                          <>
                            <button onClick={() => saveEdit(item.id)} className="p-1.5 rounded-lg hover:bg-[#2c1a0e]">
                              <Check size={14} style={{ color: '#4ade80' }} />
                            </button>
                            <button onClick={() => setEditId(null)} className="p-1.5 rounded-lg hover:bg-[#2c1a0e]">
                              <X size={14} style={{ color: '#9a7c4e' }} />
                            </button>
                          </>
                        ) : (
                          <button onClick={() => startEdit(item)} className="p-1.5 rounded-lg hover:bg-[#2c1a0e]">
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

      <style>{`.admin-input { background: #2c1a0e; border: 1px solid #4a3020; border-radius: 0.5rem; padding: 0.375rem 0.625rem; color: #fdf6ec; font-size: 0.875rem; outline: none; width: 100%; } .admin-input:focus { border-color: #d4a843; } .admin-input option { background: #2c1a0e; }`}</style>
    </div>
  )
}
