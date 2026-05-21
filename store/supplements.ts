import type { PizzaSize } from '@/types'

export const PIZZA_SIZES: Record<PizzaSize, { label: string; surcoût: number }> = {
  '24cm': { label: '24 cm', surcoût: 0 },
  '30cm': { label: '30 cm', surcoût: 3 },
  '36cm': { label: '36 cm', surcoût: 6 },
}

export const DEFAULT_SIZE: PizzaSize = '24cm'

export interface Supplement {
  id: string
  name: string
  price: number
}

export const SUPPLEMENTS: Supplement[] = [
  { id: 'ail',            name: 'Ail',                    price: 0.50 },
  { id: 'mozza-fior',     name: 'Mozza fior di latte',    price: 0.50 },
  { id: 'anchois',        name: 'Anchois',                price: 1.00 },
  { id: 'aubergines',     name: 'Aubergines',             price: 0.50 },
  { id: 'basilic',        name: 'Basilic',                price: 0.50 },
  { id: 'burrata',        name: 'Burrata',                price: 3.50 },
  { id: 'champignons',    name: 'Champignons',            price: 0.50 },
  { id: 'creme-parmesan', name: 'Crème de parmesan',      price: 0.50 },
  { id: 'pistache',       name: 'Éclats de pistache',     price: 0.50 },
  { id: 'guanciale',      name: 'Guanciale',              price: 1.50 },
  { id: 'jambon',         name: 'Jambon',                 price: 1.00 },
  { id: 'miel',           name: 'Miel',                   price: 0.50 },
  { id: 'bufala',         name: 'Mozza di bufala',        price: 2.50 },
  { id: 'oignons',        name: 'Oignons',                price: 0.50 },
  { id: 'parmesan',       name: 'Parmesan',               price: 0.50 },
  { id: 'roquette',       name: 'Roquette',               price: 0.50 },
  { id: 'truffe',         name: 'Truffe',                 price: 2.50 },
  { id: 'viande-hachee',  name: 'Viande hachée',          price: 2.50 },
]

export const SUPPLEMENT_MAP = Object.fromEntries(
  SUPPLEMENTS.map((s) => [s.id, s])
) as Record<string, Supplement>

// Ingrédients par défaut pour chaque pizza (pour la personnalisation "retirer X")
export const PIZZA_DEFAULT_INGREDIENTS: Record<string, string[]> = {
  marguerite:    ['Sauce tomate', 'Mozzarella', 'Olives', 'Origan'],
  napolitaine:   ['Sauce tomate', 'Anchois', 'Olives'],
  'jambon-mozza':['Sauce tomate', 'Jambon blanc', 'Mozzarella', 'Olives', 'Origan'],
  alsacienne:    ['Crème fraîche', 'Lardons', 'Oignons'],
  reine:         ['Sauce tomate', 'Jambon blanc', 'Champignons', 'Mozzarella', 'Olives', 'Origan'],
  '4-fromages':  ['Sauce tomate', 'Emmental', 'Mozzarella', 'Chèvre', 'Roquefort', 'Olives'],
  saumon:        ['Crème fraîche', 'Saumon', 'Aneth', 'Mozzarella'],
  andalouse:     ['Sauce tomate', 'Poivrons', 'Oignons', 'Chorizo', 'Mozzarella', 'Olives', 'Origan'],
  bolognaise:    ['Sauce tomate', 'Poivrons', 'Oignons', 'Viande hachée', 'Mozzarella', 'Olives', 'Origan'],
  corsica:       ['Sauce tomate', 'Mozzarella', 'Figatelli', 'Brousse', 'Olives', 'Origan'],
  vegetarienne:  ['Sauce tomate', 'Courgettes', 'Poivrons', 'Oignons', 'Champignons', 'Mozzarella', 'Olives', 'Origan'],
  'poulet-curry':['Crème fraîche', 'Poulet', 'Oignons', 'Mozzarella', 'Curry'],
  'chevre-miel': ['Crème fraîche', 'Chèvre', 'Miel', 'Pignons'],
  parma:         ['Sauce tomate', 'Mozzarella', 'Jambon cru', 'Parmesan', 'Roquette', 'Olives', 'Origan', 'Pesto', 'Crème de balsamique'],
  italienne:     ['Sauce tomate', 'Mozzarella', 'Salade', 'Mozza di bufala', 'Tomates séchées', 'Pesto', 'Crème de balsamique'],
  savoyarde:     ['Crème fraîche', 'Oignons', 'Pommes de terre', 'Reblochon', 'Mozzarella'],
  tartufo:       ['Crème fraîche', 'Sauce tartufata', 'Mozzarella', 'Jambon blanc', 'Burrata'],
}

export function computePrice(
  basePrice: number,
  size: PizzaSize,
  supplements: string[]
): number {
  const sizeCost = PIZZA_SIZES[size].surcoût
  const suppCost = supplements.reduce((sum, id) => sum + (SUPPLEMENT_MAP[id]?.price ?? 0), 0)
  return basePrice + sizeCost + suppCost
}

export function customizationSummary(
  size: PizzaSize,
  removedIngredients: string[],
  supplements: string[]
): string {
  const parts: string[] = [PIZZA_SIZES[size].label]
  if (removedIngredients.length > 0) {
    parts.push(`sans ${removedIngredients.join(', ')}`)
  }
  if (supplements.length > 0) {
    const names = supplements.map((id) => SUPPLEMENT_MAP[id]?.name ?? id)
    parts.push(`+ ${names.join(', ')}`)
  }
  return parts.join(' · ')
}
