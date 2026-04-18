'use client'

import { useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { VehicleCategory } from '@/lib/supabase'

const CATEGORIES: { value: VehicleCategory; label: string }[] = [
  { value: 'sport', label: 'ספורט' },
  { value: 'sedan', label: 'סדאן' },
  { value: 'suv', label: 'פנאי (SUV)' },
  { value: 'convertible', label: 'קבריולה' },
]

const PRICE_BANDS: { value: string; label: string }[] = [
  { value: 'under1k', label: 'עד ₪1,000' },
  { value: '1k-3k', label: '₪1,000–3,000' },
  { value: '3k-plus', label: 'מעל ₪3,000' },
]

export function VehicleFilters() {
  const router = useRouter()
  const params = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const activeCategory = params.get('category')
  const activeAvailable = params.get('available') === '1'
  const activePrice = params.get('price')

  function update(key: string, value: string | null) {
    const next = new URLSearchParams(params.toString())
    if (value === null || value === '') next.delete(key)
    else next.set(key, value)
    startTransition(() => {
      router.push(`/fleet${next.toString() ? `?${next}` : ''}`)
    })
  }

  function clear() {
    startTransition(() => router.push('/fleet'))
  }

  const hasAny = activeCategory || activeAvailable || activePrice

  const btn = (active: boolean) =>
    `text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
      active
        ? 'bg-slate-900 text-white border-slate-900'
        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
    }`

  return (
    <div className={`bg-white border border-slate-200 rounded-2xl shadow-sm p-5 mb-6 ${isPending ? 'opacity-70' : ''}`}>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-medium ml-1">קטגוריה:</span>
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => update('category', activeCategory === c.value ? null : c.value)}
              className={btn(activeCategory === c.value)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-medium ml-1">מחיר:</span>
          {PRICE_BANDS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => update('price', activePrice === p.value ? null : p.value)}
              className={btn(activePrice === p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 select-none">
          <input
            type="checkbox"
            checked={activeAvailable}
            onChange={(e) => update('available', e.target.checked ? '1' : null)}
            className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
          />
          זמינים בלבד
        </label>

        {hasAny && (
          <button
            type="button"
            onClick={clear}
            className="text-xs text-slate-400 hover:text-slate-700 transition-colors mr-auto"
          >
            נקה סינון
          </button>
        )}
      </div>
    </div>
  )
}
