'use client'

import { useRef, useTransition } from 'react'
import { addTaskAction } from '@/app/actions'

interface Props {
  projectId: string
}

export function NewTaskForm({ projectId }: Props) {
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await addTaskAction(formData)
      formRef.current?.reset()
    })
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex gap-2 mt-5 pt-4 border-t border-slate-100">
      <input type="hidden" name="project_id" value={projectId} />
      <input
        type="text"
        name="title"
        placeholder="הוסף משימה חדשה..."
        required
        disabled={isPending}
        className="flex-1 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-60 placeholder:text-slate-400"
      />
      <button
        type="submit"
        disabled={isPending}
        className="px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-60 transition-colors"
      >
        {isPending ? '...' : 'הוסף'}
      </button>
    </form>
  )
}
