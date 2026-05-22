import type { Pizza } from '@/types'

const P = '/pizza-lescapade-medias/pizzas'
const I = '/images'

export const MENU_ITEMS: Pizza[] = [

  // ══════════════════════════════════════════════════════════
  // PIZZAS (14)
  // ══════════════════════════════════════════════════════════
  {
    id: 'margherite', slug: 'margherite',
    nom: 'Margherite',
    desc: 'Sauce tomate, mozzarella, basilic frais',
    prix: 12, categorie: 'pizza', disponible: true,
    image: `${P}/pizza-coeur.jpg`,
  },
  {
    id: 'napolitaine', slug: 'napolitaine',
    nom: 'Napolitaine',
    desc: 'Sauce tomate, mozzarella, anchois, olives, origan',
    prix: 13, categorie: 'pizza', disponible: true,
    image: `${P}/pizza-roquette-crue.jpg`,
  },
  {
    id: 'reine', slug: 'reine',
    nom: 'Reine',
    desc: 'Sauce tomate, jambon blanc, champignons, mozzarella, olives, origan',
    prix: 13, categorie: 'pizza', disponible: true,
    image: `${P}/pizza-parma-detail.jpg`,
  },
  {
    id: 'alsacienne', slug: 'alsacienne',
    nom: 'Alsacienne',
    desc: 'Crème fraîche, lardons, oignons, mozzarella',
    prix: 14, categorie: 'pizza', disponible: true,
    image: `${P}/pizza-jambon-burrata-2.jpg`,
  },
  {
    id: 'royale', slug: 'royale',
    nom: 'Royale',
    desc: 'Sauce tomate, mozzarella, jambon blanc, jambon cru, champignons, olives',
    prix: 14, categorie: 'pizza', disponible: true,
    image: `${I}/pizza-viande-hachee-sauce.png`,
  },
  {
    id: '4-fromages', slug: '4-fromages',
    nom: '4 Fromages',
    desc: 'Sauce tomate, mozzarella, chèvre, gorgonzola, parmesan, olives',
    prix: 15, categorie: 'pizza', disponible: true,
    image: `${P}/pizza-4-fromages.jpg`,
  },
  {
    id: 'corsica', slug: 'corsica',
    nom: 'Corsica',
    desc: 'Sauce tomate, mozzarella, figatelli, brousse, olives, origan',
    prix: 15, categorie: 'pizza', disponible: true,
    image: `${I}/pizza-blanche-jambon-truffe.png`,
  },
  {
    id: 'andalouse', slug: 'andalouse',
    nom: 'Andalouse',
    desc: 'Sauce tomate, poivrons, oignons, salami piquant, mozzarella, olives, origan',
    prix: 15, categorie: 'pizza', disponible: true,
    image: `${P}/pizza-fleurs-roquette.jpg`,
  },
  {
    id: 'bolognaise', slug: 'bolognaise',
    nom: 'Bolognaise',
    desc: 'Sauce tomate, viande hachée, poivrons, oignons, mozzarella, olives, origan',
    prix: 15, categorie: 'pizza', disponible: true,
    image: `${P}/duo-pizzas-table.jpg`,
  },
  {
    id: 'vegetarienne', slug: 'vegetarienne',
    nom: 'Végétarienne',
    desc: 'Sauce tomate, courgettes, poivrons, oignons, champignons, mozzarella, olives',
    prix: 14, categorie: 'pizza', disponible: true,
    image: `${P}/pizza-fleurs-planche.jpg`,
  },
  {
    id: 'chevre-miel', slug: 'chevre-miel',
    nom: 'Chèvre Miel',
    desc: 'Crème fraîche, chèvre, miel, pignons, noix',
    prix: 15, categorie: 'pizza', disponible: true,
    image: `${P}/pizza-figue-chevre.jpg`,
  },
  {
    id: 'poulet-curry', slug: 'poulet-curry',
    nom: 'Poulet Curry',
    desc: 'Crème fraîche, poulet, oignons, mozzarella, curry',
    prix: 16, categorie: 'pizza', disponible: true,
    image: `${I}/pizza-blanche-jambon-burrata-truffe.png`,
  },
  {
    id: 'savoyarde', slug: 'savoyarde',
    nom: 'Savoyarde',
    desc: 'Crème fraîche, lardons, oignons, pommes de terre, reblochon, mozzarella',
    prix: 18, categorie: 'pizza', disponible: true,
  },
  {
    id: 'italienne', slug: 'italienne',
    nom: "L'Italienne",
    desc: 'Sauce tomate, mozzarella, mozza di bufala, tomates cerises, roquette, pesto, balsamique',
    prix: 15, categorie: 'pizza', disponible: true,
    image: `${P}/pizza-salade-fleurs.jpg`,
  },

  // ══════════════════════════════════════════════════════════
  // INCONTOURNABLES (3)
  // ══════════════════════════════════════════════════════════
  {
    id: 'parma', slug: 'parma',
    nom: 'Parma',
    desc: 'Sauce tomate, mozzarella, roquette, jambon cru, parmesan, tomates cerises, pesto, balsamique',
    prix: 18, categorie: 'incontournable', disponible: true, populaire: true,
    image: `${P}/pizza-parma.jpg`,
  },
  {
    id: 'truffe', slug: 'truffe',
    nom: 'Truffe',
    desc: 'Crème fraîche, mozzarella, sauce truffe noire, jambon blanc, burrata, poudre de truffe',
    prix: 22, categorie: 'incontournable', disponible: true, populaire: true,
    image: `${P}/pizza-truffe-burrata.jpg`,
  },
  {
    id: 'jambon-burrata', slug: 'jambon-burrata',
    nom: 'Jambon Burrata',
    desc: 'Crème fraîche, jambon blanc, burrata, sauce tartufata noire, mozzarella',
    prix: 20, categorie: 'incontournable', disponible: true,
    image: `${P}/pizza-jambon-burrata.jpg`,
  },

  // ══════════════════════════════════════════════════════════
  // SALADES (3)
  // ══════════════════════════════════════════════════════════
  {
    id: 'dolce-vita', slug: 'dolce-vita',
    nom: 'Dolce Vita',
    desc: 'Roquette, stracciatella, tomates cerises, pesto, crème de balsamique',
    prix: 14, categorie: 'salade', disponible: true,
  },
  {
    id: 'chevre-chaud', slug: 'chevre-chaud',
    nom: 'Chèvre Chaud',
    desc: 'Roquette, toast chèvre chaud, tomates cerises, miel, crème de balsamique',
    prix: 15, categorie: 'salade', disponible: true,
  },
  {
    id: 'facon-cesar', slug: 'facon-cesar',
    nom: 'Façon César',
    desc: 'Roquette, poulet grillé, parmesan, tomates cerises, croûtons, sauce secrète',
    prix: 15, categorie: 'salade', disponible: true,
  },

  // ══════════════════════════════════════════════════════════
  // PANUOZZI (4)
  // ══════════════════════════════════════════════════════════
  {
    id: 'litalien', slug: 'litalien',
    nom: "L'Italien ++",
    desc: 'Pesto, mozzarella, tomate, roquette, stracciatella',
    prix: 11, categorie: 'panuzzi', disponible: true,
  },
  {
    id: 'lindien', slug: 'lindien',
    nom: "L'Indien",
    desc: 'Crème fraîche, curry, poulet, mozzarella',
    prix: 8, categorie: 'panuzzi', disponible: true,
  },
  {
    id: 'le-berger', slug: 'le-berger',
    nom: 'Le Berger',
    desc: 'Crème fraîche, chèvre, miel, figues, noix, jambon cru',
    prix: 10, categorie: 'panuzzi', disponible: true,
  },
  {
    id: 'le-classique', slug: 'le-classique',
    nom: 'Le Classique',
    desc: 'Sauce tomate, mozzarella, jambon blanc, olives',
    prix: 9, categorie: 'panuzzi', disponible: true,
  },
]

// Backward-compat alias
export const PIZZAS = MENU_ITEMS

export const CATEGORIES = {
  pizza:          'Pizzas',
  incontournable: 'Incontournables',
  salade:         'Salades',
  panuzzi:        'Panuozzi',
} as const
