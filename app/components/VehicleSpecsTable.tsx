import { Vehicle } from '@/lib/supabase'

const CATEGORY_LABELS: Record<Vehicle['category'], string> = {
  sport: 'ספורט',
  sedan: 'סדאן',
  suv: 'פנאי (SUV)',
  convertible: 'קבריולה',
}

export function VehicleSpecsTable({ vehicle }: { vehicle: Vehicle }) {
  const rows: { label: string; value: string | null }[] = [
    { label: 'קטגוריה', value: CATEGORY_LABELS[vehicle.category] },
    { label: 'שנה', value: String(vehicle.year) },
    { label: 'מנוע', value: vehicle.engine_size },
    { label: 'כוח סוס', value: vehicle.horsepower ? `${vehicle.horsepower} hp` : null },
    { label: '0–100 קמ"ש', value: vehicle.zero_to_hundred ? `${vehicle.zero_to_hundred} שניות` : null },
    { label: 'מהירות מרבית', value: vehicle.top_speed ? `${vehicle.top_speed} קמ"ש` : null },
    { label: 'תיבת הילוכים', value: vehicle.transmission },
    { label: 'מושבים', value: vehicle.seats ? String(vehicle.seats) : null },
    { label: 'סוג דלק', value: vehicle.fuel_type },
  ]

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-900">מפרט טכני</h2>
      </div>
      <dl className="divide-y divide-slate-100">
        {rows
          .filter((r) => r.value !== null && r.value !== '')
          .map((r) => (
            <div key={r.label} className="flex items-center justify-between px-6 py-3 text-sm">
              <dt className="text-slate-500">{r.label}</dt>
              <dd className="text-slate-900 font-medium">{r.value}</dd>
            </div>
          ))}
      </dl>
    </div>
  )
}
