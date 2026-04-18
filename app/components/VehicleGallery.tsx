'use client'

import { useState } from 'react'
import Image from 'next/image'
import { VehicleImage } from '@/lib/supabase'

interface Props {
  images: VehicleImage[]
  fallbackUrl: string | null
  alt: string
}

export function VehicleGallery({ images, fallbackUrl, alt }: Props) {
  const gallery = images.length > 0
    ? images
    : fallbackUrl
      ? [{ id: 'cover', vehicle_id: '', url: fallbackUrl, alt_he: null, sort_order: 0, created_at: '' }]
      : []

  const [activeIdx, setActiveIdx] = useState(0)
  const active = gallery[activeIdx]

  if (!active) {
    return (
      <div className="aspect-[16/10] bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300 text-sm">
        אין תמונות
      </div>
    )
  }

  return (
    <div>
      <div className="relative aspect-[16/10] bg-slate-100 rounded-2xl overflow-hidden mb-3">
        <Image
          src={active.url}
          alt={active.alt_he || alt}
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
          priority
        />
      </div>

      {gallery.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {gallery.map((img, idx) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                idx === activeIdx ? 'border-amber-500' : 'border-transparent hover:border-slate-300'
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt_he || alt}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
