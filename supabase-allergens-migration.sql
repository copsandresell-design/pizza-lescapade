-- ============================================================================
-- MIGRATION: Allergènes — Tables allergens + allergen_ingredient_mappings
-- À exécuter dans Supabase Dashboard > SQL Editor
-- (facultatif si vous utilisez le système statique frontend)
-- ============================================================================

-- ── TABLE ALLERGENS ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS allergens (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  icon        TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  sort_order  INT  NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ── TABLE ALLERGEN_INGREDIENT_MAPPINGS ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS allergen_ingredient_mappings (
  id            UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  ingredient    TEXT    NOT NULL,  -- nom normalisé de l'ingrédient (lowercase)
  allergen_id   TEXT    NOT NULL REFERENCES allergens(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE(ingredient, allergen_id)
);

CREATE INDEX IF NOT EXISTS idx_allergen_mappings_ingredient ON allergen_ingredient_mappings(ingredient);

-- ── RLS ──────────────────────────────────────────────────────────────────────
ALTER TABLE allergens                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE allergen_ingredient_mappings ENABLE ROW LEVEL SECURITY;

-- Lecture publique (API routes ou clients directs)
CREATE POLICY "public_read_allergens" ON allergens
  FOR SELECT USING (true);

CREATE POLICY "public_read_allergen_mappings" ON allergen_ingredient_mappings
  FOR SELECT USING (true);

-- ── SEED — 14 ALLERGÈNES OFFICIELS ──────────────────────────────────────────
INSERT INTO allergens (id, name, icon, description, sort_order) VALUES
  ('gluten',       'Gluten',         '🌾', 'Blé, seigle, orge — pâte, pain',           1),
  ('lait',         'Lait',           '🥛', 'Produits laitiers, lactose',                2),
  ('oeuf',         'Œuf',            '🥚', 'Œuf de poule',                              3),
  ('poisson',      'Poisson',        '🐟', 'Anchois, poisson frais ou traité',          4),
  ('crustaces',    'Crustacés',      '🦐', 'Crevettes, homard, crabe',                  5),
  ('fruits-coque', 'Fruits à coque', '🌰', 'Noix, pistache, amande, noisette, pignon',  6),
  ('arachide',     'Arachide',       '🥜', 'Cacahuète, beurre de cacahuète',            7),
  ('soja',         'Soja',           '🫘', 'Soja, tofu, sauce soja',                    8),
  ('sesame',       'Sésame',         '🌿', 'Graines de sésame, tahini',                 9),
  ('moutarde',     'Moutarde',       '🟡', 'Moutarde, graines de moutarde',            10),
  ('celeri',       'Céleri',         '🌱', 'Céleri, jus de céleri',                    11),
  ('sulfites',     'Sulfites',       '⚗️',  'Charcuterie traitée, vinaigre, vin',       12),
  ('mollusques',   'Mollusques',     '🐚', 'Moules, huîtres, escargot',               13),
  ('lupin',        'Lupin',          '🌸', 'Farine de lupin',                          14)
ON CONFLICT (id) DO NOTHING;

-- ── SEED — MAPPINGS INGRÉDIENTS → ALLERGÈNES ────────────────────────────────
INSERT INTO allergen_ingredient_mappings (ingredient, allergen_id) VALUES
  -- Produits laitiers
  ('mozzarella',        'lait'),
  ('mozza di bufala',   'lait'),
  ('crème fraîche',     'lait'),
  ('chèvre',            'lait'),
  ('parmesan',          'lait'),
  ('gorgonzola',        'lait'),
  ('burrata',           'lait'),
  ('ricotta',           'lait'),
  ('brousse',           'lait'),
  ('reblochon',         'lait'),
  ('stracciatella',     'lait'),
  ('crème de parmesan', 'lait'),
  ('crème truffe',      'lait'),
  ('toast chèvre chaud','lait'),
  ('toast chèvre chaud','gluten'),
  -- Fruits à coque
  ('noix',              'fruits-coque'),
  ('pignons',           'fruits-coque'),
  ('pistache',          'fruits-coque'),
  ('éclats de pistache','fruits-coque'),
  ('amande',            'fruits-coque'),
  ('noisette',          'fruits-coque'),
  ('pesto',             'fruits-coque'),
  -- Poisson
  ('anchois',           'poisson'),
  -- Sulfites (charcuterie / vinaigre)
  ('jambon blanc',      'sulfites'),
  ('jambon cru',        'sulfites'),
  ('lardons',           'sulfites'),
  ('figatelli',         'sulfites'),
  ('salami piquant',    'sulfites'),
  ('guanciale',         'sulfites'),
  ('viande hachée',     'sulfites'),
  ('balsamique',        'sulfites'),
  ('crème de balsamique','sulfites'),
  -- Œuf
  ('œuf',               'oeuf'),
  ('oeuf',              'oeuf'),
  -- Gluten (pain / toast)
  ('toast',             'gluten'),
  ('croûtons',          'gluten')
ON CONFLICT (ingredient, allergen_id) DO NOTHING;
