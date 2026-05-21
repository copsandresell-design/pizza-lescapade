'use client'
import { TrendingDown, Clock } from 'lucide-react'
import { useIngredientAlerts } from '@/hooks/useIngredientAlerts'

export function AlertsView() {
  const { alerts, loading } = useIngredientAlerts(3)

  if (loading) {
    return <div style={{ color: '#9a7c4e' }}>Chargement...</div>
  }

  if (alerts.length === 0) {
    return (
      <div
        className="p-8 text-center rounded-lg"
        style={{ backgroundColor: '#2c1a0e', color: '#6b5040' }}
      >
        ✓ Aucune alerte
      </div>
    )
  }

  const lowStock = alerts.filter((a) => a.type === 'low_stock')
  const expiring = alerts.filter((a) => a.type === 'expiring_soon')

  return (
    <div className="space-y-6">
      {/* Stock Bas */}
      {lowStock.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3" style={{ color: '#f87171' }}>
            <TrendingDown size={18} />
            <h3 className="font-bold">Stock Bas ({lowStock.length})</h3>
          </div>
          <div className="space-y-2">
            {lowStock.map((alert) => (
              <div
                key={alert.ingredient_id}
                className="p-3 rounded-lg"
                style={{ backgroundColor: '#3a2010', border: '1px solid #4a3020' }}
              >
                <div style={{ color: '#fdf6ec' }} className="font-semibold">
                  {alert.ingredient_name}
                </div>
                <div style={{ color: '#9a7c4e' }} className="text-sm">
                  {alert.current_quantity} / {alert.alert_threshold}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Péremption Proche */}
      {expiring.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3" style={{ color: '#e8930a' }}>
            <Clock size={18} />
            <h3 className="font-bold">Péremption Proche ({expiring.length})</h3>
          </div>
          <div className="space-y-2">
            {expiring.map((alert) => (
              <div
                key={`${alert.ingredient_id}-${alert.expiry_date}`}
                className="p-3 rounded-lg"
                style={{ backgroundColor: '#3a2010', border: '1px solid #4a3020' }}
              >
                <div style={{ color: '#fdf6ec' }} className="font-semibold">
                  {alert.ingredient_name}
                </div>
                <div style={{ color: '#9a7c4e' }} className="text-sm">
                  Expire le {new Date(alert.expiry_date!).toLocaleDateString('fr-FR')}
                  {alert.days_until_expiry! <= 1 ? ' 🔴 AUJOURD\'HUI/DEMAIN' : ` (${alert.days_until_expiry} j)`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
