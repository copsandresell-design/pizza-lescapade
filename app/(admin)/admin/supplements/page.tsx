'use client'
import { useCallback, useEffect, useState } from 'react'
import { Plus, Pencil, Check, X, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { formatPrix } from '@/lib/utils'

interface Supplement {
  id: string
  name: string
  price: number
}

export default function SupplementsPage() {
  const [supplements, setSupplements] = useState<Supplement[]>([])
  const [loading, setLoading]         = useState(true)
  const [saving, setSaving]           = useState<string | null>(null)

  const [editId, setEditId]       = useState<string | null>(null)
  const [editName, setEditName]   = useState('')
  const [editPrice, setEditPrice] = useState('')

  const [showAdd, setShowAdd]     = useState(false)
  const [newName, setNewName]     = useState('')
  const [newPrice, setNewPrice]   = useState('')

  const load = useCallback(async () => {
    const res = await fetch('/api/supplements', { cache: 'no-store' })
    if (res.ok) setSupplements(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const startEdit = (s: Supplement) => {
    setEditId(s.id)
    setEditName(s.name)
    setEditPrice(String(s.price))
  }

  const saveEdit = async (id: string) => {
    const price = parseFloat(editPrice)
    if (!editName.trim() || isNaN(price) || price < 0) return toast.error('Données invalides')

    setSaving(id)
    const res = await fetch(`/api/supplements/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName.trim(), price }),
    })
    setSaving(null)

    if (res.ok) {
      const updated = await res.json()
      setSupplements((prev) => prev.map((s) => s.id === id ? updated : s))
      setEditId(null)
      toast.success('Supplément mis à jour ✓')
    } else {
      toast.error('Erreur lors de la sauvegarde')
    }
  }

  const remove = async (id: string) => {
    const s = supplements.find((s) => s.id === id)
    if (!confirm(`Supprimer "${s?.name}" ?`)) return

    setSaving(id + '-del')
    const res = await fetch(`/api/supplements/${id}`, { method: 'DELETE' })
    setSaving(null)

    if (res.ok) {
      setSupplements((prev) => prev.filter((s) => s.id !== id))
      toast(`🗑️ ${s?.name} supprimé`)
    } else {
      toast.error('Erreur lors de la suppression')
    }
  }

  const addSupplement = async () => {
    const price = parseFloat(newPrice)
    if (!newName.trim() || isNaN(price) || price < 0) return toast.error('Remplissez tous les champs')

    setSaving('add')
    const res = await fetch('/api/supplements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim(), price }),
    })
    setSaving(null)

    if (res.ok) {
      const created = await res.json()
      setSupplements((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name, 'fr')))
      setNewName(''); setNewPrice(''); setShowAdd(false)
      toast.success(`${created.name} ajouté ✓`)
    } else {
      const body = await res.json().catch(() => ({}))
      toast.error(body.error ?? 'Erreur lors de la création')
    }
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#fdf6ec' }}>Suppléments</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6b5040' }}>{supplements.length} suppléments</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
          style={{ backgroundColor: '#d4a843', color: '#1a0e06' }}
        >
          <Plus size={15} /> Ajouter
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ backgroundColor: '#1a0e06', border: '1px solid #d4a843' }}>
          <p className="text-sm font-semibold" style={{ color: '#d4a843' }}>Nouveau supplément</p>
          <div className="grid grid-cols-2 gap-3">
            <input
              className="supp-input"
              placeholder="Nom *"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSupplement()}
            />
            <div className="flex items-center gap-2">
              <input
                className="supp-input"
                type="number"
                placeholder="Prix *"
                step="0.50"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
              />
              <span style={{ color: '#9a7c4e' }}>€</span>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-xl text-sm" style={{ color: '#9a7c4e' }}>Annuler</button>
            <button
              onClick={addSupplement}
              disabled={saving === 'add'}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ backgroundColor: '#d4a843', color: '#1a0e06' }}
            >
              {saving === 'add' ? <Loader2 size={13} className="animate-spin" /> : null}
              Ajouter
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="text-center py-16" style={{ color: '#6b5040' }}>Chargement…</div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #3a2010' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: '#2c1a0e', borderBottom: '1px solid #3a2010' }}>
                  {['Supplément', 'Prix', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#6b5040' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {supplements.map((s) => (
                  <tr key={s.id} style={{ backgroundColor: '#1a0e06', borderBottom: '1px solid #2c1a0e' }}>
                    <td className="px-4 py-3">
                      {editId === s.id ? (
                        <input
                          className="supp-input w-full"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          autoFocus
                        />
                      ) : (
                        <span className="font-medium" style={{ color: '#fdf6ec' }}>{s.name}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editId === s.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            className="supp-input w-16"
                            type="number"
                            step="0.50"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                          />
                          <span style={{ color: '#9a7c4e' }}>€</span>
                        </div>
                      ) : (
                        <span className="font-semibold" style={{ color: '#d4a843' }}>+{formatPrix(s.price)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {editId === s.id ? (
                          <>
                            <button
                              onClick={() => saveEdit(s.id)}
                              disabled={saving === s.id}
                              className="p-1.5 rounded-lg hover:bg-[#2c1a0e]"
                            >
                              {saving === s.id
                                ? <Loader2 size={14} className="animate-spin" style={{ color: '#4ade80' }} />
                                : <Check size={14} style={{ color: '#4ade80' }} />}
                            </button>
                            <button onClick={() => setEditId(null)} className="p-1.5 rounded-lg hover:bg-[#2c1a0e]">
                              <X size={14} style={{ color: '#9a7c4e' }} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEdit(s)} className="p-1.5 rounded-lg hover:bg-[#2c1a0e]">
                              <Pencil size={13} style={{ color: '#9a7c4e' }} />
                            </button>
                            <button
                              onClick={() => remove(s.id)}
                              disabled={saving === s.id + '-del'}
                              className="p-1.5 rounded-lg hover:bg-red-900/30"
                            >
                              {saving === s.id + '-del'
                                ? <Loader2 size={13} className="animate-spin" style={{ color: '#f87171' }} />
                                : <Trash2 size={13} style={{ color: '#f87171' }} />}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style>{`.supp-input { background: #2c1a0e; border: 1px solid #4a3020; border-radius: 0.5rem; padding: 0.375rem 0.625rem; color: #fdf6ec; font-size: 0.875rem; outline: none; width: 100%; } .supp-input:focus { border-color: #d4a843; }`}</style>
    </div>
  )
}
