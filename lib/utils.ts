export function deadlineDisplay(deadline: string | null): { text: string; className: string } | null {
  if (!deadline) return null
  const d = new Date(deadline)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  d.setHours(0, 0, 0, 0)
  const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  const text = d.toLocaleDateString('he-IL', { day: 'numeric', month: 'short', year: 'numeric' })
  if (diffDays < 0) return { text: `${text} · באיחור`, className: 'text-red-500' }
  if (diffDays === 0) return { text: `${text} · היום`, className: 'text-red-500 font-semibold' }
  if (diffDays <= 7) return { text: `${text} · ${diffDays} ימים`, className: 'text-amber-600' }
  return { text, className: 'text-slate-500' }
}
