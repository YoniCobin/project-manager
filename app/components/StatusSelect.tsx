'use client'

import { useTransition } from 'react'
import { updateProjectStatusAction } from '@/app/actions'
import { ProjectStatus } from '@/lib/supabase'

interface Props {
  projectId: string
  currentStatus: ProjectStatus
}

const STATUS_LABELS: Record<ProjectStatus, string> = {
  active: 'פעיל',
  completed: 'הושלם',
  paused: 'מושהה',
}

const STATUS_STYLES: Record<ProjectStatus, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  completed: 'bg-blue-50 text-blue-700 border-blue-200',
  paused: 'bg-slate-100 text-slate-500 border-slate-200',
}

export function StatusSelect({ projectId, currentStatus }: Props) {
  const [isPending, startTransition] = useTransition()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as ProjectStatus
    startTransition(async () => {
      await updateProjectStatusAction(projectId, newStatus)
    })
  }

  return (
    <select
      defaultValue={currentStatus}
      onChange={handleChange}
      disabled={isPending}
      className={`text-xs font-medium px-3 py-1.5 rounded-full border cursor-pointer transition-opacity focus:outline-none focus:ring-2 focus:ring-indigo-500 ${STATUS_STYLES[currentStatus]} ${isPending ? 'opacity-60' : ''}`}
    >
      {Object.entries(STATUS_LABELS).map(([value, label]) => (
        <option key={value} value={value}>{label}</option>
      ))}
    </select>
  )
}
