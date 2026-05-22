// ============================================================================
// EXISTING TYPES
// ============================================================================

export type MenuCategory = 'pizza' | 'incontournable' | 'salade' | 'panuzzi'

export const MENU_CATEGORY_LABELS: Record<MenuCategory, string> = {
  pizza:          'Pizzas',
  incontournable: 'Incontournables',
  salade:         'Salades',
  panuzzi:        'Panuozzi',
}

export interface Pizza {
  id: string
  slug: string
  nom: string
  desc: string
  prix: number
  categorie: MenuCategory
  disponible: boolean
  image?: string
  populaire?: boolean
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'cancelled'

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  preparing: 'En préparation',
  ready: 'Prête à récupérer',
  cancelled: 'Annulée',
}

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: '#9a7c4e',
  confirmed: '#4a5c3a',
  preparing: '#e8930a',
  ready: '#16a34a',
  cancelled: '#dc2626',
}

export interface OrderItem {
  pizzaId: string
  nom: string
  prix: number
  quantite: number
}

export type PaymentMethod = 'cash' | 'card'

export interface OrderClient {
  nom: string
  telephone: string
  email?: string
}

export interface Order {
  id: string
  numero: number
  items: OrderItem[]
  total: number
  client: OrderClient
  statut: OrderStatus
  modePaiement: PaymentMethod
  note?: string
  heureRetrait?: string
  modeRetrait?: 'takeaway' | 'dine_in'
  stripePaymentIntentId?: string
  createdAt: string
  updatedAt: string
}

export type PizzaSize = '24cm' | '30cm' | '36cm'

export interface PizzaCustomization {
  size: PizzaSize
  removedIngredients: string[]
  supplements: string[]
}

export interface CartItem {
  lineId: string
  pizzaId: string
  nom: string
  prix: number
  quantite: number
  customization?: PizzaCustomization
}

// ============================================================================
// MODULE 0: USER ROLES & ACCESS CONTROL
// ============================================================================

export type UserRole = 'manager' | 'employee'

export interface UserRoleRecord {
  id: string
  user_id: string
  role: UserRole
  business_id: string
  active: boolean
  created_at: string
  updated_at: string
}

// ============================================================================
// MODULE 1: INGREDIENTS
// ============================================================================

export type IngredientCategory = 'vegetables' | 'cheese' | 'sauce' | 'dough' | 'other'
export type IngredientUnit = 'kg' | 'L' | 'u' | 'g' | 'ml'

export interface Ingredient {
  id: string
  business_id: string
  name: string
  category: IngredientCategory
  unit: IngredientUnit
  supplier_id?: string
  purchase_price: number
  current_quantity: number
  alert_threshold: number
  created_at: string
  updated_at: string
}

export interface IngredientBatch {
  id: string
  ingredient_id: string
  quantity: number
  purchase_price: number
  received_date: string
  expiry_date: string
  created_at: string
}

// ============================================================================
// MODULE 2: REMINDERS
// ============================================================================

export type ReminderType = 'manual' | 'auto_expiry' | 'auto_stock'
export type ReminderRecurrence = 'none' | 'daily' | 'weekly' | 'monthly'

export interface Reminder {
  id: string
  business_id: string
  user_id: string
  title: string
  note?: string
  reminder_datetime: string
  recurrence: ReminderRecurrence
  type: ReminderType
  related_ingredient_id?: string
  is_done: boolean
  created_at: string
  updated_at: string
}

// ============================================================================
// MODULE 3: TASKS
// ============================================================================

export type TaskStatus = 'pending' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  business_id: string
  title: string
  status: TaskStatus
  priority: TaskPriority
  assigned_to?: string
  task_date: string
  created_by: string
  created_at: string
  updated_at: string
}

// ============================================================================
// MODULE 4: SUPPLIERS & RESTOCK
// ============================================================================

export interface Supplier {
  id: string
  business_id: string
  name: string
  contact_name?: string
  phone?: string
  email?: string
  notes?: string
  created_at: string
  updated_at: string
}

export type RestockOrderStatus = 'to_order' | 'ordered' | 'received'

export interface RestockOrder {
  id: string
  business_id: string
  supplier_id: string
  status: RestockOrderStatus
  order_date?: string
  received_date?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface RestockOrderItem {
  id: string
  restock_order_id: string
  ingredient_id: string
  quantity: number
  unit_price?: number
  created_at: string
}

// ============================================================================
// MODULE 5: EXPENSES (MANAGER ONLY)
// ============================================================================

export type ExpenseCategory = 'ingredient_purchase' | 'utilities' | 'equipment' | 'salaries' | 'misc'

export interface Expense {
  id: string
  business_id: string
  amount: number
  category: ExpenseCategory
  supplier_id?: string
  note?: string
  expense_date: string
  created_by: string
  created_at: string
  updated_at: string
}

// ============================================================================
// MODULE 5: PIZZA RECIPES (MANAGER ONLY)
// ============================================================================

export interface PizzaRecipe {
  id: string
  business_id: string
  pizza_id: string
  pizza_name: string
  created_at: string
  updated_at: string
}

export interface RecipeItem {
  id: string
  recipe_id: string
  ingredient_id: string
  quantity: number
  created_at: string
}

// ============================================================================
// MODULE 6: CUSTOMER ORDERS & CARD FINGERPRINT
// ============================================================================

export interface CustomerProfile {
  id: string
  telephone: string
  nom: string
  stripe_customer_id?: string
  created_at: string
  updated_at: string
}

export interface CustomerPaymentMethod {
  id: string
  customer_id: string
  stripe_pm_id: string
  card_brand?: string
  card_last4?: string
  is_default: boolean
  created_at: string
}

export interface CustomerOrderStats {
  customer_id: string
  successful_orders: number
  last_order_at?: string
}

/** Returned by GET /api/payment/customer?telephone=xxx */
export interface CustomerLookupResult {
  found: boolean
  customerId?: string
  stripeCustomerId?: string
  successfulOrders: number
  cardRequired: boolean
  savedCard?: {
    stripe_pm_id: string
    card_brand?: string
    card_last4?: string
  }
}

export const CARD_REQUIRED_THRESHOLD = 3

// ============================================================================
// MODULE 7: NOTIFICATIONS
// ============================================================================

export type NotificationType = 'promo' | 'pizza' | 'event' | 'reminder'
export type NotificationChannel = 'email' | 'push' | 'inapp' | 'sms'
export type NotificationAudience = 'all' | 'vip' | 'regulars' | 'inactive'

export interface AppNotification {
  id: string
  title: string
  description: string
  image?: string
  type: NotificationType
  startDate: string
  endDate: string
  channels: NotificationChannel[]
  targetAudience: NotificationAudience
  sentCount: number
  active: boolean
  createdAt: string
  updatedAt: string
}

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  promo:    'Promo',
  pizza:    'Pizza du moment',
  event:    'Soirée',
  reminder: 'Rappel',
}

export const NOTIFICATION_TYPE_COLORS: Record<NotificationType, string> = {
  promo:    '#d4a843',
  pizza:    '#f97316',
  event:    '#3b82f6',
  reminder: '#6b7280',
}

export const NOTIFICATION_CHANNEL_LABELS: Record<NotificationChannel, string> = {
  email: 'Email',
  push:  'Push',
  inapp: 'In-app',
  sms:   'SMS',
}

export const NOTIFICATION_AUDIENCE_LABELS: Record<NotificationAudience, string> = {
  all:      'Tous les clients',
  vip:      'VIP (5+ commandes)',
  regulars: 'Réguliers (30 jours)',
  inactive: 'Inactifs (60+ jours)',
}
