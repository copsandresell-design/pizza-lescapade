export type GalleryCategory = 'lieu' | 'ambiance' | 'pizzas' | 'savoir-faire' | 'planches'

export interface GalleryPhoto {
  src: string
  alt: string
  category: GalleryCategory
  width: number
  height: number
}

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  // Lieu
  { src: '/pizza-lescapade-medias/lieu/entree-enseigne.jpg', alt: 'Entrée et enseigne', category: 'lieu', width: 4, height: 3 },
  { src: '/pizza-lescapade-medias/lieu/terrasse-jardin.jpg', alt: 'Terrasse et jardin', category: 'lieu', width: 4, height: 3 },
  { src: '/pizza-lescapade-medias/lieu/tables-rondins-jour.jpg', alt: 'Tables sur rondins en terrasse', category: 'lieu', width: 3, height: 4 },
  { src: '/pizza-lescapade-medias/lieu/bar-terrasse-jour.jpg', alt: 'Bar en terrasse le jour', category: 'lieu', width: 4, height: 3 },
  { src: '/pizza-lescapade-medias/lieu/bar-sous-tonnelle.jpg', alt: 'Bar sous la tonnelle', category: 'lieu', width: 4, height: 3 },
  { src: '/pizza-lescapade-medias/lieu/jardin-lavande.jpg', alt: 'Jardin et lavande', category: 'lieu', width: 3, height: 4 },
  { src: '/pizza-lescapade-medias/lieu/salon-cosy.jpg', alt: 'Salon cosy intérieur', category: 'lieu', width: 4, height: 3 },
  { src: '/pizza-lescapade-medias/lieu/salon-feu-jour.jpg', alt: 'Salon avec cheminée', category: 'lieu', width: 4, height: 3 },
  { src: '/pizza-lescapade-medias/lieu/coin-feu-detente.jpg', alt: 'Coin détente autour du feu', category: 'lieu', width: 3, height: 4 },
  // Ambiance soir
  { src: '/pizza-lescapade-medias/ambiance-soir/guirlandes-nuit-1.jpg', alt: 'Guirlandes lumineuses la nuit', category: 'ambiance', width: 3, height: 4 },
  { src: '/pizza-lescapade-medias/ambiance-soir/guirlandes-nuit-2.jpg', alt: 'Guirlandes la nuit (vue 2)', category: 'ambiance', width: 4, height: 3 },
  { src: '/pizza-lescapade-medias/ambiance-soir/guirlandes-tables-soir.jpg', alt: 'Tables illuminées le soir', category: 'ambiance', width: 4, height: 3 },
  { src: '/pizza-lescapade-medias/ambiance-soir/terrasse-illuminee-soir.jpg', alt: 'Terrasse illuminée en soirée', category: 'ambiance', width: 4, height: 3 },
  { src: '/pizza-lescapade-medias/ambiance-soir/lampe-ambiance-soir.jpg', alt: 'Lampe et ambiance de soirée', category: 'ambiance', width: 3, height: 4 },
  { src: '/pizza-lescapade-medias/ambiance-soir/soiree-clients.jpg', alt: 'Soirée avec les clients', category: 'ambiance', width: 4, height: 3 },
  { src: '/pizza-lescapade-medias/ambiance-soir/concert-live-1.jpg', alt: 'Concert live (1)', category: 'ambiance', width: 4, height: 3 },
  { src: '/pizza-lescapade-medias/ambiance-soir/concert-live-2.jpg', alt: 'Concert live (2)', category: 'ambiance', width: 4, height: 3 },
  // Pizzas
  { src: '/pizza-lescapade-medias/pizzas/pizza-truffe-burrata.jpg', alt: 'Pizza truffe et burrata', category: 'pizzas', width: 4, height: 3 },
  { src: '/pizza-lescapade-medias/pizzas/pizza-parma.jpg', alt: 'Pizza Parma', category: 'pizzas', width: 4, height: 3 },
  { src: '/pizza-lescapade-medias/pizzas/pizza-parma-detail.jpg', alt: 'Pizza Parma (détail)', category: 'pizzas', width: 3, height: 4 },
  { src: '/pizza-lescapade-medias/pizzas/pizza-jambon-burrata.jpg', alt: 'Pizza jambon burrata', category: 'pizzas', width: 4, height: 3 },
  { src: '/pizza-lescapade-medias/pizzas/pizza-jambon-burrata-2.jpg', alt: 'Pizza jambon burrata (vue 2)', category: 'pizzas', width: 4, height: 3 },
  { src: '/pizza-lescapade-medias/pizzas/pizza-4-fromages.jpg', alt: 'Pizza 4 fromages', category: 'pizzas', width: 4, height: 3 },
  { src: '/pizza-lescapade-medias/pizzas/pizza-figue-chevre.jpg', alt: 'Pizza figue et chèvre', category: 'pizzas', width: 3, height: 4 },
  { src: '/pizza-lescapade-medias/pizzas/pizza-coeur.jpg', alt: 'Pizza en forme de cœur', category: 'pizzas', width: 3, height: 4 },
  { src: '/pizza-lescapade-medias/pizzas/pizza-roquette-crue.jpg', alt: 'Pizza roquette crue', category: 'pizzas', width: 4, height: 3 },
  { src: '/pizza-lescapade-medias/pizzas/pizza-salade-fleurs.jpg', alt: 'Pizza salade et fleurs', category: 'pizzas', width: 4, height: 3 },
  { src: '/pizza-lescapade-medias/pizzas/pizza-fleurs-roquette.jpg', alt: 'Pizza fleurs et roquette', category: 'pizzas', width: 4, height: 3 },
  { src: '/pizza-lescapade-medias/pizzas/pizza-fleurs-planche.jpg', alt: 'Pizza sur planche fleurie', category: 'pizzas', width: 3, height: 4 },
  { src: '/pizza-lescapade-medias/pizzas/duo-pizzas-table.jpg', alt: 'Duo de pizzas sur la table', category: 'pizzas', width: 4, height: 3 },
  // Savoir-faire
  { src: '/pizza-lescapade-medias/savoir-faire/patons-nature.jpg', alt: 'Pâtons nature prêts à lever', category: 'savoir-faire', width: 4, height: 3 },
  { src: '/pizza-lescapade-medias/savoir-faire/patons-basilic.jpg', alt: 'Pâtons avec feuilles de basilic', category: 'savoir-faire', width: 4, height: 3 },
  { src: '/pizza-lescapade-medias/savoir-faire/patons-olive.jpg', alt: 'Pâtons aux olives', category: 'savoir-faire', width: 4, height: 3 },
  { src: '/pizza-lescapade-medias/savoir-faire/paton-etalage.jpg', alt: 'Étalage du pâton à la main', category: 'savoir-faire', width: 3, height: 4 },
  { src: '/pizza-lescapade-medias/savoir-faire/pate-etalee.jpg', alt: 'Pâte étalée prête à garnir', category: 'savoir-faire', width: 4, height: 3 },
  { src: '/pizza-lescapade-medias/savoir-faire/pate-basilic-etalee.jpg', alt: 'Pâte étalée avec basilic', category: 'savoir-faire', width: 4, height: 3 },
  // Planches
  { src: '/pizza-lescapade-medias/planches/planche-apero-1.jpg', alt: 'Planche apéro (1)', category: 'planches', width: 4, height: 3 },
  { src: '/pizza-lescapade-medias/planches/planche-apero-2.jpg', alt: 'Planche apéro (2)', category: 'planches', width: 4, height: 3 },
  { src: '/pizza-lescapade-medias/planches/planche-apero-3.jpg', alt: 'Planche apéro (3)', category: 'planches', width: 3, height: 4 },
  { src: '/pizza-lescapade-medias/planches/grande-salade.jpg', alt: 'Grande salade maison', category: 'planches', width: 4, height: 3 },
]

export const GALLERY_FILTERS: { key: GalleryCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'Tout voir' },
  { key: 'lieu', label: 'Le lieu' },
  { key: 'ambiance', label: "L'ambiance" },
  { key: 'pizzas', label: 'Nos pizzas' },
  { key: 'savoir-faire', label: 'Savoir-faire' },
  { key: 'planches', label: 'À partager' },
]
