export const dynamic = 'force-dynamic'

import { getVehicles, VehicleCategory, VehicleFilters as VehicleFiltersType } from '@/lib/supabase'
import { FleetHero } from '@/app/components/FleetHero'
import { VehicleFilters } from '@/app/components/VehicleFilters'
import { VehicleCard } from '@/app/components/VehicleCard'

const PRICE_BANDS: Record<string, { priceMin?: number; priceMax?: number }> = {
  under1k: { priceMax: 1000 },
  '1k-3k': { priceMin: 1000, priceMax: 3000 },
  '3k-plus': { priceMin: 3000 },
}

const VALID_CATEGORIES: VehicleCategory[] = ['sport', 'sedan', 'suv', 'convertible']

export default async function FleetPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; available?: string; price?: string }>
}) {
  const sp = await searchParams

  const filters: VehicleFiltersType = {}
  if (sp.category && VALID_CATEGORIES.includes(sp.category as VehicleCategory)) {
    filters.category = sp.category as VehicleCategory
  }
  if (sp.available === '1') filters.available = true
  if (sp.price && PRICE_BANDS[sp.price]) {
    const band = PRICE_BANDS[sp.price]
    if (band.priceMin !== undefined) filters.priceMin = band.priceMin
    if (band.priceMax !== undefined) filters.priceMax = band.priceMax
  }

  const [vehicles, allVehicles] = await Promise.all([
    getVehicles(filters),
    getVehicles(),
  ])

  const availableCount = allVehicles.filter((v) => v.status === 'available').length
  const hasFilters = Object.keys(filters).length > 0

  return (
    <div>
      <FleetHero totalCount={allVehicles.length} availableCount={availableCount} />

      <VehicleFilters />

      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-slate-500">
          מציג <span className="font-semibold text-slate-700">{vehicles.length}</span> רכבים
        </p>
      </div>

      {vehicles.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl py-20 text-center shadow-sm">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
          </div>
          <p className="text-slate-600 font-medium">
            {hasFilters ? 'לא נמצאו רכבים התואמים לסינון' : 'אין רכבים בצי עדיין'}
          </p>
          <p className="text-sm text-slate-400 mt-1">
            {hasFilters ? 'נסה לשנות או לנקות את הסינון' : 'רכבים יוצגו כאן ברגע שיתווספו'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  )
}
