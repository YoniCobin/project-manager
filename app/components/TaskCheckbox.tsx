'use client'

import { useState, useTransition } from 'react'
import { toggleTaskAction } from '@/app/actions'

interface Props {
  id: string
  projectId: string
  title: string
  done: boolean
}

export function TaskCheckbox({ id, projectId, title, done }: Props) {
  const [checked, setChecked] = useState(done)
  const [isPending, startTransition] = useTransition()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newDone = e.target.checked
    setChecked(newDone)
    startTransition(async () => {
      await toggleTaskAction(id, projectId, newDone)
    })
  }

  return (
    <label className={`flex items-center gap-3 py-3 cursor-pointer group transition-opacity ${isPending ? 'opacity-50' : ''}`}>
      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
        checked
          ? 'bg-indigo-600 border-indigo-600'
          : 'border-slate-300 group-hover:border-indigo-400'
      }`}>
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        )}
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={isPending}
          className="sr-only"
        />
      </div>
      <span className={`text-sm transition-all ${checked ? 'line-through text-slate-400' : 'text-slate-700 group-hover:text-slate-900'}`}>
        {title}
      </span>
    </label>
  )
}
