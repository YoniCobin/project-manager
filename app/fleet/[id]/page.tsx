import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getVehicle } from '@/lib/supabase'
import { priceDisplay } from '@/lib/utils'
import { VehicleGallery } from '@/app/components/VehicleGallery'
import { VehicleSpecsTable } from '@/app/components/VehicleSpecsTable'
import { VehicleStatusBadge } from '@/app/components/VehicleStatusBadge'

export default async function VehiclePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const vehicle = await getVehicle(id).catch(() => null)
  if (!vehicle) notFound()

  const isAvailable = vehicle.status === 'available'

  return (
    <div>
      <Link
        href="/fleet"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-7 transition-colors group"
      >
        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
        </svg>
        חזרה לצי
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        {/* Gallery */}
        <div className="lg:col-span-3">
          <VehicleGallery
            images={vehicle.images || []}
            fallbackUrl={vehicle.cover_image_url}
            alt={`${vehicle.brand} ${vehicle.model}`}
          />
        </div>

        {/* Price & CTA card */}
        <aside className="lg:col-span-2">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 lg:sticky lg:top-6">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">{vehicle.brand}</p>
                <h1 className="text-2xl font-bold text-slate-900 leading-tight">{vehicle.model}</h1>
                <p className="text-sm text-slate-500 mt-0.5">{vehicle.year}</p>
              </div>
              <VehicleStatusBadge status={vehicle.status} />
            </div>

            <div className="py-5 border-y border-slate-100 my-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">
                  {priceDisplay(vehicle.daily_price_ils)}
                </span>
                <span className="text-sm text-slate-400">/ יום</span>
              </div>
            </div>

            <button
              type="button"
              disabled
              className="w-full mt-5 bg-slate-900 text-white text-sm font-semibold py-3 rounded-xl disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
              title="בקרוב"
            >
              {isAvailable ? 'להזמנה — בקרוב' : 'לא זמין להזמנה'}
            </button>

            <p className="text-xs text-slate-400 text-center mt-3">
              ליצירת קשר: התקשרו לסוכן שלנו
            </p>
          </div>
        </aside>
      </div>

      {/* Description */}
      {vehicle.description_he && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">על הרכב</h2>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {vehicle.description_he}
          </p>
        </div>
      )}

      {/* Specs */}
      <VehicleSpecsTable vehicle={vehicle} />
    </div>
  )
}
