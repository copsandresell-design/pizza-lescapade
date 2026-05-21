-- ============================================================================
-- MIGRATION: MODULE 0 - User Roles & Access Control
-- ============================================================================

-- ============================================================================
-- 1. Table user_roles (Gestion des rôles)
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('manager', 'employee')),
  business_id UUID NOT NULL DEFAULT gen_random_uuid(), -- Pour multi-tenant futur
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, business_id)
);

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_business_id ON user_roles(business_id);

-- ============================================================================
-- 2. Table ingredients (Stock)
-- ============================================================================
CREATE TABLE IF NOT EXISTS ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- "vegetables", "cheese", "sauce", "dough", "other"
  unit TEXT NOT NULL, -- "kg", "L", "u", "g", "ml"
  supplier_id UUID, -- Référence, sera ajoutée en MODULE 4
  purchase_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  current_quantity DECIMAL(15, 3) NOT NULL DEFAULT 0,
  alert_threshold DECIMAL(15, 3) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ingredients_business_id ON ingredients(business_id);

-- ============================================================================
-- 3. Table ingredient_batches (Lots)
-- ============================================================================
CREATE TABLE IF NOT EXISTS ingredient_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity DECIMAL(15, 3) NOT NULL,
  purchase_price DECIMAL(10, 2) NOT NULL,
  received_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ingredient_batches_ingredient_id ON ingredient_batches(ingredient_id);
CREATE INDEX IF NOT EXISTS idx_ingredient_batches_expiry_date ON ingredient_batches(expiry_date);

-- ============================================================================
-- 4. Table reminders (Rappels)
-- ============================================================================
CREATE TABLE IF NOT EXISTS reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  note TEXT,
  reminder_datetime TIMESTAMP NOT NULL,
  recurrence TEXT DEFAULT 'none', -- "none", "daily", "weekly", "monthly"
  type TEXT NOT NULL CHECK (type IN ('manual', 'auto_expiry', 'auto_stock')),
  related_ingredient_id UUID,
  is_done BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reminders_business_id ON reminders(business_id);
CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_reminder_datetime ON reminders(reminder_datetime);

-- ============================================================================
-- 5. Table tasks (Tâches partagées)
-- ============================================================================
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'done')) DEFAULT 'pending',
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  assigned_to UUID REFERENCES auth.users(id),
  task_date DATE NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_business_id ON tasks(business_id);
CREATE INDEX IF NOT EXISTS idx_tasks_task_date ON tasks(task_date);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);

-- ============================================================================
-- 6. Table suppliers (Fournisseurs)
-- ============================================================================
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL,
  name TEXT NOT NULL,
  contact_name TEXT,
  phone TEXT,
  email TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_suppliers_business_id ON suppliers(business_id);

-- ============================================================================
-- 7. Table restock_orders (Commandes de réappro)
-- ============================================================================
CREATE TABLE IF NOT EXISTS restock_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL,
  supplier_id UUID NOT NULL REFERENCES suppliers(id),
  status TEXT NOT NULL CHECK (status IN ('to_order', 'ordered', 'received')) DEFAULT 'to_order',
  order_date TIMESTAMP,
  received_date TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_restock_orders_business_id ON restock_orders(business_id);
CREATE INDEX IF NOT EXISTS idx_restock_orders_supplier_id ON restock_orders(supplier_id);

-- ============================================================================
-- 8. Table restock_order_items (Lignes de réappro)
-- ============================================================================
CREATE TABLE IF NOT EXISTS restock_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restock_order_id UUID NOT NULL REFERENCES restock_orders(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES ingredients(id),
  quantity DECIMAL(15, 3) NOT NULL,
  unit_price DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_restock_order_items_restock_order_id ON restock_order_items(restock_order_id);

-- ============================================================================
-- 9. Table expenses (Dépenses — GÉRANT ONLY)
-- ============================================================================
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  category TEXT NOT NULL, -- "ingredient_purchase", "utilities", "equipment", "salaries", "misc"
  supplier_id UUID,
  note TEXT,
  expense_date DATE NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_expenses_business_id ON expenses(business_id);
CREATE INDEX IF NOT EXISTS idx_expenses_expense_date ON expenses(expense_date);

-- ============================================================================
-- 10. Table pizza_recipes (Recettes pizzas — coût revient)
-- ============================================================================
CREATE TABLE IF NOT EXISTS pizza_recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL,
  pizza_id UUID NOT NULL, -- Référence à la pizza du menu
  pizza_name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(business_id, pizza_id)
);

CREATE INDEX IF NOT EXISTS idx_pizza_recipes_business_id ON pizza_recipes(business_id);

