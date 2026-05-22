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
  { id: 'ail',              name: 'Ail',                  price: 0.50 },
  { id: 'anchois',          name: 'Anchois',              price: 1.00 },
  { id: 'aubergines',       name: 'Aubergines',           price: 0.50 },
  { id: 'basilic',          name: 'Basilic',              price: 0.50 },
  { id: 'burrata',          name: 'Burrata',              price: 3.50 },
  { id: 'champignons',      name: 'Champignons',          price: 0.50 },
  { id: 'chevre',           name: 'Chèvre',               price: 1.00 },
  { id: 'creme',            name: 'Crème fraîche',        price: 0.50 },
  { id: 'creme-parmesan',   name: 'Crème de parmesan',    price: 0.50 },
  { id: 'creme-truffe',     name: 'Crème truffe',         price: 2.00 },
  { id: 'figues',           name: 'Figues',               price: 1.00 },
  { id: 'gorgonzola',       name: 'Gorgonzola',           price: 1.00 },
  { id: 'guanciale',        name: 'Guanciale',            price: 1.50 },
  { id: 'jambon-blanc',     name: 'Jambon blanc',         price: 1.00 },
  { id: 'jambon-cru',       name: 'Jambon cru',           price: 1.00 },
  { id: 'miel',             name: 'Miel',                 price: 0.50 },
  { id: 'bufala',           name: 'Mozza di bufala',      price: 2.50 },
  { id: 'noix',             name: 'Noix',                 price: 0.50 },
  { id: 'oeuf',             name: 'Œuf',                  price: 0.50 },
  { id: 'oignons',          name: 'Oignons',              price: 0.50 },
  { id: 'olives',           name: 'Olives',               price: 0.50 },
  { id: 'origan',           name: 'Origan',               price: 0.50 },
  { id: 'parmesan',         name: 'Parmesan',             price: 0.50 },
  { id: 'pesto',            name: 'Pesto',                price: 0.50 },
  { id: 'pieds-champignon', name: 'Pieds de champignon',  price: 0.50 },
  { id: 'pistache',         name: 'Éclats de pistache',   price: 0.50 },
  { id: 'poire',            name: 'Poire',                price: 0.50 },
  { id: 'poivron',          name: 'Poivron',              price: 0.50 },
  { id: 'poulet',           name: 'Poulet',               price: 1.00 },
  { id: 'roquette',         name: 'Roquette',             price: 0.50 },
  { id: 'roquette-crue',    name: 'Roquette crue',        price: 0.50 },
  { id: 'salami-piquant',   name: 'Salami piquant',       price: 1.50 },
  { id: 'sauce-secrete',    name: 'Sauce secrète',        price: 0.50 },
  { id: 'sauge',            name: 'Sauge',                price: 0.50 },
  { id: 'stracciatella',    name: 'Stracciatella',        price: 1.00 },
  { id: 'tomate-cerise',    name: 'Tomates cerises',      price: 0.50 },
  { id: 'tomate-fraiche',   name: 'Tomate fraîche',       price: 0.50 },
  { id: 'truffe-noire',     name: 'Truffe noire',         price: 2.50 },
]

export const SUPPLEMENT_MAP = Object.fromEntries(
  SUPPLEMENTS.map((s) => [s.id, s])
) as Record<string, Supplement>

export const PIZZA_DEFAULT_INGREDIENTS: Record<string, string[]> = {
  // Pizzas
  margherite:      ['Sauce tomate', 'Mozzarella', 'Basilic frais'],
  napolitaine:     ['Sauce tomate', 'Mozzarella', 'Anchois', 'Olives', 'Origan'],
  reine:           ['Sauce tomate', 'Jambon blanc', 'Champignons', 'Mozzarella', 'Olives', 'Origan'],
  alsacienne:      ['Crème fraîche', 'Lardons', 'Oignons', 'Mozzarella'],
  royale:          ['Sauce tomate', 'Mozzarella', 'Jambon blanc', 'Jambon cru', 'Champignons', 'Olives'],
  '4-fromages':    ['Sauce tomate', 'Mozzarella', 'Chèvre', 'Gorgonzola', 'Parmesan', 'Olives'],
  corsica:         ['Sauce tomate', 'Mozzarella', 'Figatelli', 'Brousse', 'Olives', 'Origan'],
  andalouse:       ['Sauce tomate', 'Poivrons', 'Oignons', 'Salami piquant', 'Mozzarella', 'Olives', 'Origan'],
  bolognaise:      ['Sauce tomate', 'Viande hachée', 'Poivrons', 'Oignons', 'Mozzarella', 'Olives', 'Origan'],
  vegetarienne:    ['Sauce tomate', 'Courgettes', 'Poivrons', 'Oignons', 'Champignons', 'Mozzarella', 'Olives'],
  'chevre-miel':   ['Crème fraîche', 'Chèvre', 'Miel', 'Pignons', 'Noix'],
  'poulet-curry':  ['Crème fraîche', 'Poulet', 'Oignons', 'Mozzarella', 'Curry'],
  savoyarde:       ['Crème fraîche', 'Lardons', 'Oignons', 'Pommes de terre', 'Reblochon', 'Mozzarella'],
  italienne:       ['Sauce tomate', 'Mozzarella', 'Mozza di bufala', 'Tomates cerises', 'Roquette', 'Pesto', 'Balsamique'],
  // Incontournables
  parma:           ['Sauce tomate', 'Mozzarella', 'Roquette', 'Jambon cru', 'Parmesan', 'Tomates cerises', 'Pesto', 'Balsamique'],
  truffe:          ['Crème fraîche', 'Mozzarella', 'Sauce truffe noire', 'Jambon blanc', 'Burrata', 'Poudre de truffe'],
  'jambon-burrata':['Crème fraîche', 'Jambon blanc', 'Burrata', 'Sauce tartufata', 'Mozzarella'],
  // Legacy aliases
  'chevre-chaud':  [],
  'dolce-vita':    [],
  'facon-cesar':   [],
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
