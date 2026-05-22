import type { Pizza } from '@/types'

// ── 14 allergènes officiels ──────────────────────────────────────────────────
export type AllergenId =
  | 'gluten'
  | 'lait'
  | 'oeuf'
  | 'poisson'
  | 'crustaces'
  | 'fruits-coque'
  | 'arachide'
  | 'soja'
  | 'sesame'
  | 'moutarde'
  | 'celeri'
  | 'sulfites'
  | 'mollusques'
  | 'lupin'

export interface Allergen {
  id: AllergenId
  name: string
  icon: string
  description: string
}

export const ALLERGENS: Record<AllergenId, Allergen> = {
  'gluten':      { id: 'gluten',      name: 'Gluten',         icon: '🌾', description: 'Blé, seigle, orge — pâte, pain' },
  'lait':        { id: 'lait',        name: 'Lait',           icon: '🥛', description: 'Produits laitiers, lactose' },
  'oeuf':        { id: 'oeuf',        name: 'Œuf',            icon: '🥚', description: 'Œuf de poule' },
  'poisson':     { id: 'poisson',     name: 'Poisson',        icon: '🐟', description: 'Anchois, poisson frais ou traité' },
  'crustaces':   { id: 'crustaces',   name: 'Crustacés',      icon: '🦐', description: 'Crevettes, homard, crabe' },
  'fruits-coque':{ id: 'fruits-coque',name: 'Fruits à coque', icon: '🌰', description: 'Noix, pistache, amande, noisette, pignon' },
  'arachide':    { id: 'arachide',    name: 'Arachide',       icon: '🥜', description: 'Cacahuète, beurre de cacahuète' },
  'soja':        { id: 'soja',        name: 'Soja',           icon: '🫘', description: 'Soja, tofu, sauce soja' },
  'sesame':      { id: 'sesame',      name: 'Sésame',         icon: '🌿', description: 'Graines de sésame, tahini' },
  'moutarde':    { id: 'moutarde',    name: 'Moutarde',       icon: '🟡', description: 'Moutarde, graines de moutarde' },
  'celeri':      { id: 'celeri',      name: 'Céleri',         icon: '🌱', description: 'Céleri, jus de céleri' },
  'sulfites':    { id: 'sulfites',    name: 'Sulfites',       icon: '⚗️',  description: 'Charcuterie traitée, vinaigre, vin' },
  'mollusques':  { id: 'mollusques',  name: 'Mollusques',     icon: '🐚', description: 'Moules, huîtres, escargot' },
  'lupin':       { id: 'lupin',       name: 'Lupin',          icon: '🌸', description: 'Farine de lupin' },
}

export const ALLERGEN_ORDER: AllergenId[] = [
  'gluten', 'lait', 'oeuf', 'poisson', 'crustaces', 'fruits-coque',
  'arachide', 'soja', 'sesame', 'moutarde', 'celeri', 'sulfites', 'mollusques', 'lupin',
]

// ── Mapping ingredient (nom normalisé) → allergènes ─────────────────────────
// Clé = nom lowercase, trim
const INGREDIENT_ALLERGENS: Record<string, AllergenId[]> = {
  // Bases neutres
  'sauce tomate':      [],
  'tomate':            [],
  'tomates cerises':   [],
  'tomate fraîche':    [],
  'tomate fraiche':    [],
  'tomates':           [],
  'basilic':           [],
  'basilic frais':     [],
  'origan':            [],
  'olives':            [],
  'ail':               [],
  'oignons':           [],
  'oignon':            [],
  'poivrons':          [],
  'poivron':           [],
  'courgettes':        [],
  'champignons':       [],
  'pieds de champignon': [],
  'roquette':          [],
  'roquette crue':     [],
  'miel':              [],
  'figues':            [],
  'figue':             [],
  'curry':             [],
  'pommes de terre':   [],
  'pignons':           ['fruits-coque'],
  'poulet':            [],
  'poulet grillé':     [],
  'balsamique':        ['sulfites'],
  'crème de balsamique': ['sulfites'],
  'poudre de truffe':  [],
  'sauce truffe noire': [],
  'sauce tartufata noire': [],
  'sauce tartufata':   [],
  'truffe noire':      [],
  'truffe':            [],
  'sauce secrète':     [],
  'pesto':             ['fruits-coque'],  // pignons de pin
  'sauge':             [],
  'stracciatella':     ['lait'],

  // Produits laitiers
  'mozzarella':        ['lait'],
  'mozza di bufala':   ['lait'],
  'crème fraîche':     ['lait'],
  'crème fraiche':     ['lait'],
  'chèvre':            ['lait'],
  'chevre':            ['lait'],
  'parmesan':          ['lait'],
  'gorgonzola':        ['lait'],
  'burrata':           ['lait'],
  'ricotta':           ['lait'],
  'brousse':           ['lait'],
  'reblochon':         ['lait'],
  'crème de parmesan': ['lait'],
  'crème truffe':      ['lait'],
  'toast chèvre chaud': ['gluten', 'lait'],
  'toast':             ['gluten'],

  // Avec gluten
  'croûtons':          ['gluten'],

  // Noix / fruits à coque
  'noix':              ['fruits-coque'],
  'éclats de pistache': ['fruits-coque'],
  'pistache':          ['fruits-coque'],
  'amande':            ['fruits-coque'],
  'noisette':          ['fruits-coque'],

  // Poisson
  'anchois':           ['poisson'],

  // Charcuterie / sulfites
  'jambon blanc':      ['sulfites'],
  'jambon cru':        ['sulfites'],
  'lardons':           ['sulfites'],
  'figatelli':         ['sulfites'],
  'salami piquant':    ['sulfites'],
  'guanciale':         ['sulfites'],
  'viande hachée':     ['sulfites'],

  // Œuf
  'œuf':               ['oeuf'],
  'oeuf':              ['oeuf'],
}