-- ============================================================================
-- 11. Table recipe_items (Ingrédients d'une recette)
-- ============================================================================
CREATE TABLE IF NOT EXISTS recipe_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES pizza_recipes(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES ingredients(id),
  quantity DECIMAL(15, 3) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recipe_items_recipe_id ON recipe_items(recipe_id);

-- ============================================================================
-- RLS POLICIES (Row Level Security)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredient_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE restock_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE restock_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE pizza_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_items ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- USER_ROLES RLS
-- ============================================================================
-- GÉRANT peut voir et modifier tous les rôles
CREATE POLICY "manager_view_user_roles" ON user_roles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role = 'manager'
      AND ur.business_id = user_roles.business_id
    )
  );

CREATE POLICY "manager_modify_user_roles" ON user_roles FOR INSERT, UPDATE, DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role = 'manager'
      AND ur.business_id = user_roles.business_id
    )
  );

-- Employé ne peut voir que son propre rôle
CREATE POLICY "employee_view_own_role" ON user_roles FOR SELECT
  USING (user_id = auth.uid());

-- ============================================================================
-- INGREDIENTS RLS
-- ============================================================================
-- Tous peuvent lire et modifier les ingrédients (utilisé par gérant et employés)
CREATE POLICY "all_view_ingredients" ON ingredients FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND business_id = ingredients.business_id
    )
  );

CREATE POLICY "all_modify_ingredients" ON ingredients FOR INSERT, UPDATE, DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND business_id = ingredients.business_id
    )
  );

-- ============================================================================
-- INGREDIENT_BATCHES RLS
-- ============================================================================
CREATE POLICY "all_view_batches" ON ingredient_batches FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN ingredients i ON i.id = ingredient_batches.ingredient_id
      WHERE ur.user_id = auth.uid()
      AND ur.business_id = i.business_id
    )
  );

CREATE POLICY "all_modify_batches" ON ingredient_batches FOR INSERT, UPDATE, DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN ingredients i ON i.id = ingredient_batches.ingredient_id
      WHERE ur.user_id = auth.uid()
      AND ur.business_id = i.business_id
    )
  );

-- ============================================================================
-- REMINDERS RLS
-- ============================================================================
-- Tous peuvent voir les rappels de leur business
CREATE POLICY "all_view_reminders" ON reminders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND business_id = reminders.business_id
    )
  );

-- Créateur et gérant peuvent modifier
CREATE POLICY "creator_modify_reminders" ON reminders FOR UPDATE, DELETE
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'manager'
      AND business_id = reminders.business_id
    )
  );

CREATE POLICY "all_create_reminders" ON reminders FOR INSERT
  USING (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND business_id = reminders.business_id
    )
  );

-- ============================================================================
-- TASKS RLS
-- ============================================================================
CREATE POLICY "all_view_tasks" ON tasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND business_id = tasks.business_id
    )
  );

-- Assigné ou gérant peut modifier le statut
CREATE POLICY "assignee_modify_task_status" ON tasks FOR UPDATE
  USING (
    assigned_to = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'manager'
      AND business_id = tasks.business_id
    )
  );

-- Gérant peut créer/supprimer
CREATE POLICY "manager_manage_tasks" ON tasks FOR INSERT, DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'manager'
      AND business_id = tasks.business_id
    )
  );

-- ============================================================================
-- SUPPLIERS RLS
-- ============================================================================
CREATE POLICY "all_view_suppliers" ON suppliers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND business_id = suppliers.business_id
    )
  );

CREATE POLICY "all_modify_suppliers" ON suppliers FOR INSERT, UPDATE, DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND business_id = suppliers.business_id
    )
  );

-- ============================================================================
-- RESTOCK_ORDERS RLS
-- ============================================================================
CREATE POLICY "all_view_restock_orders" ON restock_orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND business_id = restock_orders.business_id
    )
  );

CREATE POLICY "all_modify_restock_orders" ON restock_orders FOR INSERT, UPDATE, DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND business_id = restock_orders.business_id
    )
  );

-- ============================================================================
-- RESTOCK_ORDER_ITEMS RLS
-- ============================================================================
CREATE POLICY "all_view_restock_items" ON restock_order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN restock_orders ro ON ro.id = restock_order_items.restock_order_id
      WHERE ur.user_id = auth.uid()
      AND ur.business_id = ro.business_id
    )
  );

CREATE POLICY "all_modify_restock_items" ON restock_order_items FOR INSERT, UPDATE, DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN restock_orders ro ON ro.id = restock_order_items.restock_order_id
      WHERE ur.user_id = auth.uid()
      AND ur.business_id = ro.business_id
    )
  );

-- ============================================================================
-- EXPENSES RLS (GÉRANT ONLY)
-- ============================================================================
CREATE POLICY "manager_view_expenses" ON expenses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'manager'
      AND business_id = expenses.business_id
    )
  );

CREATE POLICY "manager_modify_expenses" ON expenses FOR INSERT, UPDATE, DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'manager'
      AND business_id = expenses.business_id
    )
  );

