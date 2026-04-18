import { VehicleStatus } from '@/lib/supabase'

const STATUS_LABELS: Record<VehicleStatus, string> = {
  available: 'זמין',
  rented: 'מושכר',
  maintenance: 'בתחזוקה',
}

const STATUS_BADGE: Record<VehicleStatus, string> = {
  available: 'bg-emerald-50 text-emerald-700',
  rented: 'bg-amber-50 text-amber-700',
  maintenance: 'bg-slate-100 text-slate-500',
}

export function VehicleStatusBadge({ status }: { status: VehicleStatus }) {
  return (
    <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_BADGE[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}
