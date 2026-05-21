'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertBanner } from '@/components/admin/ingredients/AlertBanner'
import { IngredientList } from '@/components/admin/ingredients/IngredientList'
import { AlertsView } from '@/components/admin/ingredients/AlertsView'

export default function IngredientsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1a0e06', color: '#fdf6ec' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-10 px-5 py-3"
        style={{ backgroundColor: '#2c1a0e', borderBottom: '1px solid #4a3020' }}
      >
        <span style={{ fontFamily: 'var(--font-dancing), cursive', fontSize: '1.4rem', color: '#d4a843' }}>
          L&apos;Escapade · Ingrédients
        </span>
      </header>

      {/* Alertes */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <AlertBanner />

        {/* Tabs */}
        <Tabs defaultValue="list" className="w-full">
          <TabsList
            className="grid w-full grid-cols-2"
            style={{ backgroundColor: '#3a2010' }}
          >
            <TabsTrigger
              value="list"
              style={{ color: '#9a7c4e' }}
            >
              Liste
            </TabsTrigger>
            <TabsTrigger
              value="alerts"
              style={{ color: '#9a7c4e' }}
            >
              À surveiller
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-6">
            <IngredientList />
          </TabsContent>

          <TabsContent value="alerts" className="mt-6">
            <AlertsView />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
