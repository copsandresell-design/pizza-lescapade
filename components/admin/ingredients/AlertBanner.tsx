'use client'
import { AlertCircle, TrendingDown, Clock } from 'lucide-react'
import { useIngredientAlerts } from '@/hooks/useIngredientAlerts'

export function AlertBanner() {
  const { alerts, loading } = useIngredientAlerts(3)

  if (loading) return null
  if (alerts.length === 0) return null

  const lowStockCount = alerts.filter((a) => a.type === 'low_stock').length
  const expiringCount = alerts.filter((a) => a.type === 'expiring_soon').length

  return (
    <div
      className="mb-6 rounded-lg p-4"
      style={{
        backgroundColor: '#e8930a',
        color: '#1a0e06',
      }}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 flex-shrink-0" size={20} />
        <div className="flex-1">
          <div className="font-bold mb-2">⚠️ Alertes stock & péremption</div>
          <div className="text-sm space-y-1">
            {lowStockCount > 0 && (
              <div className="flex items-center gap-2">
                <TrendingDown size={14} />
                <span>{lowStockCount} ingrédient(s) en stock bas</span>
              </div>
            )}
            {expiringCount > 0 && (
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>{expiringCount} lot(s) expirant bientôt</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