-- ============================================================================
-- PIZZA_RECIPES RLS (GÉRANT ONLY)
-- ============================================================================
CREATE POLICY "manager_view_recipes" ON pizza_recipes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'manager'
      AND business_id = pizza_recipes.business_id
    )
  );

CREATE POLICY "manager_modify_recipes" ON pizza_recipes FOR INSERT, UPDATE, DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'manager'
      AND business_id = pizza_recipes.business_id
    )
  );

-- ============================================================================
-- RECIPE_ITEMS RLS (GÉRANT ONLY)
-- ============================================================================
CREATE POLICY "manager_view_recipe_items" ON recipe_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN pizza_recipes pr ON pr.id = recipe_items.recipe_id
      WHERE ur.user_id = auth.uid()
      AND ur.role = 'manager'
      AND ur.business_id = pr.business_id
    )
  );

CREATE POLICY "manager_modify_recipe_items" ON recipe_items FOR INSERT, UPDATE, DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN pizza_recipes pr ON pr.id = recipe_items.recipe_id
      WHERE ur.user_id = auth.uid()
      AND ur.role = 'manager'
      AND ur.business_id = pr.business_id
    )
  );

-- ============================================================================
-- MIGRATION: MODULE 6 - Customer Orders & Card Fingerprint
-- ============================================================================

-- Profil client identifié par son numéro de téléphone (pas d'auth Supabase)
CREATE TABLE IF NOT EXISTS customer_profiles (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telephone          TEXT UNIQUE NOT NULL,
  nom                TEXT NOT NULL,
  stripe_customer_id TEXT UNIQUE,
  created_at         TIMESTAMPTZ DEFAULT now(),
  updated_at         TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_customer_profiles_telephone ON customer_profiles(telephone);
CREATE INDEX IF NOT EXISTS idx_customer_profiles_stripe_customer_id ON customer_profiles(stripe_customer_id);

-- Méthodes de paiement tokenisées via Stripe SetupIntent
CREATE TABLE IF NOT EXISTS customer_payment_methods (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id    UUID NOT NULL REFERENCES customer_profiles(id) ON DELETE CASCADE,
  stripe_pm_id   TEXT NOT NULL UNIQUE,
  card_brand     TEXT,
  card_last4     TEXT,
  is_default     BOOLEAN DEFAULT true,
  created_at     TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_customer_payment_methods_customer_id ON customer_payment_methods(customer_id);

-- Statistiques commandes par client (seuil N=3 pour dispenser de l'empreinte)
CREATE TABLE IF NOT EXISTS customer_order_stats (
  customer_id        UUID PRIMARY KEY REFERENCES customer_profiles(id) ON DELETE CASCADE,
  successful_orders  INT DEFAULT 0,
  last_order_at      TIMESTAMPTZ
);

-- Commandes client (version publique — sans auth Supabase)
CREATE TABLE IF NOT EXISTS orders (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero                  SERIAL,
  customer_id             UUID REFERENCES customer_profiles(id),
  items                   JSONB NOT NULL,
  total                   DECIMAL(10, 2) NOT NULL,
  statut                  TEXT NOT NULL DEFAULT 'pending'
    CHECK (statut IN ('pending', 'confirmed', 'preparing', 'ready', 'cancelled')),
  mode_paiement           TEXT NOT NULL CHECK (mode_paiement IN ('cash', 'card')),
  heure_retrait           TEXT,
  note                    TEXT,
  stripe_pm_id            TEXT,
  card_required           BOOLEAN DEFAULT true,
  created_at              TIMESTAMPTZ DEFAULT now(),
  updated_at              TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_statut ON orders(statut);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- RLS : ces tables sont accessibles sans auth Supabase (accès via service_role depuis les API routes)
-- Les clients n'accèdent jamais directement à Supabase — tout passe par les API routes Next.js.
-- Les gérants accèdent aux commandes via l'admin (auth Supabase).
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_order_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Service role bypass (API routes Next.js utilisent service_role)
-- Accès gérant authentifié
CREATE POLICY "manager_view_orders" ON orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'manager'
    )
  );

CREATE POLICY "manager_update_orders" ON orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'manager'
    )
  );

CREATE POLICY "manager_view_customers" ON customer_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role IN ('manager', 'employee')
    )
  );

CREATE POLICY "manager_view_payment_methods" ON customer_payment_methods FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'manager'
    )
  );

CREATE POLICY "manager_view_order_stats" ON customer_order_stats FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'manager'
    )
  );

-- Fonction RPC appelée par le webhook Stripe pour incrémenter le compteur de commandes réussies
CREATE OR REPLACE FUNCTION increment_successful_orders(p_customer_id UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO customer_order_stats (customer_id, successful_orders, last_order_at)
  VALUES (p_customer_id, 1, now())
  ON CONFLICT (customer_id) DO UPDATE
    SET successful_orders = customer_order_stats.successful_orders + 1,
        last_order_at = now();
END;
$$;
