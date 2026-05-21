'use client'
import { useState } from 'react'
import { Edit, Trash2, Plus, AlertCircle } from 'lucide-react'
import { useIngredients } from '@/hooks/useIngredients'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import type { IngredientCategory, IngredientUnit } from '@/types'

export function IngredientList() {
  const { ingredients, loading, create, update, remove } = useIngredients()
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Record<string, any>>({})

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      await create({
        name: formData.get('name') as string,
        category: formData.get('category') as IngredientCategory,
        unit: formData.get('unit') as IngredientUnit,
        purchase_price: parseFloat(formData.get('purchase_price') as string),
        alert_threshold: parseFloat(formData.get('alert_threshold') as string),
        current_quantity: 0,
      })
      setIsAdding(false)
      form.reset()
      toast.success('Ingrédient créé')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur')
    }
  }

  const handleUpdate = async (id: string) => {
    try {
      await update(id, editValues[id])
      setEditingId(null)
      toast.success('Ingrédient modifié')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr ?')) return
    try {
      await remove(id)
      toast.success('Ingrédient supprimé')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur')
    }
  }

  if (loading) {
    return <div style={{ color: '#9a7c4e' }}>Chargement...</div>
  }

  return (
    <div className="space-y-4">
      {/* Bouton Ajouter */}
      <button
        onClick={() => setIsAdding(!isAdding)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
        style={{
          backgroundColor: '#d4a843',
          color: '#2c1a0e',
        }}
      >
        <Plus size={16} />
        Ajouter ingrédient
      </button>

      {/* Formulaire Création */}
      {isAdding && (
        <form
          onSubmit={handleCreate}
          className="p-4 rounded-lg space-y-3"
          style={{ backgroundColor: '#3a2010' }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              name="name"
              placeholder="Nom"
              required
              className="px-3 py-2 rounded text-sm"
              style={{ backgroundColor: '#2c1a0e', color: '#fdf6ec' }}
            />
            <select
              name="category"
              required
              className="px-3 py-2 rounded text-sm"
              style={{ backgroundColor: '#2c1a0e', color: '#fdf6ec' }}
            >
              <option value="">Catégorie</option>
              <option value="vegetables">Légumes</option>
              <option value="cheese">Fromage</option>
              <option value="sauce">Sauce</option>
              <option value="dough">Pâte</option>
              <option value="other">Autre</option>
            </select>
            <select
              name="unit"
              required
              className="px-3 py-2 rounded text-sm"
              style={{ backgroundColor: '#2c1a0e', color: '#fdf6ec' }}
            >
              <option value="">Unité</option>
              <option value="kg">kg</option>
              <option value="L">L</option>
              <option value="u">u</option>
              <option value="g">g</option>
              <option value="ml">ml</option>
            </select>
            <input
              type="number"
              name="purchase_price"
              placeholder="Prix d'achat"
              step="0.01"
              required
              className="px-3 py-2 rounded text-sm"
              style={{ backgroundColor: '#2c1a0e', color: '#fdf6ec' }}
            />
            <input
              type="number"
              name="alert_threshold"
              placeholder="Seuil alerte"
              step="0.1"
              className="px-3 py-2 rounded text-sm"
              style={{ backgroundColor: '#2c1a0e', color: '#fdf6ec' }}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" style={{ backgroundColor: '#d4a843', color: '#2c1a0e' }}>
              Créer
            </Button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-2 rounded text-sm"
              style={{ backgroundColor: '#4a3020', color: '#9a7c4e' }}
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Liste */}
      {ingredients.length === 0 ? (
        <div style={{ color: '#6b5040' }} className="text-center py-8">
          Aucun ingrédient
        </div>
      ) : (
        <div className="space-y-2">
          {ingredients.map((ing) => {
            const isEditing = editingId === ing.id
            const isLowStock = ing.current_quantity < ing.alert_threshold
            return (
              <div
                key={ing.id}
                className="p-4 rounded-lg"
                style={{ backgroundColor: '#2c1a0e', border: '1px solid #4a3020' }}
              >
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      defaultValue={ing.name}
                      onChange={(e) => setEditValues((prev) => ({ ...prev, [ing.id]: { ...prev[ing.id], name: e.target.value } }))}
                      className="w-full px-2 py-1 rounded text-sm"
                      style={{ backgroundColor: '#3a2010', color: '#fdf6ec' }}
                    />
                    <input
                      type="number"
                      defaultValue={ing.current_quantity}
                      step="0.1"
                      onChange={(e) => setEditValues((prev) => ({ ...prev, [ing.id]: { ...prev[ing.id], current_quantity: parseFloat(e.target.value) } }))}
                      className="w-full px-2 py-1 rounded text-sm"
                      style={{ backgroundColor: '#3a2010', color: '#fdf6ec' }}
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleUpdate(ing.id)}
                        size="sm"
                        style={{ backgroundColor: '#d4a843', color: '#2c1a0e' }}
                      >
                        Enregistrer
                      </Button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-2 py-1 rounded text-xs"
                        style={{ backgroundColor: '#4a3020', color: '#9a7c4e' }}
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-semibold flex items-center gap-2" style={{ color: '#fdf6ec' }}>
                        {ing.name}
                        {isLowStock && <AlertCircle size={14} style={{ color: '#f87171' }} />}
                      </div>
                      <div className="text-xs mt-1 space-y-0.5" style={{ color: '#9a7c4e' }}>
                        <div>Stock: {ing.current_quantity} {ing.unit} (seuil: {ing.alert_threshold})</div>
                        <div>Prix: €{ing.purchase_price.toFixed(2)}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingId(ing.id)}
                        className="p-1 rounded hover:bg-[#4a3020]"
                      >
                        <Edit size={14} style={{ color: '#d4a843' }} />
                      </button>
                      <button
                        onClick={() => handleDelete(ing.id)}
                        className="p-1 rounded hover:bg-[#4a3020]"
                      >
                        <Trash2 size={14} style={{ color: '#f87171' }} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
