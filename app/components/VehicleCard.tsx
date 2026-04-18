import Link from 'next/link'
import Image from 'next/image'
import { Vehicle } from '@/lib/supabase'
import { priceDisplay } from '@/lib/utils'
import { VehicleStatusBadge } from '@/app/components/VehicleStatusBadge'

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Link
      href={`/fleet/${vehicle.id}`}
      className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-slate-300 transition-all"
    >
      <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
        {vehicle.cover_image_url ? (
          <Image
            src={vehicle.cover_image_url}
            alt={`${vehicle.brand} ${vehicle.model}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">
            אין תמונה
          </div>
        )}
        <div className="absolute top-3 left-3">
          <VehicleStatusBadge status={vehicle.status} />
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <p className="text-xs text-slate-400 font-medium">{vehicle.brand}</p>
            <h3 className="font-semibold text-slate-900 text-base leading-snug group-hover:text-amber-600 transition-colors">
              {vehicle.model}
            </h3>
          </div>
          <span className="text-xs text-slate-400 shrink-0 mt-0.5">{vehicle.year}</span>
        </div>

        <div className="flex items-baseline justify-between pt-3 border-t border-slate-100">
          <span className="text-xs text-slate-400">ליום</span>
          <span className="text-lg font-bold text-slate-900">{priceDisplay(vehicle.daily_price_ils)}</span>
        </div>
      </div>
    </Link>
  )
}