// ── Mapping supplement.id → allergènes ──────────────────────────────────────
const SUPPLEMENT_ALLERGENS: Record<string, AllergenId[]> = {
  'ail':              [],
  'anchois':          ['poisson'],
  'aubergines':       [],
  'basilic':          [],
  'burrata':          ['lait'],
  'champignons':      [],
  'chevre':           ['lait'],
  'creme':            ['lait'],
  'creme-parmesan':   ['lait'],
  'creme-truffe':     ['lait'],
  'figues':           [],
  'gorgonzola':       ['lait'],
  'guanciale':        ['sulfites'],
  'jambon-blanc':     ['sulfites'],
  'jambon-cru':       ['sulfites'],
  'miel':             [],
  'bufala':           ['lait'],
  'noix':             ['fruits-coque'],
  'oeuf':             ['oeuf'],
  'oignons':          [],
  'olives':           [],
  'origan':           [],
  'parmesan':         ['lait'],
  'pesto':            ['fruits-coque'],
  'pieds-champignon': [],
  'pistache':         ['fruits-coque'],
  'poire':            [],
  'poivron':          [],
  'poulet':           [],
  'roquette':         [],
  'roquette-crue':    [],
  'salami-piquant':   ['sulfites'],
  'sauce-secrete':    [],
  'sauge':            [],
  'stracciatella':    ['lait'],
  'tomate-cerise':    [],
  'tomate-fraiche':   [],
  'truffe-noire':     [],
}

// ── Fonction principale ──────────────────────────────────────────────────────
/**
 * Calcule les allergènes pour une pizza avec ses suppléments éventuels.
 * Retourne un tableau trié selon l'ordre officiel des 14 allergènes.
 */
export function getAllergensForItem(
  pizza: Pick<Pizza, 'id' | 'categorie'>,
  selectedSupplementIds: string[] = [],
  defaultIngredients: string[] = [],
): AllergenId[] {
  const result = new Set<AllergenId>()

  // Pâte/pain = gluten pour pizzas, incontournables, panuozzi
  if (pizza.categorie !== 'salade') {
    result.add('gluten')
  }

  // Ingrédients par défaut de la pizza
  for (const ingredient of defaultIngredients) {
    const key = ingredient.toLowerCase().trim()
    const allergens = INGREDIENT_ALLERGENS[key] ?? []
    allergens.forEach((a) => result.add(a))
  }

  // Suppléments sélectionnés
  for (const suppId of selectedSupplementIds) {
    const allergens = SUPPLEMENT_ALLERGENS[suppId] ?? []
    allergens.forEach((a) => result.add(a))
  }

  // Retourner dans l'ordre officiel
  return ALLERGEN_ORDER.filter((id) => result.has(id))
}

/** Retourne la liste complète des objets Allergen pour un item */
export function getAllergenObjects(allergenIds: AllergenId[]): Allergen[] {
  return allergenIds.map((id) => ALLERGENS[id])
}

/** Retourne les noms en français séparés par des virgules */
export function formatAllergenNames(allergenIds: AllergenId[]): string {
  return allergenIds.map((id) => ALLERGENS[id].name).join(', ')
}
