'use client'
import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { ToggleLeft, ToggleRight, Pencil, Trash2, Plus, X, Check, Loader2 } from 'lucide-react'
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
  { key: 'all',             label: 'Tous' },
  { key: 'pizza',           label: 'Pizzas' },
  { key: 'incontournable',  label: 'Incontournables' },
  { key: 'salade',          label: 'Salades' },
  { key: 'panuzzi',         label: 'Panuozzi' },
]

interface PizzaForm {
  nom: string
  desc: string
  prix: string
  categorie: MenuCategory
  image: string
  populaire: boolean
  disponible: boolean
}

const EMPTY_FORM: PizzaForm = {
  nom: '', desc: '', prix: '', categorie: 'pizza',
  image: '', populaire: false, disponible: true,
}

function slugify(str: string) {
  return str.toLowerCase()
    .replace(/[éèê]/g, 'e').replace(/[àâ]/g, 'a').replace(/[ùû]/g, 'u')
    .replace(/[ïî]/g, 'i').replace(/[ôö]/g, 'o').replace(/[çc]/g, 'c')
    .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-')
}

export default function PizzasPage() {
  const [items, setItems]       = useState<Pizza[]>([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState<FilterCat>('all')
  const [saving, setSaving]     = useState<string | null>(null)

  // Edit modal
  const [editItem, setEditItem]   = useState<Pizza | null>(null)
  const [editForm, setEditForm]   = useState<PizzaForm>(EMPTY_FORM)

  // Create modal
  const [showCreate, setShowCreate] = useState(false)
  const [createForm, setCreateForm] = useState<PizzaForm>(EMPTY_FORM)

  const load = useCallback(async () => {
    const res = await fetch('/api/menu', { cache: 'no-store' })
    if (res.ok) setItems(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  // ── Toggle disponible ────────────────────────────────────────────────────
  const toggleDisponible = async (item: Pizza) => {
    setSaving(item.id + '-toggle')
    const res = await fetch(`/api/menu/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ disponible: !item.disponible }),
    })
    setSaving(null)
    if (res.ok) {
      const updated = await res.json()
      setItems((prev) => prev.map((p) => p.id === updated.id ? updated : p))
      toast(updated.disponible ? `✅ ${item.nom} visible clients` : `🚫 ${item.nom} masquée`)
    } else {
      toast.error('Erreur lors de la mise à jour')
    }
  }

  // ── Open edit modal ──────────────────────────────────────────────────────
  const openEdit = (item: Pizza) => {
    setEditItem(item)
    setEditForm({
      nom:        item.nom,
      desc:       item.desc,
      prix:       String(item.prix),
      categorie:  item.categorie,
      image:      item.image ?? '',
      populaire:  item.populaire ?? false,
      disponible: item.disponible,
    })
  }

  // ── Save edit ────────────────────────────────────────────────────────────
  const saveEdit = async () => {
    if (!editItem) return
    const prix = parseFloat(editForm.prix)
    if (!editForm.nom.trim() || isNaN(prix) || prix <= 0) return toast.error('Données invalides')

    setSaving('edit')
    const res = await fetch(`/api/menu/${editItem.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nom:         editForm.nom.trim(),
        description: editForm.desc.trim(),
        prix,
        categorie:   editForm.categorie,
        image:       editForm.image.trim() || null,
        populaire:   editForm.populaire,
        disponible:  editForm.disponible,
      }),
    })
    setSaving(null)
    if (res.ok) {
      const updated = await res.json()
      setItems((prev) => prev.map((p) => p.id === updated.id ? { ...updated, desc: updated.desc ?? updated.description ?? '' } : p))
      toast.success('Pizza sauvegardée ✓')
      setEditItem(null)
    } else {
      toast.error('Erreur lors de la sauvegarde')
    }
  }

  // ── Delete ───────────────────────────────────────────────────────────────
  const deletePizza = async (item: Pizza) => {
    if (!confirm(`Supprimer "${item.nom}" ? Cette action est irréversible.`)) return
    setSaving(item.id + '-del')
    const res = await fetch(`/api/menu/${item.id}`, { method: 'DELETE' })
    setSaving(null)
    if (res.ok) {
      setItems((prev) => prev.filter((p) => p.id !== item.id))
      toast(`🗑️ ${item.nom} supprimée`)
    } else {
      toast.error('Erreur lors de la suppression')
    }
  }

  // ── Create ───────────────────────────────────────────────────────────────
  const createPizza = async () => {
    const prix = parseFloat(createForm.prix)
    if (!createForm.nom.trim() || isNaN(prix) || prix <= 0 || !createForm.categorie) {
      return toast.error('Nom, prix et catégorie sont obligatoires')
    }
    const id = slugify(createForm.nom)
    setSaving('create')
    const res = await fetch('/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        slug:        id,
        nom:         createForm.nom.trim(),
        description: createForm.desc.trim(),
        prix,
        categorie:   createForm.categorie,
        image:       createForm.image.trim() || null,
        populaire:   createForm.populaire,
        disponible:  createForm.disponible,
      }),
    })
    setSaving(null)
    if (res.ok) {
      const created = await res.json()
      setItems((prev) => [...prev, { ...created, desc: created.desc ?? created.description ?? '' }])
      toast.success(`${createForm.nom} ajoutée ✓`)
      setShowCreate(false)
      setCreateForm(EMPTY_FORM)
    } else {
      const body = await res.json().catch(() => ({}))
      toast.error(body.error ?? 'Erreur lors de la création')
    }
  }

  const visible = filter === 'all' ? items : items.filter((i) => i.categorie === filter)
  const activeCount = items.filter((i) => i.disponible).length

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#fdf6ec' }}>La carte</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6b5040' }}>
            {activeCount} / {items.length} disponibles
          </p>
        </div>
        <button
          onClick={() => { setShowCreate(true); setCreateForm(EMPTY_FORM) }}
          className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
          style={{ backgroundColor: '#d4a843', color: '#1a0e06' }}
        >
          <Plus size={15} /> Ajouter
        </button>
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
                    <tr key={item.id} style={{ backgroundColor: '#1a0e06', borderBottom: '1px solid #2c1a0e', opacity: item.disponible ? 1 : 0.5 }}>
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
                        <span className="font-semibold" style={{ color: '#d4a843' }}>
                          {formatPrix(item.prix)}
                        </span>
                      </td>

                      {/* Toggle disponible */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleDisponible(item)}
                          disabled={saving === item.id + '-toggle'}
                          title={item.disponible ? 'Masquer des clients' : 'Rendre visible'}
                        >
                          {saving === item.id + '-toggle'
                            ? <Loader2 size={24} className="animate-spin" style={{ color: '#6b5040' }} />
                            : item.disponible
                              ? <ToggleRight size={24} style={{ color: '#4ade80' }} />
                              : <ToggleLeft size={24} style={{ color: '#6b5040' }} />
                          }
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-[#2c1a0e]" title="Modifier">
                            <Pencil size={13} style={{ color: '#9a7c4e' }} />
                          </button>
                          <button
                            onClick={() => deletePizza(item)}
                            disabled={saving === item.id + '-del'}
                            className="p-1.5 rounded-lg hover:bg-red-900/30"
                            title="Supprimer"
                          >
                            {saving === item.id + '-del'
                              ? <Loader2 size={13} className="animate-spin" style={{ color: '#f87171' }} />
                              : <Trash2 size={13} style={{ color: '#f87171' }} />
                            }
                          </button>
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

      <p className="text-xs text-center" style={{ color: '#6b5040' }}>
        Le toggle vert/rouge contrôle la visibilité en temps réel côté client
      </p>

      {/* ── EDIT MODAL ─────────────────────────────────────────────────────── */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-lg rounded-2xl overflow-hidden" style={{ backgroundColor: '#1a0e06', border: '1px solid #3a2010' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #3a2010' }}>
              <h2 className="font-bold text-lg" style={{ color: '#fdf6ec' }}>Modifier — {editItem.nom}</h2>
              <button onClick={() => setEditItem(null)} className="p-1 rounded-lg hover:bg-[#2c1a0e]">
                <X size={18} style={{ color: '#9a7c4e' }} />
              </button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <PizzaFormFields form={editForm} onChange={setEditForm} />
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4" style={{ borderTop: '1px solid #3a2010' }}>
              <button onClick={() => setEditItem(null)} className="px-4 py-2 rounded-xl text-sm" style={{ color: '#9a7c4e' }}>
                Annuler
              </button>
              <button
                onClick={saveEdit}
                disabled={saving === 'edit'}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
                style={{ backgroundColor: '#d4a843', color: '#1a0e06' }}
              >
                {saving === 'edit' ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CREATE MODAL ───────────────────────────────────────────────────── */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-lg rounded-2xl overflow-hidden" style={{ backgroundColor: '#1a0e06', border: '1px solid #d4a843' }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #3a2010' }}>
              <h2 className="font-bold text-lg" style={{ color: '#fdf6ec' }}>Nouvelle pizza / article</h2>
              <button onClick={() => setShowCreate(false)} className="p-1 rounded-lg hover:bg-[#2c1a0e]">
                <X size={18} style={{ color: '#9a7c4e' }} />
              </button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <PizzaFormFields form={createForm} onChange={setCreateForm} />
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4" style={{ borderTop: '1px solid #3a2010' }}>
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-xl text-sm" style={{ color: '#9a7c4e' }}>
                Annuler
              </button>
              <button
                onClick={createPizza}
                disabled={saving === 'create'}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
                style={{ backgroundColor: '#d4a843', color: '#1a0e06' }}
              >
                {saving === 'create' ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                Créer
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .pi-input {
          background: #2c1a0e;
          border: 1px solid #4a3020;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          color: #fdf6ec;
          font-size: 0.875rem;
          outline: none;
          width: 100%;
        }
        .pi-input:focus { border-color: #d4a843; }
        .pi-label { font-size: 0.75rem; font-weight: 600; color: #9a7c4e; margin-bottom: 0.25rem; display: block; }
      `}</style>
    </div>
  )
}

function PizzaFormFields({
  form,
  onChange,
}: {
  form: { nom: string; desc: string; prix: string; categorie: MenuCategory; image: string; populaire: boolean; disponible: boolean }
  onChange: (f: typeof form) => void
}) {
  const set = (k: keyof typeof form, v: unknown) => onChange({ ...form, [k]: v })

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="pi-label">Nom *</label>
          <input className="pi-input" value={form.nom} onChange={(e) => set('nom', e.target.value)} placeholder="Ex : Reine" />
        </div>
        <div>
          <label className="pi-label">Prix (€) *</label>
          <input className="pi-input" type="number" step="0.5" min="0" value={form.prix} onChange={(e) => set('prix', e.target.value)} placeholder="13.00" />
        </div>
        <div>
          <label className="pi-label">Catégorie *</label>
          <select
            className="pi-input"
            value={form.categorie}
            onChange={(e) => set('categorie', e.target.value as MenuCategory)}
          >
            <option value="pizza">Pizza</option>
            <option value="incontournable">Incontournable</option>
            <option value="salade">Salade</option>
            <option value="panuzzi">Panuzzi</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="pi-label">Description</label>
          <textarea className="pi-input" rows={2} value={form.desc} onChange={(e) => set('desc', e.target.value)} placeholder="Ingrédients de la pizza…" style={{ resize: 'vertical' }} />
        </div>
        <div className="col-span-2">
          <label className="pi-label">URL image</label>
          <input className="pi-input" value={form.image} onChange={(e) => set('image', e.target.value)} placeholder="/pizza-lescapade-medias/pizzas/..." />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: '#9a7c4e' }}>
          <input type="checkbox" checked={form.populaire} onChange={(e) => set('populaire', e.target.checked)} className="accent-[#d4a843]" />
          Populaire ⭐
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: '#9a7c4e' }}>
          <input type="checkbox" checked={form.disponible} onChange={(e) => set('disponible', e.target.checked)} className="accent-[#4ade80]" />
          Disponible
        </label>
      </div>
    </>
  )
}
