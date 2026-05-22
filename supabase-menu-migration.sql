-- ============================================================================
-- MIGRATION: Menu — Tables pizzas + supplements
-- À exécuter dans Supabase Dashboard > SQL Editor
-- ============================================================================

-- ── TABLE PIZZAS ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pizzas (
  id          TEXT PRIMARY KEY,
  slug        TEXT NOT NULL,
  nom         TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  prix        DECIMAL(6,2) NOT NULL,
  categorie   TEXT NOT NULL CHECK (categorie IN ('pizza','incontournable','salade','panuzzi')),
  disponible  BOOLEAN NOT NULL DEFAULT true,
  image       TEXT,
  populaire   BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pizzas_categorie   ON pizzas(categorie);
CREATE INDEX IF NOT EXISTS idx_pizzas_disponible  ON pizzas(disponible);

-- ── TABLE SUPPLEMENTS ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS supplements (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  price      DECIMAL(6,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── RLS ──────────────────────────────────────────────────────────────────────
ALTER TABLE pizzas      ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplements ENABLE ROW LEVEL SECURITY;

-- Les clients peuvent lire les pizzas disponibles (via API route ou direct)
CREATE POLICY "public_read_available_pizzas" ON pizzas
  FOR SELECT USING (disponible = true);

-- Les API routes utilisent service_role qui bypass RLS — pas besoin de policies admin

-- ── SEED — PIZZAS ────────────────────────────────────────────────────────────
INSERT INTO pizzas (id, slug, nom, description, prix, categorie, disponible, image, populaire) VALUES
  ('margherite',    'margherite',    'Margherite',    'Sauce tomate, mozzarella, basilic frais',                                                            12, 'pizza',          true,  '/pizza-lescapade-medias/pizzas/pizza-coeur.jpg',             false),
  ('napolitaine',   'napolitaine',   'Napolitaine',   'Sauce tomate, mozzarella, anchois, olives, origan',                                                  13, 'pizza',          true,  '/pizza-lescapade-medias/pizzas/pizza-roquette-crue.jpg',      false),
  ('reine',         'reine',         'Reine',         'Sauce tomate, jambon blanc, champignons, mozzarella, olives, origan',                                 13, 'pizza',          true,  '/pizza-lescapade-medias/pizzas/pizza-parma-detail.jpg',       false),
  ('alsacienne',    'alsacienne',    'Alsacienne',    'Crème fraîche, lardons, oignons, mozzarella',                                                         14, 'pizza',          true,  '/pizza-lescapade-medias/pizzas/pizza-jambon-burrata-2.jpg',   false),
  ('royale',        'royale',        'Royale',        'Sauce tomate, mozzarella, jambon blanc, jambon cru, champignons, olives',                             14, 'pizza',          true,  '/images/pizza-viande-hachee-sauce.png',                       false),
  ('4-fromages',    '4-fromages',    '4 Fromages',    'Sauce tomate, mozzarella, chèvre, gorgonzola, parmesan, olives',                                      15, 'pizza',          true,  '/pizza-lescapade-medias/pizzas/pizza-4-fromages.jpg',         false),
  ('corsica',       'corsica',       'Corsica',       'Sauce tomate, mozzarella, figatelli, brousse, olives, origan',                                        15, 'pizza',          true,  '/images/pizza-blanche-jambon-truffe.png',                     false),
  ('andalouse',     'andalouse',     'Andalouse',     'Sauce tomate, poivrons, oignons, salami piquant, mozzarella, olives, origan',                         15, 'pizza',          true,  '/pizza-lescapade-medias/pizzas/pizza-fleurs-roquette.jpg',    false),
  ('bolognaise',    'bolognaise',    'Bolognaise',    'Sauce tomate, viande hachée, poivrons, oignons, mozzarella, olives, origan',                          15, 'pizza',          true,  '/pizza-lescapade-medias/pizzas/duo-pizzas-table.jpg',         false),
  ('vegetarienne',  'vegetarienne',  'Végétarienne',  'Sauce tomate, courgettes, poivrons, oignons, champignons, mozzarella, olives',                        14, 'pizza',          true,  '/pizza-lescapade-medias/pizzas/pizza-fleurs-planche.jpg',     false),
  ('chevre-miel',   'chevre-miel',   'Chèvre Miel',   'Crème fraîche, chèvre, miel, pignons, noix',                                                          15, 'pizza',          true,  '/pizza-lescapade-medias/pizzas/pizza-figue-chevre.jpg',       false),
  ('poulet-curry',  'poulet-curry',  'Poulet Curry',  'Crème fraîche, poulet, oignons, mozzarella, curry',                                                   16, 'pizza',          true,  '/images/pizza-blanche-jambon-burrata-truffe.png',             false),
  ('savoyarde',     'savoyarde',     'Savoyarde',     'Crème fraîche, lardons, oignons, pommes de terre, reblochon, mozzarella',                             18, 'pizza',          true,  null,                                                          false),
  ('italienne',     'italienne',     'L''Italienne',  'Sauce tomate, mozzarella, mozza di bufala, tomates cerises, roquette, pesto, balsamique',              15, 'pizza',          true,  '/pizza-lescapade-medias/pizzas/pizza-salade-fleurs.jpg',      false),
  ('parma',         'parma',         'Parma',         'Sauce tomate, mozzarella, roquette, jambon cru, parmesan, tomates cerises, pesto, balsamique',         18, 'incontournable', true,  '/pizza-lescapade-medias/pizzas/pizza-parma.jpg',              true),
  ('truffe',        'truffe',        'Truffe',        'Crème fraîche, mozzarella, sauce truffe noire, jambon blanc, burrata, poudre de truffe',               22, 'incontournable', true,  '/pizza-lescapade-medias/pizzas/pizza-truffe-burrata.jpg',     true),
  ('jambon-burrata','jambon-burrata','Jambon Burrata', 'Crème fraîche, jambon blanc, burrata, sauce tartufata noire, mozzarella',                             20, 'incontournable', true,  '/pizza-lescapade-medias/pizzas/pizza-jambon-burrata.jpg',     false),
  ('dolce-vita',    'dolce-vita',    'Dolce Vita',    'Roquette, stracciatella, tomates cerises, pesto, crème de balsamique',                                 14, 'salade',         true,  null,                                                          false),
  ('chevre-chaud',  'chevre-chaud',  'Chèvre Chaud',  'Roquette, toast chèvre chaud, tomates cerises, miel, crème de balsamique',                            15, 'salade',         true,  null,                                                          false),
  ('facon-cesar',   'facon-cesar',   'Façon César',   'Roquette, poulet grillé, parmesan, tomates cerises, croûtons, sauce secrète',                          15, 'salade',         true,  null,                                                          false),
  ('litalien',      'litalien',      'L''Italien ++', 'Pesto, mozzarella, tomate, roquette, stracciatella',                                                   11, 'panuzzi',        true,  null,                                                          false),
  ('lindien',       'lindien',       'L''Indien',     'Crème fraîche, curry, poulet, mozzarella',                                                              8, 'panuzzi',        true,  null,                                                          false),
  ('le-berger',     'le-berger',     'Le Berger',     'Crème fraîche, chèvre, miel, figues, noix, jambon cru',                                               10, 'panuzzi',        true,  null,                                                          false),
  ('le-classique',  'le-classique',  'Le Classique',  'Sauce tomate, mozzarella, jambon blanc, olives',                                                        9, 'panuzzi',        true,  null,                                                          false)
ON CONFLICT (id) DO NOTHING;

-- ── SEED — SUPPLEMENTS ───────────────────────────────────────────────────────
INSERT INTO supplements (id, name, price) VALUES
  ('ail',              'Ail',                 0.50),
  ('anchois',          'Anchois',             1.00),
  ('aubergines',       'Aubergines',          0.50),
  ('basilic',          'Basilic',             0.50),
  ('burrata',          'Burrata',             3.50),
  ('champignons',      'Champignons',         0.50),
  ('chevre',           'Chèvre',              1.00),
  ('creme',            'Crème fraîche',       0.50),
  ('creme-parmesan',   'Crème de parmesan',   0.50),
  ('creme-truffe',     'Crème truffe',        2.00),
  ('figues',           'Figues',              1.00),
  ('gorgonzola',       'Gorgonzola',          1.00),
  ('guanciale',        'Guanciale',           1.50),
  ('jambon-blanc',     'Jambon blanc',        1.00),
  ('jambon-cru',       'Jambon cru',          1.00),
  ('miel',             'Miel',                0.50),
  ('bufala',           'Mozza di bufala',     2.50),
  ('noix',             'Noix',                0.50),
  ('oeuf',             'Œuf',                 0.50),
  ('oignons',          'Oignons',             0.50),
  ('olives',           'Olives',              0.50),
  ('origan',           'Origan',              0.50),
  ('parmesan',         'Parmesan',            0.50),
  ('pesto',            'Pesto',               0.50),
  ('pieds-champignon', 'Pieds de champignon', 0.50),
  ('pistache',         'Éclats de pistache',  0.50),
  ('poire',            'Poire',               0.50),
  ('poivron',          'Poivron',             0.50),
  ('poulet',           'Poulet',              1.00),
  ('roquette',         'Roquette',            0.50),
  ('roquette-crue',    'Roquette crue',       0.50),
  ('salami-piquant',   'Salami piquant',      1.50),
  ('sauce-secrete',    'Sauce secrète',       0.50),
  ('sauge',            'Sauge',               0.50),
  ('stracciatella',    'Stracciatella',       1.00),
  ('tomate-cerise',    'Tomates cerises',     0.50),
  ('tomate-fraiche',   'Tomate fraîche',      0.50),
  ('truffe-noire',     'Truffe noire',        2.50)
ON CONFLICT (id) DO NOTHING;
